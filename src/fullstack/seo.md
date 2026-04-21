# SEO & Performance Optimization

## What is SEO & Performance?

SEO (Search Engine Optimization) is the process of optimizing your website to rank higher in search engine results. Performance optimization focuses on making your website load faster and run more efficiently. Both are crucial for user experience and search engine rankings.

## Example

### Next.js SEO Implementation

```javascript
// components/SEOHead.js
import Head from 'next/head';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  canonical,
  noindex = false 
}) => {
  const siteTitle = 'Jahanzaib Dev Handbook';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = description || 'Ultra-premium, FAANG-level developer handbook and portfolio showcasing world-class technical expertise';
  const siteImage = image || 'https://jahanzaibjameel.github.io/jahanzaib-dev-handbook/og-image.jpg';
  const siteUrl = url || 'https://jahanzaibjameel.github.io/jahanzaib-dev-handbook';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={keywords || 'developer, portfolio, react, nextjs, fullstack, ai, react native'} />
      <meta name="author" content="Muhammad Jahanzaib" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots Meta */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@jahanzaibjameel" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#007AFF" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === 'article' ? 'Article' : 'WebSite',
            "name": fullTitle,
            "description": siteDescription,
            "url": siteUrl,
            "image": siteImage,
            "author": {
              "@type": "Person",
              "name": "Muhammad Jahanzaib",
              "url": "https://jahanzaibjameel.github.io"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Jahanzaib Dev Handbook",
              "logo": {
                "@type": "ImageObject",
                "url": "https://jahanzaibjameel.github.io/jahanzaib-dev-handbook/logo.png"
              }
            }
          })
        }}
      />
    </Head>
  );
};

export default SEOHead;
```

### Performance Optimization with Next.js

```javascript
// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';
import SEOHead from '../components/SEOHead';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Google Analytics tracking
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Report Web Vitals
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }, []);

  const getSEOProps = () => {
    const { seo } = pageProps;
    return {
      title: seo?.title,
      description: seo?.description,
      keywords: seo?.keywords,
      image: seo?.image,
      url: seo?.url,
      type: seo?.type,
      canonical: seo?.canonical,
      noindex: seo?.noindex
    };
  };

  return (
    <>
      <SEOHead {...getSEOProps()} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

### Image Optimization

```javascript
// components/OptimizedImage.js
import Image from 'next/image';
import { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false, 
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {error ? (
        <div className="absolute inset-0 bg-gray-300 rounded flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image not available</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      )}
    </div>
  );
};

export default OptimizedImage;
```

## Real Use Case

### E-Commerce Product Page SEO

**Amazon** and **Shopify** optimize product pages for search engines:

```javascript
// pages/products/[slug].js
import { GetStaticProps, GetStaticPaths } from 'next';
import { getProductBySlug, getAllProductSlugs } from '../../lib/products';
import SEOHead from '../../components/SEOHead';
import OptimizedImage from '../../components/OptimizedImage';
import StructuredData from '../../components/StructuredData';

export default function ProductPage({ product }) {
  const seoProps = {
    title: product.name,
    description: product.metaDescription || product.description,
    keywords: `${product.name}, ${product.category}, ${product.tags.join(', ')}`,
    image: product.images[0]?.url,
    url: `https://example.com/products/${product.slug}`,
    type: 'product',
    canonical: `https://example.com/products/${product.slug}`
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images.map(img => img.url),
    "brand": {
      "@type": "Brand",
      "name": "Your Brand"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://example.com/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": product.saleEndDate,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? 
        "https://schema.org/InStock" : 
        "https://schema.org/OutOfStock"
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    } : undefined,
    "review": product.reviews?.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating
      },
      "reviewBody": review.content
    }))
  };

  return (
    <>
      <SEOHead {...seoProps} />
      <StructuredData data={structuredData} />
      
      <div className="product-page">
        <div className="product-images">
          {product.images.map((image, index) => (
            <OptimizedImage
              key={image.url}
              src={image.url}
              alt={`${product.name} - Image ${index + 1}`}
              width={600}
              height={600}
              priority={index === 0}
              className="product-image"
            />
          ))}
        </div>
        
        <div className="product-content">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="product-meta">
            <span className="category">{product.category}</span>
            <span className="price">${product.price}</span>
            <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="product-description">
            <h2>Description</h2>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
          
          {product.specifications && (
            <div className="product-specs">
              <h2>Specifications</h2>
              <table>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllProductSlugs();
  
  return {
    paths: slugs.map(slug => ({
      params: { slug }
    })),
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return { notFound: true };
  }
  
  return {
    props: {
      product,
      seo: {
        title: product.name,
        description: product.metaDescription,
        keywords: `${product.name}, ${product.category}, ${product.tags.join(', ')}`,
        image: product.images[0]?.url,
        url: `https://example.com/products/${product.slug}`,
        type: 'product'
      }
    },
    revalidate: 3600 // Revalidate every hour
  };
};
```

## Pro Tip

**Implement Core Web Vitals Optimization**

```javascript
// utils/performance.js
class PerformanceOptimizer {
  // Lazy load images
  static lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Optimize font loading
  static optimizeFontLoading() {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter-var.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // Load fonts with font-display: swap
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('/fonts/inter-var.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }

  // Minimize layout shifts
  static preventLayoutShifts() {
    // Add aspect-ratio to images
    document.querySelectorAll('img').forEach(img => {
      if (!img.style.aspectRatio && img.width && img.height) {
        img.style.aspectRatio = `${img.width} / ${img.height}`;
      }
    });

    // Reserve space for dynamic content
    const dynamicContainers = document.querySelectorAll('.dynamic-content');
    dynamicContainers.forEach(container => {
      container.style.minHeight = '200px';
    });
  }

  // Optimize critical CSS
  static optimizeCriticalCSS() {
    // Inline critical CSS
    const criticalCSS = `
      body { font-family: 'Inter', system-ui, sans-serif; }
      .loading { opacity: 0; transition: opacity 0.3s; }
      .loaded { opacity: 1; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  // Monitor performance
  static monitorPerformance() {
    if ('PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      const vitalsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          } else if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
          } else if (entry.entryType === 'layout-shift') {
            console.log('CLS:', entry.value);
          }
        });
      });

      vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }
}

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    PerformanceOptimizer.optimizeFontLoading();
    PerformanceOptimizer.optimizeCriticalCSS();
    PerformanceOptimizer.lazyLoadImages();
    PerformanceOptimizer.preventLayoutShifts();
    PerformanceOptimizer.monitorPerformance();
  });
}
```

## Exercise

**Build a Complete SEO & Performance System**

Create a comprehensive SEO and performance optimization system:

```javascript
// Exercise: SEO & Performance Implementation
// Requirements:
// 1. Dynamic SEO meta tags
// 2. Structured data implementation
// 3. Core Web Vitals optimization
// 4. Image optimization
// 5. Performance monitoring
// 6. Sitemap generation
// 7. Robots.txt configuration

// Solution Implementation:

// 1. Dynamic SEO Manager
class SEOManager {
  static generateMetaTags(pageData) {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      noindex = false
    } = pageData;

    return {
      title: this.generateTitle(title),
      description: this.generateDescription(description),
      keywords: this.generateKeywords(keywords),
      openGraph: this.generateOpenGraph(pageData),
      twitter: this.generateTwitterCard(pageData),
      canonical: this.generateCanonical(url),
      robots: this.generateRobots(noindex),
      structuredData: this.generateStructuredData(pageData)
    };
  }

  static generateTitle(title) {
    const siteName = 'Jahanzaib Dev Handbook';
    return title ? `${title} | ${siteName}` : siteName;
  }

  static generateDescription(description) {
    const maxLength = 160;
    if (!description) {
      return 'Ultra-premium, FAANG-level developer handbook and portfolio showcasing world-class technical expertise';
    }
    return description.length > maxLength ? 
      description.substring(0, maxLength - 3) + '...' : 
      description;
  }

  static generateKeywords(keywords) {
    const defaultKeywords = 'developer, portfolio, react, nextjs, fullstack, ai, react native';
    return keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  }

  static generateStructuredData(pageData) {
    const { type, title, description, url, image, author } = pageData;
    
    const baseData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'Article' : 'WebPage',
      "name": title,
      "description": description,
      "url": url,
      "image": image
    };

    if (author) {
      baseData.author = {
        "@type": "Person",
        "name": author
      };
    }

    return baseData;
  }
}

// 2. Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  startMonitoring() {
    this.observeCoreWebVitals();
    this.observeResourceTiming();
    this.observeNavigationTiming();
  }

  observeCoreWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        this.reportMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  reportMetric(name, value) {
    console.log(`${name}: ${value}`);
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', name, {
        value: Math.round(value),
        event_category: 'Web Vitals'
      });
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// 3. Sitemap Generator
class SitemapGenerator {
  static generateSitemap(pages) {
    const baseUrl = 'https://jahanzaibjameel.github.io/jahanzaib-dev-handbook';
    const currentDate = new Date().toISOString();
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    return sitemap;
  }

  static generateRobotsTxt() {
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://jahanzaibjameel.github.io/jahanzaib-dev-handbook/sitemap.xml`;
  }
}
```

**Your Tasks:**
1. Implement the complete SEO system
2. Add performance monitoring
3. Create sitemap generation
4. Implement Core Web Vitals optimization
5. Add structured data for different content types
6. Create image optimization system
7. Add analytics integration

This exercise teaches you:
- SEO best practices and implementation
- Performance optimization techniques
- Core Web Vitals monitoring
- Structured data and schema markup
- Image optimization strategies
- Sitemap and robots.txt generation
- Analytics and monitoring integration

---

**Next Up**: Learn about DevOps and production deployment! DevOps & Production Excellence
