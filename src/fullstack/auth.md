# Authentication & Authorization

## What is Authentication & Authorization?

Authentication is the process of verifying who a user is, while authorization determines what that user is allowed to do. Together, they form the foundation of secure application access control.

## Example

### JWT Authentication System

```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthManager {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpire = process.env.JWT_EXPIRE || '30d';
  }

  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpire,
      issuer: 'your-app-name',
      audience: 'your-app-users'
    });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Hash password
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate refresh token
  generateRefreshToken() {
    return require('crypto').randomBytes(64).toString('hex');
  }
}

// middleware/auth.js
const authManager = new AuthManager();

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = authManager.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token.' 
    });
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied. User not authenticated.' 
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts
  message: {
    error: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authenticate,
  authorize,
  loginLimiter,
  authManager
};
```

### User Model with Authentication

```javascript
// models/User.js
const mongoose = require('mongoose');
const authManager = require('../utils/jwt');

const userSchema = new mongoose.Schema({
  // Basic info
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  
  // Profile
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String },
    bio: { type: String, maxlength: 500 }
  },
  
  // Account status
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Security
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Refresh tokens
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    userAgent: String,
    ipAddress: String
  }],
  
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await authManager.hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return authManager.comparePassword(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role
  };
  
  return authManager.generateToken(payload);
};

userSchema.methods.addRefreshToken = function(token, userAgent, ipAddress) {
  const refreshToken = {
    token,
    userAgent,
    ipAddress,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };
  
  this.refreshTokens.push(refreshToken);
  
  // Remove expired tokens
  this.refreshTokens = this.refreshTokens.filter(rt => rt.expiresAt > new Date());
  
  // Limit to 5 active refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  return this.save();
};

userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  return this.save();
};

userSchema.methods.clearRefreshTokens = function() {
  this.refreshTokens = [];
  return this.save();
};

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Static methods
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  
  if (user.isLocked) {
    throw new Error('Account temporarily locked due to failed login attempts');
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await this.handleFailedLogin(user);
    throw new Error('Invalid login credentials');
  }
  
  await this.handleSuccessfulLogin(user);
  return user;
};

userSchema.statics.handleFailedLogin = async function(user) {
  user.loginAttempts += 1;
  
  if (user.loginAttempts >= 5 && !user.isLocked) {
    user.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // Lock for 2 hours
  }
  
  await user.save();
};

userSchema.statics.handleSuccessfulLogin = async function(user) {
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save();
};

module.exports = mongoose.model('User', userSchema);
```

### Authentication Routes

```javascript
// routes/auth.js
const express = require('express');
const User = require('../models/User');
const authManager = require('../utils/auth');
const { authenticate, loginLimiter } = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists'
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password,
      profile: { firstName, lastName }
    });
    
    await user.save();
    
    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = authManager.generateRefreshToken();
    await user.addRefreshToken(refreshToken, req.get('User-Agent'), req.ip);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token,
      refreshToken
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findByCredentials(email, password);
    
    const token = user.generateAuthToken();
    const refreshToken = authManager.generateRefreshToken();
    await user.addRefreshToken(refreshToken, req.get('User-Agent'), req.ip);
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token,
      refreshToken
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    
    // Find user with this refresh token
    const user = await User.findOne({
      'refreshTokens.token': refreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Generate new access token
    const token = user.generateAuthToken();
    
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await req.user.removeRefreshToken(refreshToken);
    }
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout from all devices
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    await req.user.clearRefreshTokens();
    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile,
      lastLogin: req.user.lastLogin
    }
  });
});

module.exports = router;
```

## Real Use Case

### OAuth Integration with Google

**GitHub** and **Google** use OAuth for secure authentication:

```javascript
// services/oauth.js
const { google } = require('googleapis');
const User = require('../models/User');
const authManager = require('../utils/jwt');

class OAuthService {
  constructor() {
    this.googleOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  async googleAuth(code) {
    try {
      // Exchange code for tokens
      const { tokens } = await this.googleOAuth2Client.getToken(code);
      this.googleOAuth2Client.setCredentials(tokens);
      
      // Get user info
      const oauth2 = google.oauth2({ version: 'v2', auth: this.googleOAuth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();
      
      // Find or create user
      let user = await User.findOne({ email: userInfo.email });
      
      if (!user) {
        // Create new user from OAuth data
        user = new User({
          username: userInfo.email.split('@')[0] + '_' + Date.now(),
          email: userInfo.email,
          password: authManager.generateRefreshToken(), // Random password
          profile: {
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            avatar: userInfo.picture
          },
          isEmailVerified: userInfo.verified_email
        });
        
        await user.save();
      } else {
        // Update existing user's info
        if (!user.profile.avatar && userInfo.picture) {
          user.profile.avatar = userInfo.picture;
        }
        if (!user.isEmailVerified && userInfo.verified_email) {
          user.isEmailVerified = true;
        }
        await user.save();
      }
      
      // Generate tokens
      const token = user.generateAuthToken();
      const refreshToken = authManager.generateRefreshToken();
      await user.addRefreshToken(refreshToken, 'OAuth', 'OAuth');
      
      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile
        },
        token,
        refreshToken
      };
    } catch (error) {
      throw new Error('OAuth authentication failed');
    }
  }

  getGoogleAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];
    
    return this.googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
      prompt: 'consent'
    });
  }
}

// OAuth routes
router.get('/google', (req, res) => {
  const oauthService = new OAuthService();
  const url = oauthService.getGoogleAuthUrl();
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const oauthService = new OAuthService();
    const result = await oauthService.googleAuth(code);
    
    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?` +
      `token=${result.token}&refreshToken=${result.refreshToken}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=OAuth failed`);
  }
});
```

## Pro Tip

**Implement Multi-Factor Authentication (MFA)**

```javascript
// services/mfa.js
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

class MFAService {
  // Generate secret for user
  static generateSecret(userEmail) {
    return speakeasy.generateSecret({
      name: `Your App (${userEmail})`,
      issuer: 'Your App',
      length: 32
    });
  }

  // Generate QR code for secret
  static async generateQRCode(secret) {
    try {
      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: secret.name,
        issuer: secret.issuer
      });
      
      return await qrcode.toDataURL(otpauthUrl);
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  // Verify token
  static verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 steps before/after current time
    });
  }

  // Generate backup codes
  static generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(speakeasy.generateSecret().base32.slice(0, 8).toUpperCase());
    }
    return codes;
  }
}

// MFA routes
router.post('/mfa/setup', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.mfaSecret) {
      return res.status(400).json({
        error: 'MFA is already enabled for this account'
      });
    }
    
    const secret = MFAService.generateSecret(user.email);
    const qrCode = await MFAService.generateQRCode(secret);
    const backupCodes = MFAService.generateBackupCodes();
    
    // Store secret and backup codes (hashed)
    user.mfaSecret = secret.base32;
    user.mfaBackupCodes = backupCodes.map(code => 
      require('crypto').createHash('sha256').update(code).digest('hex')
    );
    user.mfaEnabled = false; // Enable after verification
    await user.save();
    
    res.json({
      secret: secret.base32,
      qrCode,
      backupCodes // Only show once during setup
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/mfa/verify', authenticate, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.mfaSecret) {
      return res.status(400).json({
        error: 'MFA not set up for this account'
      });
    }
    
    const isValid = MFAService.verifyToken(user.mfaSecret, token);
    
    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid verification code'
      });
    }
    
    user.mfaEnabled = true;
    await user.save();
    
    res.json({
      message: 'MFA enabled successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Exercise

**Build a Complete Authentication System**

Create a comprehensive authentication system with the following features:

```javascript
// Exercise: Complete Auth System
// Requirements:
// 1. User registration and login
// 2. JWT token management
// 3. Password reset functionality
// 4. Email verification
// 5. Rate limiting
// 6. Session management
// 7. Role-based authorization

// Solution Implementation:

// 1. Password reset service
class PasswordResetService {
  static async generateResetToken(user) {
    const token = require('crypto').randomBytes(32).toString('hex');
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(expires);
    await user.save();
    
    return token;
  }

  static async sendResetEmail(user, token) {
    // Implementation with email service
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    // Send email logic here
    console.log(`Password reset link: ${resetUrl}`);
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }
    
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    return user;
  }
}

// 2. Email verification service
class EmailVerificationService {
  static async generateVerificationToken(user) {
    const token = require('crypto').randomBytes(32).toString('hex');
    
    user.emailVerificationToken = token;
    await user.save();
    
    return token;
  }

  static async sendVerificationEmail(user, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    // Send email logic here
    console.log(`Email verification link: ${verificationUrl}`);
  }

  static async verifyEmail(token) {
    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      throw new Error('Invalid verification token');
    }
    
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    
    return user;
  }
}

// 3. Enhanced authentication middleware
const enhancedAuth = {
  // Require email verification
  requireVerified: (req, res, next) => {
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        error: 'Email verification required. Please verify your email address.'
      });
    }
    next();
  },

  // Require MFA
  requireMFA: (req, res, next) => {
    if (!req.user.mfaEnabled) {
      return res.status(403).json({
        error: 'Multi-factor authentication required'
      });
    }
    next();
  },

  // Check session validity
  validateSession: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'Account deactivated or not found'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid session' });
    }
  }
};
```

**Your Tasks:**
1. Implement the complete authentication system
2. Add email verification functionality
3. Create password reset flow
4. Implement MFA support
5. Add comprehensive rate limiting
6. Create session management
7. Add audit logging for security events

This exercise teaches you:
- JWT token management and security
- Password hashing and comparison
- OAuth integration
- Multi-factor authentication
- Rate limiting and security best practices
- Session management and validation
- Email verification workflows

---

**Next Up**: Learn about security best practices for web applications! Security Best Practices
