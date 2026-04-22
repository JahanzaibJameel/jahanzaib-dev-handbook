# System Design Patterns

A comprehensive guide to architectural and design patterns for building scalable, maintainable, and robust software systems.

## **Introduction to Design Patterns**

Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices and provide a shared vocabulary for developers to communicate complex design concepts.

### **Why Use Design Patterns?**
- **Proven Solutions**: Time-tested approaches to common problems
- **Shared Vocabulary**: Common language for discussing design decisions
- **Code Quality**: Promotes maintainable and scalable code
- **Faster Development**: Reuse established patterns instead of reinventing

---

## **Creational Patterns**

### **Singleton Pattern**

**What is it?**
Ensures a class has only one instance and provides global access to it.

**When to use?**
- Database connection pools
- Configuration managers
- Logging systems
- Cache managers

**Example:**
```javascript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = this.createConnection();
    DatabaseConnection.instance = this;
  }
  
  createConnection() {
    // Database connection logic
    return { connected: true };
  }
  
  static getInstance() {
    return new DatabaseConnection();
  }
}

// Usage
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true
```

### **Factory Pattern**

**What is it?**
Creates objects without specifying the exact class of object that will be created.

**When to use?**
- When you need to create objects with common interface
- When you want to hide object creation logic
- When you need to add new types without modifying existing code

**Example:**
```javascript
class Car {
  constructor(model, year) {
    this.model = model;
    this.year = year;
  }
  
  drive() {
    console.log(`Driving ${this.model} from ${this.year}`);
  }
}

class CarFactory {
  static createCar(type, model, year) {
    switch (type) {
      case 'sedan':
        return new Car(`${model} Sedan`, year);
      case 'suv':
        return new Car(`${model} SUV`, year);
      case 'sports':
        return new Car(`${model} Sports Car`, year);
      default:
        throw new Error('Unknown car type');
    }
  }
}

// Usage
const myCar = CarFactory.createCar('sports', 'Ferrari', 2023);
myCar.drive();
```

### **Builder Pattern**

**What is it?**
Separates the construction of a complex object from its representation.

**When to use?**
- When object construction has multiple steps
- When you need different representations of the same object
- When object construction is complex

**Example:**
```javascript
class Computer {
  constructor() {
    this.cpu = null;
    this.ram = null;
    this.storage = null;
    this.graphics = null;
  }
}

class ComputerBuilder {
  constructor() {
    this.computer = new Computer();
  }
  
  setCPU(cpu) {
    this.computer.cpu = cpu;
    return this;
  }
  
  setRAM(ram) {
    this.computer.ram = ram;
    return this;
  }
  
  setStorage(storage) {
    this.computer.storage = storage;
    return this;
  }
  
  setGraphics(graphics) {
    this.computer.graphics = graphics;
    return this;
  }
  
  build() {
    return this.computer;
  }
}

// Usage
const gamingPC = new ComputerBuilder()
  .setCPU('Intel i9')
  .setRAM('32GB DDR4')
  .setStorage('1TB NVMe SSD')
  .setGraphics('RTX 4090')
  .build();
```

---

## **Structural Patterns**

### **Adapter Pattern**

**What is it?**
Allows incompatible interfaces to work together.

**When to use?**
- When you need to use existing classes with incompatible interfaces
- When you want to create reusable classes that cooperate with unrelated classes

**Example:**
```javascript
// Legacy payment system
class LegacyPaymentSystem {
  makePayment(amount) {
    console.log(`Legacy payment: $${amount}`);
  }
}

// New payment interface
class ModernPaymentGateway {
  processPayment(paymentDetails) {
    console.log(`Modern payment: $${paymentDetails.amount} for ${paymentDetails.merchant}`);
  }
}

// Adapter
class PaymentAdapter {
  constructor(legacySystem) {
    this.legacySystem = legacySystem;
  }
  
  processPayment(paymentDetails) {
    this.legacySystem.makePayment(paymentDetails.amount);
  }
}

// Usage
const legacyPayment = new LegacyPaymentSystem();
const adapter = new PaymentAdapter(legacyPayment);
adapter.processPayment({ amount: 100, merchant: 'Amazon' });
```

### **Decorator Pattern**

**What is it?**
Adds new functionality to objects dynamically without altering their structure.

**When to use?**
- When you need to add responsibilities to individual objects dynamically
- When extension by subclassing is impractical

**Example:**
```javascript
class Coffee {
  cost() {
    return 5;
  }
  
  description() {
    return 'Basic coffee';
  }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  
  cost() {
    return this.coffee.cost() + 1;
  }
  
  description() {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  
  cost() {
    return this.coffee.cost() + 0.5;
  }
  
  description() {
    return this.coffee.description() + ', sugar';
  }
}

// Usage
let myCoffee = new Coffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SugarDecorator(myCoffee);
console.log(myCoffee.description()); // 'Basic coffee, milk, sugar'
console.log(myCoffee.cost()); // 6.5
```

### **Proxy Pattern**

**What is it?**
Provides a surrogate or placeholder for another object to control access to it.

**When to use?**
- When you need to control access to an object
- When you need to add functionality when accessing an object
- For lazy loading, caching, or access control

**Example:**
```javascript
class RealImage {
  constructor(filename) {
    this.filename = filename;
    this.loadImage();
  }
  
  loadImage() {
    console.log(`Loading image: ${this.filename}`);
    // Expensive operation
  }
  
  display() {
    console.log(`Displaying image: ${this.filename}`);
  }
}

class ImageProxy {
  constructor(filename) {
    this.filename = filename;
    this.realImage = null;
  }
  
  display() {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename);
    }
    this.realImage.display();
  }
}

// Usage
const proxy = new ImageProxy('large_image.jpg');
// Image not loaded yet
proxy.display(); // Image loads and displays
proxy.display(); // Uses cached image
```

---

## **Behavioral Patterns**

### **Observer Pattern**

**What is it?**
Defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified.

**When to use?**
- When a change in one object requires changing others
- When you don't know how many objects need to be notified
- For event handling systems

**Example:**
```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class WeatherStation extends Subject {
  constructor() {
    super();
    this.temperature = 0;
  }
  
  setTemperature(temp) {
    this.temperature = temp;
    this.notify(this.temperature);
  }
}

class TemperatureDisplay {
  constructor(name) {
    this.name = name;
  }
  
  update(temperature) {
    console.log(`${this.name}: Temperature is ${temperature}°C`);
  }
}

// Usage
const weatherStation = new WeatherStation();
const display1 = new TemperatureDisplay('Display 1');
const display2 = new TemperatureDisplay('Display 2');

weatherStation.subscribe(display1);
weatherStation.subscribe(display2);

weatherStation.setTemperature(25);
```

### **Strategy Pattern**

**What is it?**
Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

**When to use?**
- When you have multiple algorithms for a task
- When you want to switch algorithms at runtime
- When you want to avoid conditional statements

**Example:**
```javascript
class PaymentStrategy {
  pay(amount) {
    throw new Error('Must implement pay method');
  }
}

class CreditCardPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} with credit card`);
  }
}

class PayPalPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} with PayPal`);
  }
}

class CryptoPayment extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid $${amount} with cryptocurrency`);
  }
}

class ShoppingCart {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  
  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  
  checkout(amount) {
    this.paymentStrategy.pay(amount);
  }
}

// Usage
const cart = new ShoppingCart(new CreditCardPayment());
cart.checkout(100);

cart.setPaymentStrategy(new PayPalPayment());
cart.checkout(50);
```

### **Command Pattern**

**What is it?**
Encapsulates a request as an object, thereby letting you parameterize clients with different requests.

**When to use?**
- When you need to parameterize objects with operations
- When you need to queue operations, log operations, or support undo/redo

**Example:**
```javascript
class Command {
  execute() {
    throw new Error('Must implement execute method');
  }
  
  undo() {
    throw new Error('Must implement undo method');
  }
}

class Light {
  turnOn() {
    console.log('Light is on');
  }
  
  turnOff() {
    console.log('Light is off');
  }
}

class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }
  
  execute() {
    this.light.turnOn();
  }
  
  undo() {
    this.light.turnOff();
  }
}

class LightOffCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }
  
  execute() {
    this.light.turnOff();
  }
  
  undo() {
    this.light.turnOn();
  }
}

class RemoteControl {
  constructor() {
    this.command = null;
    this.history = [];
  }
  
  setCommand(command) {
    this.command = command;
  }
  
  pressButton() {
    this.command.execute();
    this.history.push(this.command);
  }
  
  pressUndo() {
    if (this.history.length > 0) {
      const lastCommand = this.history.pop();
      lastCommand.undo();
    }
  }
}

// Usage
const light = new Light();
const remote = new RemoteControl();

remote.setCommand(new LightOnCommand(light));
remote.pressButton(); // Light is on

remote.setCommand(new LightOffCommand(light));
remote.pressButton(); // Light is off

remote.pressUndo(); // Light is on
```

---

## **Architectural Patterns**

### **MVC (Model-View-Controller)**

**What is it?**
Separates application into three interconnected components: Model, View, and Controller.

**Components:**
- **Model**: Data and business logic
- **View**: User interface
- **Controller**: Handles user input and updates model/view

**Example:**
```javascript
// Model
class TodoModel {
  constructor() {
    this.todos = [];
    this.listeners = [];
  }
  
  addTodo(text) {
    const todo = {
      id: Date.now(),
      text,
      completed: false
    };
    this.todos.push(todo);
    this.notifyListeners();
  }
  
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.notifyListeners();
    }
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
  }
  
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.todos));
  }
}

// View
class TodoView {
  constructor() {
    this.container = document.getElementById('app');
  }
  
  render(todos) {
    this.container.innerHTML = `
      <ul>
        ${todos.map(todo => `
          <li>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   data-id="${todo.id}">
            ${todo.text}
          </li>
        `).join('')}
      </ul>
    `;
  }
}

// Controller
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    
    this.model.subscribe(todos => this.view.render(todos));
    
    this.view.container.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') {
        this.model.toggleTodo(parseInt(e.target.dataset.id));
      }
    });
  }
  
  addTodo(text) {
    this.model.addTodo(text);
  }
}

// Usage
const model = new TodoModel();
const view = new TodoView();
const controller = new TodoController(model, view);

controller.addTodo('Learn design patterns');
controller.addTodo('Build amazing applications');
```

### **Repository Pattern**

**What is it?**
Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.

**When to use?**
- To separate data access logic from business logic
- To make code more testable
- To switch data sources easily

**Example:**
```javascript
class UserRepository {
  constructor(database) {
    this.database = database;
  }
  
  async findById(id) {
    const user = await this.database.users.findById(id);
    return user;
  }
  
  async save(user) {
    const savedUser = await this.database.users.save(user);
    return savedUser;
  }
  
  async delete(id) {
    await this.database.users.delete(id);
  }
  
  async findAll() {
    const users = await this.database.users.findAll();
    return users;
  }
}

// Usage
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async createUser(userData) {
    const user = {
      ...userData,
      createdAt: new Date(),
      id: Date.now()
    };
    
    return await this.userRepository.save(user);
  }
  
  async getUser(id) {
    return await this.userRepository.findById(id);
  }
}

const database = {
  users: {
    findById: (id) => Promise.resolve({ id, name: 'John' }),
    save: (user) => Promise.resolve(user),
    delete: (id) => Promise.resolve(),
    findAll: () => Promise.resolve([{ id: 1, name: 'John' }])
  }
};

const userRepository = new UserRepository(database);
const userService = new UserService(userRepository);
```

### **Dependency Injection Pattern**

**What is it?**
Technique for achieving Inversion of Control between classes and their dependencies.

**When to use?**
- To improve code testability
- To reduce coupling between components
- To make code more modular

**Example:**
```javascript
class DatabaseService {
  constructor(config) {
    this.config = config;
  }
  
  connect() {
    console.log(`Connected to database: ${this.config.url}`);
  }
}

class UserService {
  constructor(databaseService) {
    this.database = databaseService;
  }
  
  getUsers() {
    this.database.connect();
    return ['User1', 'User2'];
  }
}

// Dependency Injection Container
class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }
  
  register(name, factory, singleton = false) {
    this.services.set(name, { factory, singleton });
  }
  
  resolve(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory());
      }
      return this.singletons.get(name);
    }
    
    return service.factory();
  }
}

// Usage
const container = new DIContainer();

container.register('database', () => {
  return new DatabaseService({ url: 'localhost:5432' });
}, true);

container.register('userService', () => {
  const database = container.resolve('database');
  return new UserService(database);
});

const userService = container.resolve('userService');
console.log(userService.getUsers());
```

---

## **Microservices Patterns**

### **API Gateway Pattern**

**What is it?**
Provides a single entry point for all client requests, routing them to appropriate microservices.

**Benefits:**
- Simplifies client complexity
- Provides cross-cutting concerns (auth, logging)
- Enables protocol translation

**Example:**
```javascript
class APIGateway {
  constructor() {
    this.services = new Map();
    this.middleware = [];
  }
  
  registerService(path, service) {
    this.services.set(path, service);
  }
  
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }
  
  async handleRequest(req, res) {
    // Apply middleware
    for (const middleware of this.middleware) {
      const result = await middleware(req, res);
      if (result === 'stop') return;
    }
    
    // Route to appropriate service
    const path = req.path.split('/')[1];
    const service = this.services.get(path);
    
    if (service) {
      return await service.handleRequest(req, res);
    }
    
    res.status(404).send('Service not found');
  }
}

// Usage
const gateway = new APIGateway();

// Authentication middleware
gateway.addMiddleware(async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send('Unauthorized');
    return 'stop';
  }
});

// Register services
gateway.registerService('users', {
  handleRequest: async (req, res) => {
    res.json({ users: ['Alice', 'Bob'] });
  }
});

gateway.registerService('products', {
  handleRequest: async (req, res) => {
    res.json({ products: ['Laptop', 'Phone'] });
  }
});
```

### **Circuit Breaker Pattern**

**What is it?**
Detects failures and encapsulates logic to prevent repeated failures.

**States:**
- **Closed**: Normal operation, requests pass through
- **Open**: Failures detected, requests fail immediately
- **Half-Open**: Testing if service has recovered

**Example:**
```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttempt = Date.now();
  }
  
  async call(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}

// Usage
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000
});

class ExternalService {
  async fetchData() {
    return await circuitBreaker.call(async () => {
      // Simulate external API call
      if (Math.random() > 0.7) {
        throw new Error('Service unavailable');
      }
      return { data: 'Success!' };
    });
  }
}
```

---

## **Performance Patterns**

### **Caching Pattern**

**What is it?**
Stores frequently accessed data in fast storage to reduce response times.

**Types:**
- **In-memory cache**: Fast but limited space
- **Distributed cache**: Shared across multiple servers
- **CDN cache**: Geographic distribution

**Example:**
```javascript
class CacheManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 300000; // 5 minutes
  }
  
  set(key, value) {
    // Remove oldest item if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    const item = {
      value,
      timestamp: Date.now()
    };
    
    this.cache.set(key, item);
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  delete(key) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage with decorator pattern
function cached(cacheManager, keyGenerator) {
  return function(target, propertyName, descriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function(...args) {
      const cacheKey = keyGenerator(...args);
      
      // Check cache first
      if (cacheManager.has(cacheKey)) {
        return cacheManager.get(cacheKey);
      }
      
      // Execute method and cache result
      const result = await method.apply(this, args);
      cacheManager.set(cacheKey, result);
      
      return result;
    };
    
    return descriptor;
  };
}

class UserService {
  constructor() {
    this.cache = new CacheManager({ maxSize: 50, ttl: 600000 });
  }
  
  @cached(this.cache, (userId) => `user_${userId}`)
  async getUser(userId) {
    // Simulate database call
    console.log(`Fetching user ${userId} from database`);
    return { id: userId, name: `User ${userId}` };
  }
}
```

### **Connection Pool Pattern**

**What is it?**
Maintains a pool of database connections that can be reused.

**Benefits:**
- Reduces connection overhead
- Limits resource usage
- Improves performance

**Example:**
```javascript
class ConnectionPool {
  constructor(options = {}) {
    this.maxConnections = options.maxConnections || 10;
    this.minConnections = options.minConnections || 2;
    this.createConnection = options.createConnection;
    
    this.availableConnections = [];
    this.busyConnections = new Set();
    this.waitingQueue = [];
    
    this.initializePool();
  }
  
  async initializePool() {
    for (let i = 0; i < this.minConnections; i++) {
      const connection = await this.createConnection();
      this.availableConnections.push(connection);
    }
  }
  
  async getConnection() {
    // Return available connection
    if (this.availableConnections.length > 0) {
      const connection = this.availableConnections.pop();
      this.busyConnections.add(connection);
      return connection;
    }
    
    // Create new connection if under limit
    if (this.getTotalConnections() < this.maxConnections) {
      const connection = await this.createConnection();
      this.busyConnections.add(connection);
      return connection;
    }
    
    // Wait for available connection
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }
  
  releaseConnection(connection) {
    this.busyConnections.delete(connection);
    
    if (this.waitingQueue.length > 0) {
      const resolve = this.waitingQueue.shift();
      this.busyConnections.add(connection);
      resolve(connection);
    } else {
      this.availableConnections.push(connection);
    }
  }
  
  getTotalConnections() {
    return this.availableConnections.length + this.busyConnections.size;
  }
  
  async closeAll() {
    const allConnections = [
      ...this.availableConnections,
      ...this.busyConnections
    ];
    
    await Promise.all(allConnections.map(conn => conn.close()));
    
    this.availableConnections = [];
    this.busyConnections.clear();
    this.waitingQueue = [];
  }
}

// Usage
const pool = new ConnectionPool({
  maxConnections: 10,
  minConnections: 2,
  createConnection: async () => {
    // Simulate database connection
    return {
      query: async (sql) => {
        console.log(`Executing: ${sql}`);
        return { rows: [] };
      },
      close: async () => {
        console.log('Connection closed');
      }
    };
  }
});

async function executeQuery(sql) {
  const connection = await pool.getConnection();
  try {
    const result = await connection.query(sql);
    return result;
  } finally {
    pool.releaseConnection(connection);
  }
}
```

---

## **Security Patterns**

### **Rate Limiting Pattern**

**What is it?**
Controls the rate of incoming requests to prevent abuse.

**Algorithms:**
- **Token Bucket**: Allows bursts but limits average rate
- **Sliding Window**: Counts requests in time window
- **Fixed Window**: Resets counter at fixed intervals

**Example:**
```javascript
class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.maxRequests = options.maxRequests || 100;
    this.clients = new Map();
  }
  
  middleware() {
    return (req, res, next) => {
      const clientId = req.ip || req.headers['x-forwarded-for'];
      
      if (this.isAllowed(clientId)) {
        next();
      } else {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: this.windowMs / 1000
        });
      }
    };
  }
  
  isAllowed(clientId) {
    const now = Date.now();
    const client = this.clients.get(clientId);
    
    if (!client) {
      this.clients.set(clientId, {
        requests: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }
    
    // Reset window if expired
    if (now > client.resetTime) {
      client.requests = 1;
      client.resetTime = now + this.windowMs;
      return true;
    }
    
    // Check if under limit
    if (client.requests < this.maxRequests) {
      client.requests++;
      return true;
    }
    
    return false;
  }
  
  // Cleanup expired clients
  cleanup() {
    const now = Date.now();
    for (const [clientId, client] of this.clients.entries()) {
      if (now > client.resetTime) {
        this.clients.delete(clientId);
      }
    }
  }
}

// Usage
const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100  // 100 requests per minute
});

// Express middleware
app.use(rateLimiter.middleware());

// Cleanup expired clients every 5 minutes
setInterval(() => rateLimiter.cleanup(), 300000);
```

---

## **When to Use Which Pattern**

### **Decision Guide**

| Situation | Recommended Pattern | Why |
|-----------|-------------------|-----|
| Need single instance | Singleton | Ensures one global access point |
| Complex object creation | Builder | Separates construction from representation |
| Need to switch algorithms | Strategy | Makes algorithms interchangeable |
| Event-driven system | Observer | Loose coupling between publisher and subscribers |
| Database access | Repository | Separates data access from business logic |
| API requests | API Gateway | Single entry point for clients |
| External service calls | Circuit Breaker | Prevents cascade failures |
| Frequent data access | Caching | Improves performance |
| Database connections | Connection Pool | Reduces overhead |
| Prevent abuse | Rate Limiting | Controls request rate |

### **Pattern Combinations**

**Common combinations:**
- **Repository + Unit of Work**: For complex data operations
- **Observer + Command**: For event-driven systems
- **Strategy + Factory**: For configurable algorithms
- **Adapter + Decorator**: For extending functionality
- **Singleton + Factory**: For managing global resources

---

## **Anti-Patterns to Avoid**

### **Common Anti-Patterns**

1. **God Object**: Single class doing too much
2. **Spaghetti Code**: Tangled, unstructured code
3. **Copy-Paste Programming**: Duplicated code
4. **Magic Numbers**: Hardcoded values
5. **Feature Envy**: Class using another class more than its own

### **How to Avoid Anti-Patterns**

- **Single Responsibility**: Each class should have one reason to change
- **DRY Principle**: Don't Repeat Yourself
- **SOLID Principles**: Follow object-oriented design principles
- **Code Reviews**: Regular peer reviews catch issues early
- **Refactoring**: Continuously improve code structure

---

## **Testing Design Patterns**

### **Pattern Testing Strategies**

```javascript
// Testing Singleton Pattern
describe('DatabaseConnection Singleton', () => {
  beforeEach(() => {
    // Reset singleton between tests
    DatabaseConnection.instance = null;
  });
  
  test('should return same instance', () => {
    const db1 = DatabaseConnection.getInstance();
    const db2 = DatabaseConnection.getInstance();
    expect(db1).toBe(db2);
  });
});

// Testing Observer Pattern
describe('WeatherStation Observer', () => {
  test('should notify observers on temperature change', () => {
    const station = new WeatherStation();
    const observer = { update: jest.fn() };
    
    station.subscribe(observer);
    station.setTemperature(25);
    
    expect(observer.update).toHaveBeenCalledWith(25);
  });
});

// Testing Strategy Pattern
describe('PaymentStrategy', () => {
  test('should use different payment strategies', () => {
    const cart = new ShoppingCart(new CreditCardPayment());
    expect(() => cart.checkout(100)).not.toThrow();
    
    cart.setPaymentStrategy(new PayPalPayment());
    expect(() => cart.checkout(50)).not.toThrow();
  });
});
```

---

## **Best Practices**

### **General Guidelines**

1. **Keep it Simple**: Don't over-engineer
2. **Use Patterns When Needed**: Not every problem needs a pattern
3. **Understand the Problem**: Choose the right pattern for the right problem
4. **Consider Performance**: Patterns have overhead
5. **Document Your Choices**: Explain why you chose a pattern

### **Implementation Tips**

- **Start Simple**: Implement basic version first
- **Iterate**: Refactor to patterns when needed
- **Test Thoroughly**: Ensure pattern works correctly
- **Monitor Performance**: Watch for bottlenecks
- **Stay Consistent**: Use patterns consistently across codebase

---

*Design patterns are tools, not rules. Use them wisely to solve specific problems and improve code quality. Remember that the best pattern is the one that solves your actual problem effectively.*
