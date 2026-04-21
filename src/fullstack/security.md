# Security Best Practices

## What is Web Security?

Web security encompasses the practices and technologies used to protect websites, web applications, and web services from various threats and vulnerabilities. It's a critical aspect of modern web development that protects both users and businesses.

## Example

### Input Validation and Sanitization

```javascript
// utils/validation.js
const validator = require('validator');
const xss = require('xss');
const mongoose = require('mongoose');

class SecurityValidator {
  // Sanitize and validate user input
  static sanitizeInput(input, type = 'string') {
    if (!input) return null;
    
    switch (type) {
      case 'string':
        return this.sanitizeString(input);
      case 'email':
        return this.sanitizeEmail(input);
      case 'url':
        return this.sanitizeUrl(input);
      case 'html':
        return this.sanitizeHtml(input);
      case 'numeric':
        return this.sanitizeNumeric(input);
      default:
        return this.sanitizeString(input);
    }
  }

  static sanitizeString(input) {
    if (typeof input !== 'string') return '';
    
    return validator.escape(
      validator.trim(input)
    );
  }

  static sanitizeEmail(input) {
    if (!validator.isEmail(input)) {
      throw new Error('Invalid email format');
    }
    return validator.normalizeEmail(input);
  }

  static sanitizeUrl(input) {
    if (!validator.isURL(input)) {
      throw new Error('Invalid URL format');
    }
    return validator.normalizeUrl(input);
  }

  static sanitizeHtml(input) {
    const xssOptions = {
      whiteList: {
        p: [],
        br: [],
        strong: [],
        em: [],
        ul: [],
        ol: [],
        li: [],
        a: ['href', 'title'],
        h1: [],
        h2: [],
        h3: []
      },
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    };
    
    return xss(input, xssOptions);
  }

  static sanitizeNumeric(input) {
    const num = validator.toFloat(input);
    if (isNaN(num)) {
      throw new Error('Invalid number format');
    }
    return num;
  }

  // Validate MongoDB ObjectId
  static validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    return id;
  }

  // Validate password strength
  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!hasUpperCase) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      throw new Error('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      throw new Error('Password must contain at least one special character');
    }

    return true;
  }
}

// middleware/validation.js
const SecurityValidator = require('../utils/validation');

const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body
      if (schema.body) {
        for (const [field, rules] of Object.entries(schema.body)) {
          const value = req.body[field];
          
          if (rules.required && !value) {
            return res.status(400).json({
              error: `${field} is required`
            });
          }
          
          if (value) {
            req.body[field] = SecurityValidator.sanitizeInput(value, rules.type);
          }
        }
      }

      // Validate query parameters
      if (schema.query) {
        for (const [field, rules] of Object.entries(schema.query)) {
          const value = req.query[field];
          
          if (value) {
            req.query[field] = SecurityValidator.sanitizeInput(value, rules.type);
          }
        }
      }

      // Validate URL parameters
      if (schema.params) {
        for (const [field, rules] of Object.entries(schema.params)) {
          const value = req.params[field];
          
          if (rules.required && !value) {
            return res.status(400).json({
              error: `${field} is required`
            });
          }
          
          if (value && rules.type === 'objectId') {
            req.params[field] = SecurityValidator.validateObjectId(value);
          }
        }
      }

      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
};

module.exports = { SecurityValidator, validateInput };
```

### Security Headers Implementation

```javascript
// middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

class SecurityMiddleware {
  static setupSecurity(app) {
    // Helmet for security headers
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.example.com"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          manifestSrc: ["'self'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per window
      message: {
        error: 'Too many requests from this IP, please try again later.'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    app.use(limiter);

    // CORS configuration
    const cors = require('cors');
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
      optionsSuccessStatus: 200
    }));

    // Prevent parameter pollution
    app.use(require('hpp')());

    // Hide express details
    app.set('x-powered-by', false);
  }

  // CSRF protection middleware
  static csrfProtection() {
    const csrf = require('csurf');
    return csrf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      }
    });
  }

  // SQL injection prevention for raw queries
  static sanitizeQuery(query, params) {
    if (!params || params.length === 0) {
      return query;
    }

    // Basic parameterized query simulation
    let sanitizedQuery = query;
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`;
      sanitizedQuery = sanitizedQuery.replace(placeholder, this.escapeSqlValue(param));
    });

    return sanitizedQuery;
  }

  static escapeSqlValue(value) {
    if (typeof value === 'string') {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    if (value === null) {
      return 'NULL';
    }
    return 'DEFAULT';
  }
}
```

## Real Use Case

### E-Commerce Payment Security

**Stripe** and **PayPal** implement comprehensive security for payment processing:

```javascript
// services/paymentSecurity.js
const crypto = require('crypto');
const SecurityValidator = require('../utils/validation');

class PaymentSecurityService {
  // Encrypt sensitive payment data
  static encryptPaymentData(data) {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.PAYMENT_ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // Decrypt payment data
  static decryptPaymentData(encryptedData) {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.PAYMENT_ENCRYPTION_KEY, 'salt', 32);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  // Validate payment amount
  static validatePaymentAmount(amount) {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      throw new Error('Invalid payment amount');
    }
    
    if (numAmount <= 0) {
      throw new Error('Payment amount must be positive');
    }
    
    if (numAmount > 10000) {
      throw new Error('Payment amount exceeds maximum limit');
    }
    
    return numAmount;
  }

  // Generate secure payment token
  static generatePaymentToken(orderId, userId) {
    const payload = {
      orderId,
      userId,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };
    
    return crypto.createHmac('sha256', process.env.PAYMENT_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  // Verify payment webhook signature
  static verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

// Payment processing with security
router.post('/process-payment', authenticate, async (req, res) => {
  try {
    const { amount, cardNumber, cvv, expiry } = req.body;
    
    // Validate payment amount
    const validatedAmount = PaymentSecurityService.validatePaymentAmount(amount);
    
    // Sanitize and validate card details
    const sanitizedCardNumber = SecurityValidator.sanitizeInput(cardNumber.replace(/\s/g, ''));
    const sanitizedCvv = SecurityValidator.sanitizeInput(cvv);
    
    // Basic card validation
    if (!/^\d{16}$/.test(sanitizedCardNumber)) {
      return res.status(400).json({ error: 'Invalid card number' });
    }
    
    if (!/^\d{3,4}$/.test(sanitizedCvv)) {
      return res.status(400).json({ error: 'Invalid CVV' });
    }
    
    // Encrypt sensitive data
    const encryptedCardData = PaymentSecurityService.encryptPaymentData({
      cardNumber: sanitizedCardNumber,
      cvv: sanitizedCvv,
      expiry
    });
    
    // Process payment with payment gateway
    const paymentResult = await processPaymentWithGateway({
      amount: validatedAmount,
      encryptedCardData,
      userId: req.user.id
    });
    
    res.json({
      success: true,
      transactionId: paymentResult.transactionId,
      amount: validatedAmount
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## Pro Tip

**Implement Comprehensive Logging and Monitoring**

```javascript
// services/securityLogger.js
const winston = require('winston');
const path = require('path');

class SecurityLogger {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ 
          filename: path.join('logs', 'security.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }

  logSecurityEvent(event, details) {
    this.logger.info('SECURITY_EVENT', {
      event,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  logSuspiciousActivity(ip, userAgent, activity) {
    this.logger.warn('SUSPICIOUS_ACTIVITY', {
      ip,
      userAgent,
      activity,
      timestamp: new Date().toISOString()
    });
  }

  logAuthenticationAttempt(email, success, ip, userAgent) {
    this.logger.info('AUTH_ATTEMPT', {
      email,
      success,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });
  }

  logDataAccess(userId, resource, action, success) {
    this.logger.info('DATA_ACCESS', {
      userId,
      resource,
      action,
      success,
      timestamp: new Date().toISOString()
    });
  }
}

// Security monitoring middleware
const securityLogger = new SecurityLogger();

const securityMonitor = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  const requestInfo = {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    method: req.method,
    url: req.url,
    userId: req.user?.id
  };

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempt
    /union.*select/i,  // SQL injection attempt
    /javascript:/i,  // JavaScript protocol
    /data:/i  // Data protocol
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(req.url) || pattern.test(JSON.stringify(req.body))
  );

  if (isSuspicious) {
    securityLogger.logSuspiciousActivity(
      req.ip,
      req.get('User-Agent'),
      `Suspicious pattern detected in ${req.method} ${req.url}`
    );
  }

  // Monitor response
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    if (res.statusCode >= 400) {
      securityLogger.logSecurityEvent('HTTP_ERROR', {
        ...requestInfo,
        statusCode: res.statusCode,
        responseTime
      });
    }

    originalSend.call(this, data);
  };

  next();
};

// Intrusion detection
class IntrusionDetection {
  static detectBruteForce(ip, attempts, timeWindow = 300000) { // 5 minutes
    const recentAttempts = attempts.filter(attempt => 
      Date.now() - attempt.timestamp < timeWindow
    );

    if (recentAttempts.length > 10) {
      securityLogger.logSecurityEvent('BRUTE_FORCE_DETECTED', {
        ip,
        attempts: recentAttempts.length,
        timeWindow
      });
      
      return true;
    }

    return false;
  }

  static detectAbnormalRequestPattern(requests) {
    // Analyze request patterns for anomalies
    const endpoints = {};
    
    requests.forEach(req => {
      const endpoint = req.url.split('?')[0];
      endpoints[endpoint] = (endpoints[endpoint] || 0) + 1;
    });

    // Check for unusual endpoint access patterns
    const totalRequests = requests.length;
    for (const [endpoint, count] of Object.entries(endpoints)) {
      const percentage = (count / totalRequests) * 100;
      
      if (percentage > 80 && endpoint !== '/') {
        securityLogger.logSecurityEvent('ABNORMAL_PATTERN', {
          endpoint,
          percentage,
          totalRequests
        });
        
        return true;
      }
    }

    return false;
  }
}
```

## Exercise

**Build a Complete Security System**

Create a comprehensive security system for a web application:

```javascript
// Exercise: Complete Security Implementation
// Requirements:
// 1. Input validation and sanitization
// 2. Security headers implementation
// 3. Rate limiting and DDoS protection
// 4. Authentication security
// 5. Data encryption
// 6. Security logging and monitoring
// 7. Intrusion detection

// Solution Implementation:

// 1. Advanced input validation
class AdvancedSecurityValidator {
  static validateFileUpload(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('File type not allowed');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size exceeds limit');
    }
    
    // Scan for malicious content
    return this.scanFileForMalware(file);
  }

  static async scanFileForMalware(file) {
    // Implement virus scanning logic
    // This would integrate with services like ClamAV or cloud APIs
    return true; // Placeholder
  }

  static validateApiKey(apiKey) {
    const keyPattern = /^[a-f0-9]{32}$/;
    
    if (!keyPattern.test(apiKey)) {
      throw new Error('Invalid API key format');
    }
    
    return apiKey;
  }

  static sanitizeFilename(filename) {
    // Remove dangerous characters
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }
}

// 2. Advanced rate limiting
class AdvancedRateLimiter {
  constructor() {
    this.clients = new Map();
  }

  middleware(options = {}) {
    const {
      windowMs = 15 * 60 * 1000, // 15 minutes
      maxRequests = 100,
      skipSuccessfulRequests = false,
      skipFailedRequests = false
    } = options;

    return (req, res, next) => {
      const clientId = this.getClientId(req);
      const now = Date.now();
      
      if (!this.clients.has(clientId)) {
        this.clients.set(clientId, {
          requests: [],
          resetTime: now + windowMs
        });
      }

      const client = this.clients.get(clientId);
      
      // Clean old requests
      client.requests = client.requests.filter(timestamp => 
        now - timestamp < windowMs
      );

      // Check if window has expired
      if (now > client.resetTime) {
        client.requests = [];
        client.resetTime = now + windowMs;
      }

      // Check rate limit
      if (client.requests.length >= maxRequests) {
        securityLogger.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
          clientId,
          requests: client.requests.length,
          limit: maxRequests
        });
        
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((client.resetTime - now) / 1000)
        });
      }

      // Add current request
      client.requests.push(now);

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - client.requests.length),
        'X-RateLimit-Reset': new Date(client.resetTime).toISOString()
      });

      next();
    };
  }

  getClientId(req) {
    // Use IP address and user ID if available
    const userId = req.user?.id;
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  }
}

// 3. Data encryption service
class DataEncryptionService {
  static encryptSensitiveData(data, key = process.env.ENCRYPTION_KEY) {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(16);
    
    const keyDerivation = crypto.pbkdf2Sync(key, salt, 100000, 32, 'sha256');
    const cipher = crypto.createCipher(algorithm, keyDerivation, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      salt: salt.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  static decryptSensitiveData(encryptedData, key = process.env.ENCRYPTION_KEY) {
    const algorithm = 'aes-256-gcm';
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const salt = Buffer.from(encryptedData.salt, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    
    const keyDerivation = crypto.pbkdf2Sync(key, salt, 100000, 32, 'sha256');
    const decipher = crypto.createDecipher(algorithm, keyDerivation, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  static hashData(data) {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }
}
```

**Your Tasks:**
1. Implement the complete security system
2. Add comprehensive input validation
3. Create advanced rate limiting
4. Implement data encryption
5. Add security logging and monitoring
6. Create intrusion detection
7. Add security testing

This exercise teaches you:
- Input validation and sanitization techniques
- Security headers and CORS configuration
- Rate limiting and DDoS protection
- Data encryption and hashing
- Security logging and monitoring
- Intrusion detection systems
- Security testing and vulnerability assessment

---

**Next Up**: Learn about project structure and architecture! Project Structure & Architecture
