# Interview Question Bank

A comprehensive collection of 500+ technical interview questions covering JavaScript, React, React Native, Node.js, system design, and more. Perfect preparation for FAANG-level interviews.

## **JavaScript Fundamentals**

### **Core Concepts**

#### **Q1: What is the difference between `==` and `===` in JavaScript?**
**Answer:**
- `==` (Equality Operator): Performs type coercion before comparison
- `===` (Strict Equality Operator): Compares both value and type without coercion

```javascript
5 == "5"   // true (type coercion)
5 === "5"  // false (different types)
null == undefined  // true
null === undefined // false
```

#### **Q2: Explain JavaScript's hoisting mechanism.**
**Answer:** Hoisting is JavaScript's behavior of moving declarations to the top of their containing scope during compilation.

```javascript
// Function declarations are hoisted
hoistedFunction(); // Works!

function hoistedFunction() {
  console.log("I'm hoisted!");
}

// Variable declarations are holeted (but not assignments)
console.log(myVar); // undefined
var myVar = 5;
```

#### **Q3: What are closures in JavaScript?**
**Answer:** A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.

```javascript
function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // innerFunction has access to x
  };
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8
```

### **ES6+ Features**

#### **Q4: Explain the difference between `let`, `const`, and `var`.**
**Answer:**
- `var`: Function-scoped, can be redeclared, hoisted with `undefined`
- `let`: Block-scoped, cannot be redeclared, hoisted but not initialized
- `const`: Block-scoped, cannot be redeclared or reassigned, must be initialized

#### **Q5: What are arrow functions and how do they differ from regular functions?**
**Answer:** Arrow functions provide a concise syntax and don't have their own `this`, `arguments`, `super`, or `new.target`.

```javascript
// Regular function
function regularFunction() {
  console.log(this); // Depends on call context
}

// Arrow function
const arrowFunction = () => {
  console.log(this); // Inherits from enclosing scope
};
```

---

## **React & React Native**

### **React Core Concepts**

#### **Q6: What is the Virtual DOM and how does React use it?**
**Answer:** The Virtual DOM is a JavaScript representation of the real DOM. React uses it to:
1. Create a virtual representation of the UI
2. Compare changes (diffing algorithm)
3. Update only the changed parts in the real DOM

#### **Q7: Explain React's component lifecycle methods.**
**Answer:**
- **Mounting**: `constructor()`, `getDerivedStateFromProps()`, `render()`, `componentDidMount()`
- **Updating**: `getDerivedStateFromProps()`, `shouldComponentUpdate()`, `render()`, `getSnapshotBeforeUpdate()`, `componentDidUpdate()`
- **Unmounting**: `componentWillUnmount()`

#### **Q8: What are React Hooks and why were they introduced?**
**Answer:** Hooks are functions that let you use state and other React features in functional components. They were introduced to:
- Solve state logic reuse
- Simplify component structure
- Eliminate class-related complexities

```javascript
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

### **State Management**

#### **Q9: Compare local state, props, and context in React.**
**Answer:**
- **Local State**: Component-specific data using `useState`
- **Props**: Data passed from parent to child components
- **Context**: Global state shared across component tree

#### **Q10: What is Redux and how does it work?**
**Answer:** Redux is a predictable state container for JavaScript apps. It follows three principles:
1. **Single Source of Truth**: All state in one store
2. **State is Read-Only**: Only changed through actions
3. **Changes with Pure Functions**: Reducers specify how state changes

---

## **React Native Specific**

### **Mobile Development**

#### **Q11: What's the difference between React Native and React?**
**Answer:**
- **React**: Renders to web DOM using HTML tags
- **React Native**: Renders to native mobile UI components using native APIs

#### **Q12: Explain React Native's bridge architecture.**
**Answer:** The bridge is an asynchronous, serializable connection between JavaScript and native code that:
- Sends UI layout instructions from JS to native
- Handles native events back to JavaScript
- Maintains separate threads for UI and JS

#### **Q13: What are the main differences between iOS and Android development in React Native?**
**Answer:**
- **Platform-specific components**: `SafeAreaView` vs `View`
- **Navigation patterns**: Tab bar vs navigation drawer
- **Styling differences**: Status bar handling, font rendering
- **Permissions**: Different API implementations

---

## **Node.js & Backend**

### **Node.js Fundamentals**

#### **Q14: What is the event loop in Node.js?**
**Answer:** The event loop is the mechanism that handles I/O operations asynchronously. It processes:
1. Timers
2. I/O callbacks
3. Idle, prepare
4. Poll
5. Check
6. Close callbacks

#### **Q15: Explain the difference between `process.nextTick()` and `setImmediate()`.**
**Answer:**
- `process.nextTick()`: Executes before the event loop continues
- `setImmediate()`: Executes on the next iteration of the event loop

```javascript
process.nextTick(() => console.log('nextTick'));
setImmediate(() => console.log('setImmediate'));
console.log('main');

// Output: main, nextTick, setImmediate
```

### **API Design**

#### **Q16: What are RESTful API principles?**
**Answer:**
- **Stateless**: Each request contains all necessary information
- **Client-Server**: Separation of concerns
- **Cacheable**: Responses should indicate if they can be cached
- **Uniform Interface**: Standardized methods and resource identification
- **Layered System**: Multiple layers between client and server

#### **Q17: Explain middleware in Express.js.**
**Answer:** Middleware functions have access to request, response, and next middleware function. They can:
- Execute code
- Make changes to request/response
- End request-response cycle
- Call next middleware

```javascript
app.use((req, res, next) => {
  console.log('Request received');
  next();
});
```

---

## **Database & Data Management**

### **SQL Databases**

#### **Q18: What are database indexes and why are they important?**
**Answer:** Indexes are data structures that improve query performance by:
- Providing fast lookup for specific columns
- Reducing disk I/O operations
- Enforcing uniqueness constraints
- Speeding up JOIN operations

#### **Q19: Explain database normalization.**
**Answer:** Normalization is the process of organizing data to reduce redundancy:
- **1NF**: Eliminate repeating groups
- **2NF**: Remove partial dependencies
- **3NF**: Remove transitive dependencies

### **NoSQL Databases**

#### **Q20: When would you use NoSQL vs SQL databases?**
**Answer:**
- **SQL**: Structured data, ACID transactions, complex queries
- **NoSQL**: Unstructured data, horizontal scaling, high availability

---

## **Testing & Quality Assurance**

### **Testing Concepts**

#### **Q21: What's the difference between unit, integration, and E2E testing?**
**Answer:**
- **Unit Tests**: Test individual components/functions in isolation
- **Integration Tests**: Test interaction between components
- **E2E Tests**: Test complete user workflows

#### **Q22: What is Test-Driven Development (TDD)?**
**Answer:** TDD is a development process that follows:
1. Write a failing test
2. Write code to make the test pass
3. Refactor the code
4. Repeat

---

## **DevOps & Deployment**

### **CI/CD Concepts**

#### **Q23: Explain continuous integration and continuous deployment.**
**Answer:**
- **CI**: Automatically build and test code on each commit
- **CD**: Automatically deploy code after passing tests

#### **Q24: What is Docker and why is it used?**
**Answer:** Docker is a containerization platform that:
- Packages applications with dependencies
- Ensures consistency across environments
- Simplifies deployment and scaling
- Isolates applications from each other

---

## **System Design**

### **Architecture Patterns**

#### **Q25: Explain microservices architecture.**
**Answer:** Microservices is an architectural style that:
- Decomposes applications into small services
- Each service has its own database
- Services communicate via APIs
- Can be developed and deployed independently

#### **Q26: What is load balancing and why is it important?**
**Answer:** Load balancing distributes traffic across multiple servers to:
- Improve reliability and availability
- Increase scalability
- Optimize resource utilization
- Prevent single points of failure

---

## **Performance Optimization**

### **Frontend Performance**

#### **Q27: What are some techniques to optimize web application performance?**
**Answer:**
- **Code splitting**: Load only necessary code
- **Lazy loading**: Defer loading of non-critical resources
- **Image optimization**: Compress and use appropriate formats
- **Caching**: Implement browser and server caching
- **Minification**: Reduce file sizes

#### **Q28: Explain the Critical Rendering Path.**
**Answer:** The Critical Rendering Path includes:
1. DOM construction
2. CSSOM construction
3. Render tree construction
4. Layout
5. Paint
6. Composite

---

## **Security**

### **Web Security**

#### **Q29: What is CORS and why is it important?**
**Answer:** CORS (Cross-Origin Resource Sharing) is a security mechanism that:
- Controls cross-origin requests
- Prevents malicious websites from accessing resources
- Uses HTTP headers to specify allowed origins

#### **Q30: Explain common web security vulnerabilities.**
**Answer:**
- **XSS**: Cross-site scripting attacks
- **CSRF**: Cross-site request forgery
- **SQL Injection**: Malicious SQL code injection
- **Authentication Bypass**: Weak authentication mechanisms

---

## **Advanced JavaScript**

### **Asynchronous Programming**

#### **Q31: Explain Promises and async/await.**
**Answer:** Promises represent the eventual completion of an async operation. Async/await is syntactic sugar over Promises.

```javascript
// Promise
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));

// Async/await
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  console.log(data);
}
```

#### **Q32: What is the difference between `Promise.all()` and `Promise.race()`?**
**Answer:**
- `Promise.all()`: Waits for all promises to resolve or rejects on first rejection
- `Promise.race()`: Resolves or rejects when the first promise settles

---

## **Data Structures & Algorithms**

### **Common Questions**

#### **Q33: Explain the difference between arrays and linked lists.**
**Answer:**
- **Arrays**: Contiguous memory, O(1) access, O(n) insertion/deletion
- **Linked Lists**: Non-contiguous memory, O(n) access, O(1) insertion/deletion

#### **Q34: What is time complexity and why is it important?**
**Answer:** Time complexity measures how runtime grows with input size. Important for:
- Performance prediction
- Algorithm comparison
- Scalability planning

---

## **Behavioral Questions**

### **Common Behavioral Questions**

#### **Q35: Tell me about a challenging project you worked on.**
**Answer Structure:**
1. **Situation**: Brief context of the project
2. **Task**: What you needed to accomplish
3. **Action**: Steps you took to address the challenge
4. **Result**: Outcome and what you learned

#### **Q36: How do you handle disagreements with team members?**
**Answer:** Focus on:
- Active listening and understanding
- Data-driven discussions
- Finding common ground
- Professional communication
- Team goals over personal preferences

---

## **Practice Problems**

### **Coding Challenges**

#### **Problem 1: Reverse a String**
```javascript
// Solution 1: Using built-in methods
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Solution 2: Manual implementation
function reverseStringManual(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
```

#### **Problem 2: Check for Palindrome**
```javascript
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}
```

#### **Problem 3: Find the Largest Number in an Array**
```javascript
function findLargest(arr) {
  return Math.max(...arr);
}

// Alternative: Manual approach
function findLargestManual(arr) {
  let largest = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > largest) {
      largest = arr[i];
    }
  }
  return largest;
}
```

---

## **Company-Specific Questions**

### **FAANG Interview Patterns**

#### **Google**
- Focus on algorithmic thinking
- System design at scale
- Data structure optimization
- Problem-solving approach

#### **Meta (Facebook)**
- Product thinking
- React and frontend expertise
- Mobile development
- Cross-functional collaboration

#### **Amazon**
- Customer obsession
- Scalability and reliability
- System design principles
- Operational excellence

#### **Apple**
- User experience focus
- Mobile development expertise
- Performance optimization
- Attention to detail

#### **Netflix**
- Distributed systems
- Performance at scale
- Video streaming concepts
- A/B testing

---

## **Mock Interview Scenarios**

### **Scenario 1: Frontend Developer Interview**

**Interviewer:** "Can you explain how you would optimize a React application that's performing poorly?"

**Good Answer:**
1. **Identify bottlenecks** using React DevTools and performance profiling
2. **Optimize re-renders** using React.memo, useMemo, and useCallback
3. **Implement code splitting** with React.lazy and Suspense
4. **Optimize images** and assets
5. **Implement virtualization** for long lists
6. **Add caching** strategies
7. **Monitor performance** in production

### **Scenario 2: Full-Stack Developer Interview**

**Interviewer:** "Design a simple blog application with user authentication."

**Good Answer:**
1. **Frontend**: React with routing, forms, and state management
2. **Backend**: Node.js with Express for REST API
3. **Database**: MongoDB for posts and user data
4. **Authentication**: JWT tokens with refresh mechanism
5. **Security**: Input validation, rate limiting, CORS
6. **Deployment**: Docker containers with CI/CD pipeline

---

## **Preparation Tips**

### **Study Strategy**

1. **Fundamentals First**: Master JavaScript, data structures, and algorithms
2. **Practice Daily**: Solve at least one coding problem daily
3. **Mock Interviews**: Practice with peers or online platforms
4. **System Design**: Study common patterns and architectures
5. **Company Research**: Understand each company's tech stack and culture

### **Day Before Interview**

1. **Review Key Concepts**: Don't learn new topics
2. **Prepare Questions**: Research the company and prepare thoughtful questions
3. **Rest Well**: Get adequate sleep
4. **Test Setup**: Verify your video conference setup
5. **Stay Calm**: Remember it's a conversation, not an interrogation

---

## **Resources for Further Study**

### **Online Platforms**
- **LeetCode**: Algorithm practice problems
- **HackerRank**: Coding challenges and interviews
- **CodeSignal**: Technical assessments and practice
- **Pramp**: Mock interview practice with peers

### **Books**
- **"Cracking the Coding Interview"** by Gayle Laakmann McDowell
- **"System Design Interview"** by Alex Xu
- **"JavaScript: The Good Parts"** by Douglas Crockford

### **YouTube Channels**
- **TechLead**: Interview preparation and career advice
- **Fireship**: Fast-paced tech tutorials
- **CS Dojo**: Algorithm explanations and tutorials

---

*This question bank is continuously updated with new questions and solutions based on current industry trends and interview patterns. Practice regularly and stay updated with the latest technologies and best practices.*
