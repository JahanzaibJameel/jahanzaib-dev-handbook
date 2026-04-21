# Database Design Mastery

## What is Database Design?

Database design is the process of structuring data in a way that ensures efficiency, integrity, and scalability. It involves choosing the right database type, designing schemas, creating relationships, and optimizing queries for performance.

## Example

### MongoDB Schema Design

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic information
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
    minlength: 6
  },
  
  // Profile information
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String },
    bio: { type: String, maxlength: 500 },
    location: { type: String },
    website: { type: String }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Relationships
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
```

### PostgreSQL Schema Design

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post categories junction table
CREATE TABLE post_categories (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Real Use Case

### E-Commerce Database Design

**Amazon** and **Shopify** use complex database designs for e-commerce:

```javascript
// MongoDB E-Commerce Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  
  // Pricing
  price: {
    current: { type: Number, required: true, min: 0 },
    original: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' }
  },
  
  // Inventory
  inventory: {
    quantity: { type: Number, required: true, min: 0 },
    trackQuantity: { type: Boolean, default: true },
    allowBackorder: { type: Boolean, default: false }
  },
  
  // Categories and tags
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tags: [String],
  
  // Media
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    isMain: { type: Boolean, default: false }
  }],
  
  // Variants (for products with options like size, color)
  variants: [{
    name: { type: String, required: true }, // e.g., "Size", "Color"
    options: [String], // e.g., ["S", "M", "L", "XL"]
    required: { type: Boolean, default: false }
  }],
  
  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      name: String,
      value: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // Pricing
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  shipping: { type: Number, required: true, min: 0 },
  discount: { type: Number, min: 0 },
  total: { type: Number, required: true, min: 0 },
  
  // Shipping address
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## Pro Tip

**Implement Database Indexing Strategy**

```javascript
// MongoDB Indexing Strategy
class DatabaseOptimizer {
  static async createIndexes() {
    const User = require('../models/User');
    const Post = require('../models/Post');
    const Product = require('../models/Product');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ 'profile.location': 1 });
    await User.collection.createIndex({ createdAt: -1 });

    // Post indexes
    await Post.collection.createIndex({ author: 1 });
    await Post.collection.createIndex({ status: 1 });
    await Post.collection.createIndex({ publishedAt: -1 });
    await Post.collection.createIndex({ tags: 1 });
    await Post.collection.createIndex({ 
      title: 'text', 
      content: 'text', 
      excerpt: 'text' 
    }, { 
      name: 'search_index',
      weights: {
        title: 10,
        content: 5,
        excerpt: 3
      }
    });

    // Compound indexes for common queries
    await Post.collection.createIndex({ 
      status: 1, 
      publishedAt: -1 
    });
    await Post.collection.createIndex({ 
      author: 1, 
      status: 1 
    });

    // Product indexes
    await Product.collection.createIndex({ sku: 1 }, { unique: true });
    await Product.collection.createIndex({ categories: 1 });
    await Product.collection.createIndex({ tags: 1 });
    await Product.collection.createIndex({ 'price.current': 1 });
    await Product.collection.createIndex({ status: 1 });
    await Product.collection.createIndex({ 
      name: 'text', 
      description: 'text' 
    }, { 
      name: 'product_search'
    });

    console.log('Database indexes created successfully');
  }

  static async analyzeQueryPerformance() {
    const db = mongoose.connection.db;
    
    // Get collection statistics
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const stats = await db.collection(collection.name).stats();
      console.log(`Collection: ${collection.name}`);
      console.log(`Documents: ${stats.count}`);
      console.log(`Avg doc size: ${stats.avgObjSize} bytes`);
      console.log(`Total size: ${stats.size} bytes`);
      
      // Get index information
      const indexes = await db.collection(collection.name).indexInformation();
      console.log(`Indexes: ${Object.keys(indexes).length}`);
      console.log('---');
    }
  }
}
```

## Exercise

**Design a Complete Blog Database System**

Create a comprehensive database design for a blog platform:

```javascript
// Database Design Exercise
// Design a database for a blog platform with the following requirements:
// 1. Users can create posts and comments
// 2. Posts can have multiple categories
// 3. Users can follow other users
// 4. Posts can be liked by users
// 5. Support draft and published posts
// 6. Track post views and engagement

// Solution:

// 1. MongoDB Schema Design
const blogUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    displayName: String,
    bio: String,
    avatar: String,
    website: String
  },
  social: {
    twitter: String,
    linkedin: String,
    github: String
  },
  stats: {
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 500 },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BlogUser', 
    required: true 
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tags: [String],
  featuredImage: String,
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    focusKeyword: String
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    readTime: { type: Number } // Estimated reading time in minutes
  },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  color: String, // For UI display
  icon: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  postsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 1000 },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BlogUser', 
    required: true 
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BlogPost', 
    required: true 
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogUser' }],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 2. Database Operations Class
class BlogDatabase {
  static async initialize() {
    await this.createIndexes();
    await this.seedData();
  }

  static async createIndexes() {
    // User indexes
    await BlogUser.collection.createIndex({ email: 1 }, { unique: true });
    await BlogUser.collection.createIndex({ username: 1 }, { unique: true });
    await BlogUser.collection.createIndex({ 'stats.postsCount': -1 });
    await BlogUser.collection.createIndex({ createdAt: -1 });

    // Post indexes
    await BlogPost.collection.createIndex({ slug: 1 }, { unique: true });
    await BlogPost.collection.createIndex({ author: 1 });
    await BlogPost.collection.createIndex({ status: 1 });
    await BlogPost.collection.createIndex({ publishedAt: -1 });
    await BlogPost.collection.createIndex({ categories: 1 });
    await BlogPost.collection.createIndex({ tags: 1 });
    await BlogPost.collection.createIndex({ 'stats.views': -1 });
    await BlogPost.collection.createIndex({ 'stats.likes': -1 });
    
    // Search index
    await BlogPost.collection.createIndex({
      title: 'text',
      content: 'text',
      excerpt: 'text',
      tags: 'text'
    }, {
      name: 'blog_search',
      weights: {
        title: 10,
        content: 5,
        excerpt: 3,
        tags: 8
      }
    });

    // Category indexes
    await Category.collection.createIndex({ slug: 1 }, { unique: true });
    await Category.collection.createIndex({ parentCategory: 1 });

    // Comment indexes
    await Comment.collection.createIndex({ post: 1 });
    await Comment.collection.createIndex({ author: 1 });
    await Comment.collection.createIndex({ parent: 1 });
    await Comment.collection.createIndex({ createdAt: -1 });
  }

  static async getPopularPosts(limit = 10) {
    return BlogPost.find({ status: 'published' })
      .sort({ 'stats.likes': -1, 'stats.views': -1 })
      .limit(limit)
      .populate('author', 'username profile.displayName profile.avatar')
      .populate('categories', 'name slug');
  }

  static async getPostsByCategory(categorySlug, page = 1, limit = 10) {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return null;

    const posts = await BlogPost.find({ 
      categories: category._id, 
      status: 'published' 
    })
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'username profile.displayName profile.avatar');

    const total = await BlogPost.countDocuments({ 
      categories: category._id, 
      status: 'published' 
    });

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}
```

**Your Tasks:**
1. Implement the complete blog database schema
2. Create database migration scripts
3. Add proper indexing strategy
4. Implement data validation and constraints
5. Create database backup and restore procedures
6. Add database monitoring and performance optimization
7. Implement database testing strategies

This exercise teaches you:
- Database schema design principles
- SQL vs NoSQL database selection
- Indexing and performance optimization
- Data relationships and integrity
- Database security and backup strategies
- Scalability considerations

---

**Next Up**: Learn about authentication and authorization systems! Authentication & Authorization
