# Frontend Development with Next.js

Next.js is a React framework that enables production-ready web applications with server-side rendering, static site generation, and optimized performance.

## 🎯 What is Next.js?

Next.js is a React framework that provides:
- **Server-Side Rendering (SSR)**: Improved SEO and performance
- **Static Site Generation (SSG)**: Blazing-fast static sites
- **API Routes**: Backend functionality in your frontend app
- **File-based Routing**: Simple and intuitive routing
- **Automatic Code Splitting**: Optimized bundle sizes
- **Built-in CSS Support**: Styled-jsx, CSS Modules, and more

## 🚀 Why Next.js?

### Performance Benefits
- **Faster Initial Load**: Server-rendered HTML
- **Better SEO**: Search engines can crawl content easily
- **Automatic Optimization**: Image optimization, code splitting
- **Incremental Static Regeneration**: Update static content without rebuild

### Developer Experience
- **Zero Configuration**: Start coding immediately
- **Hot Reloading**: Instant feedback during development
- **TypeScript Support**: Built-in TypeScript integration
- **Fast Refresh**: Component state preserved during reloads

## 🛠️ Getting Started

### Installation

```bash
# Create new Next.js app
npx create-next-app@latest my-app
cd my-app

# Start development server
npm run dev
```

### Project Structure

```text
my-app/
├── pages/              # Page components
│   ├── _app.js         # App component (global styles, layout)
│   ├── _document.js    # Document HTML structure
│   ├── index.js        # Home page
│   └── api/            # API routes
├── components/         # Reusable components
├── styles/            # CSS files
├── public/            # Static assets
├── utils/             # Utility functions
└── lib/               # Library configurations
```

## 📁 Core Concepts

### File-based Routing

Every file in the `pages/` directory becomes a route:

```javascript
// pages/index.js -> /
// pages/about.js -> /about
// pages/blog/[slug].js -> /blog/:slug
// pages/posts/[id]/edit.js -> /posts/:id/edit
```

### Dynamic Routes

```javascript
// pages/posts/[id].js
import { useRouter } from 'next/router';

function Post({ post }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export async function getStaticPaths() {
  // Return all possible post IDs
  const posts = await getPosts();
  const paths = posts.map(post => ({
    params: { id: post.id.toString() }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  // Fetch data for specific post
  const post = await getPost(params.id);
  
  return {
    props: { post }
  };
}

export default Post;
```

### API Routes

Create backend endpoints in your frontend app:

```javascript
// pages/api/users.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request
    const users = await getUsers();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    // Handle POST request
    const user = await createUser(req.body);
    res.status(201).json(user);
  } else {
    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## 🎨 Styling in Next.js

### CSS Modules

```css
/* styles/Button.module.css */
.button {
  background: #0070f3;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.button:hover {
  background: #0051cc;
}
```

```javascript
// components/Button.js
import styles from '../styles/Button.module.css';

function Button({ children, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
```

### Styled-jsx

```javascript
// components/Card.js
function Card({ title, content }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{content}</p>
      
      <style jsx>{`
        .card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        h2 {
          color: #333;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}

export default Card;
```

## 🔄 Data Fetching

### getStaticProps (SSG)

```javascript
// pages/blog.js
export async function getStaticProps() {
  // Fetch data at build time
  const posts = await getBlogPosts();
  
  return {
    props: {
      posts
    },
    revalidate: 60 // Re-generate every 60 seconds
  };
}

function Blog({ posts }) {
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export default Blog;
```

### getServerSideProps (SSR)

```javascript
// pages/dashboard.js
export async function getServerSideProps(context) {
  // Fetch data on each request
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }
  
  const userData = await getUserData(session.user.id);
  
  return {
    props: {
      user: userData
    }
  };
}
```

## 🎯 Advanced Features

### Image Optimization

```javascript
import Image from 'next/image';

function ProductCard({ product }) {
  return (
    <div>
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        priority={product.featured}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
```

### Authentication with NextAuth

```bash
npm install next-auth
```

```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
```

## 🧪 Testing Next.js Applications

### Unit Testing with Jest

```javascript
// __tests__/components/Button.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🚀 Performance Optimization

### Code Splitting

```javascript
import dynamic from 'next/dynamic';

// Dynamically import heavy components
const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable server-side rendering if needed
});

function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <HeavyComponent />
    </div>
  );
}
```

## 🔧 Best Practices

### Component Structure

```javascript
// components/ProductCard.js
import Image from 'next/image';
import styles from './ProductCard.module.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={150}
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price}</span>
          <button 
            className={styles.button}
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
```

### Error Handling

```javascript
// pages/_error.js
function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </h1>
        <p className="mt-4 text-gray-600">
          Please try again later or contact support.
        </p>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
```

---

**Next Up**: Learn about backend development with Node.js! 🚀
