# Backend Development with Node.js

Node.js enables JavaScript to run on the server-side, allowing you to build scalable, high-performance backend applications using the same language you use for frontend development.

## 🎯 What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to:
- **Run JavaScript on the server**: Full-stack JavaScript development
- **Build scalable applications**: Event-driven, non-blocking I/O
- **Create APIs**: RESTful and GraphQL endpoints
- **Handle real-time data**: WebSockets, server-sent events
- **Integrate with databases**: MongoDB, PostgreSQL, Redis, and more

## 🚀 Why Node.js?

### Performance Benefits
- **Non-blocking I/O**: Handle many concurrent connections
- **Event-driven architecture**: Efficient resource usage
- **Fast execution**: V8 engine optimization
- **Lightweight**: Minimal overhead and memory usage

### Developer Benefits
- **Single language**: JavaScript for frontend and backend
- **NPM ecosystem**: Largest package registry
- **Full-stack frameworks**: Express, NestJS, Koa
- **Real-time capabilities**: Built-in support for WebSockets

## 🛠️ Getting Started

### Installation

```bash
# Install Node.js (includes npm)
# Download from https://nodejs.org or use version manager

# Verify installation
node --version
npm --version

# Create new project
mkdir my-backend
cd my-backend
npm init -y
```

### Basic Server Setup

```javascript
// server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello, World!' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 📁 Express.js Framework

Express.js is the most popular Node.js framework for building web applications and APIs.

### Installation and Setup

```bash
npm install express
```

### Basic Express Server

```javascript
// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🛣️ RESTful API Design

### REST Principles

- **Resources**: Nouns (users, products, orders)
- **HTTP Methods**: Verbs (GET, POST, PUT, DELETE)
- **Status Codes**: Proper HTTP status codes
- **Stateless**: Each request contains all needed information

### Complete CRUD API

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

// GET /api/users - Get all users
router.get('/', getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user
router.post('/', validateUser, createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateUser, updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

module.exports = router;
```

## 🔐 Authentication & Authorization

### JWT Authentication

```bash
npm install jsonwebtoken bcryptjs
```

```javascript
// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

## 🗄️ Database Integration

### MongoDB with Mongoose

```bash
npm install mongoose
```

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
```

## 🧪 Testing Node.js Applications

### Unit Testing with Jest

```bash
npm install --save-dev jest supertest
```

```javascript
// __tests__/routes/users.test.js
const request = require('supertest');
const app = require('../../app');

describe('User Routes', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
    });
  });
});
```

## 🚀 Performance Optimization

### Caching with Redis

```bash
npm install redis
```

```javascript
// middleware/cache.js
const redis = require('../config/redis');

const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        redis.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cache;
```

## 🔧 Best Practices

### Security Best Practices

```javascript
// middleware/security.js
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const securityMiddleware = [
  helmet(), // Set security headers
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
  mongoSanitize(), // Prevent NoSQL injection
];

module.exports = securityMiddleware;
```

### Error Handling

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
```

---

**Next Up**: Learn about database design and management! 🗄️
