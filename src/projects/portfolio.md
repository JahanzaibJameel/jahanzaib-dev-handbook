# Portfolio Website

## Project Overview

A stunning, professional portfolio website showcasing modern web development skills, featuring a sleek design, smooth animations, and impressive performance metrics. This project demonstrates expertise in Next.js, TypeScript, Tailwind CSS, and modern web technologies.

## Tech Stack & Architecture

### Frontend Stack
- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better DX
- **Tailwind CSS** for rapid UI development
- **Framer Motion** for smooth animations
- **React Query** for data fetching and caching
- **NextAuth.js** for authentication
- **Prisma** for database management

### Backend & Database
- **PostgreSQL** for relational data
- **Redis** for caching and sessions
- **Node.js** API routes
- **Cloudinary** for image optimization
- **Vercel** for deployment

### Development Tools
- **ESLint** + **Prettier** for code quality
- **Husky** for git hooks
- **Jest** for testing
- **Storybook** for component development
- **Playwright** for E2E testing

## Project Structure

```
portfolio-website/
# Configuration
next.config.js
package.json
tsconfig.json
tailwind.config.js
prisma.schema
.env.example

# Source Code
src/
  app/
    (auth)/
      login/
      register/
    api/
      projects/
        route.ts
      contact/
        route.ts
      analytics/
        route.ts
    globals.css
    layout.tsx
    page.tsx
    
  components/
    ui/
      Button/
      Input/
      Modal/
      Card/
    layout/
      Header/
      Footer/
      Navigation/
    sections/
      Hero/
      About/
      Projects/
      Skills/
      Experience/
      Contact/
      Testimonials/
      
  lib/
    prisma.ts
    auth.ts
    utils.ts
    constants.ts
    animations.ts
    
  hooks/
    useTheme.ts
    useAnalytics.ts
    useScroll.ts
    
  types/
    project.ts
    experience.ts
    skill.ts
    
  styles/
    globals.css
    components.css
    
  assets/
    images/
    icons/
    fonts/

# Database
prisma/
  schema.prisma
  migrations/
  seed.ts

# Tests
__tests__/
  components/
  pages/
  api/

# Documentation
docs/
  SETUP.md
  DEPLOYMENT.md
  CONTRIBUTING.md
```

## Key Features & Implementation

### 1. Hero Section with Animations

```typescript
// src/components/sections/Hero/HeroSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Download, Mail, Github, Linkedin } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  
  const yRange = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useSpring(scrollY, { stiffness: 400, damping: 40 });

  const [text, setText] = useState('');
  const fullText = "Full-Stack Developer & AI Enthusiast";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ y: yRange, opacity }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
              "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
              "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
              "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)",
              "linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          variants={itemVariants}
        >
          Hi, I'm{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Jahanzaib
          </span>
        </motion.h1>

        <motion.div
          className="text-2xl md:text-3xl text-white mb-8 h-10"
          variants={itemVariants}
        >
          <span>{text}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block ml-1"
          >
            |
          </motion.span>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Building exceptional digital experiences with modern web technologies.
          Passionate about creating scalable applications and exploring the frontiers of AI.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold flex items-center gap-2 hover:bg-white hover:text-gray-900 transition-all"
          >
            <Mail className="w-5 h-5" />
            Get In Touch
          </motion.button>
        </motion.div>

        <motion.div
          className="flex justify-center gap-6"
          variants={itemVariants}
        >
          {[
            { icon: Github, href: "https://github.com/jahanzaibjameel", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/jahanzaibjameel", label: "LinkedIn" }
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label={label}
            >
              <Icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-white" />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
```

### 2. Projects Showcase

```typescript
// src/components/sections/Projects/ProjectsSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@/types/project';

const ProjectsSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      return response.json();
    },
  });

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Projects' },
    { id: 'opensource', label: 'Open Source' },
  ];

  const filteredProjects = projects?.filter(project => 
    selectedFilter === 'all' || project.category === selectedFilter
  ) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of my best work, showcasing expertise in various technologies and domains.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{
                        transform: hoveredProject === project.id ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg">{project.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </motion.a>
                      )}
                      
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
```

### 3. Interactive Skills Section

```typescript
// src/components/sections/Skills/SkillsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Database, Globe, Palette, Cpu, Cloud } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const SkillsSection: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const skills: Skill[] = [
    {
      name: 'React/Next.js',
      level: 95,
      category: 'Frontend',
      icon: <Code className="w-6 h-6" />,
      description: 'Expert in modern React development with Next.js'
    },
    {
      name: 'TypeScript',
      level: 90,
      category: 'Frontend',
      icon: <Code className="w-6 h-6" />,
      description: 'Strong typing skills and advanced TypeScript patterns'
    },
    {
      name: 'Node.js',
      level: 85,
      category: 'Backend',
      icon: <Cpu className="w-6 h-6" />,
      description: 'Building scalable server-side applications'
    },
    {
      name: 'PostgreSQL',
      level: 80,
      category: 'Database',
      icon: <Database className="w-6 h-6" />,
      description: 'Database design and optimization'
    },
    {
      name: 'Tailwind CSS',
      level: 90,
      category: 'Frontend',
      icon: <Palette className="w-6 h-6" />,
      description: 'Modern CSS frameworks and responsive design'
    },
    {
      name: 'AWS/Cloud',
      level: 75,
      category: 'DevOps',
      icon: <Cloud className="w-6 h-6" />,
      description: 'Cloud deployment and infrastructure management'
    },
  ];

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive skill set covering modern web development technologies and best practices.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {['All', ...categories].map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300 mr-4">
                  {skill.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {skill.category}
                  </span>
                </div>
              </div>

              {/* Skill Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Proficiency
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Description */}
              <motion.p
                className="text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: hoveredSkill === skill.name ? 1 : 0,
                  height: hoveredSkill === skill.name ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {skill.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
```

## Performance Optimization

### Image Optimization

```typescript
// src/components/ui/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      
      {error && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Failed to load image
          </span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
```

### Analytics Integration

```typescript
// src/lib/analytics.ts
import { get } from 'lodash';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

class AnalyticsService {
  private isProduction = process.env.NODE_ENV === 'production';

  trackEvent({ action, category, label, value }: AnalyticsEvent) {
    if (!this.isProduction) return;

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Custom analytics
    this.sendToCustomAnalytics({ action, category, label, value });
  }

  trackPageView(path: string) {
    if (!this.isProduction) return;

    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
      });
    }

    this.sendPageViewToAnalytics(path);
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  private async sendPageViewToAnalytics(path: string) {
    try {
      await fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });
    } catch (error) {
      console.error('Page view analytics error:', error);
    }
  }
}

export const analytics = new AnalyticsService();
```

## Deployment & DevOps

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/jahanzaibjameel',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;
```

### Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url"
  },
  "functions": {
    "src/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Exercise

**Build Your Own Portfolio Website**

Create a stunning portfolio website that showcases your skills and projects:

```typescript
// Exercise Tasks:
// 1. Set up Next.js 14 project with TypeScript
// 2. Create impressive hero section with animations
// 3. Build projects showcase with filtering
// 4. Implement interactive skills section
// 5. Add contact form with validation
// 6. Optimize for performance and SEO
// 7. Add dark/light theme support
// 8. Implement analytics and tracking
// 9. Create blog section (optional)
// 10. Deploy to production

// Implementation Checklist:

// 1. Project Setup
// - Initialize Next.js 14 project
// - Configure TypeScript and ESLint
// - Set up Tailwind CSS
// - Configure Prisma and database
// - Set up authentication

// 2. Core Sections
// - Hero section with animations
// - About section
// - Projects showcase
// - Skills section
// - Experience timeline
// - Contact form
// - Footer

// 3. Advanced Features
// - Dark/light theme toggle
// - Smooth scrolling
// - Loading states
// - Error boundaries
// - Analytics integration
// - SEO optimization

// 4. Performance
// - Image optimization
// - Code splitting
// - Lazy loading
// - Caching strategies
// - Bundle optimization

// 5. Deployment
// - Environment configuration
// - CI/CD pipeline
// - Domain setup
// - SSL certificates
// - Monitoring setup
```

**Your Tasks:**
1. Set up the complete Next.js project structure
2. Create impressive hero section with animations
3. Build projects showcase with filtering and search
4. Implement interactive skills section with progress bars
5. Add contact form with validation and email integration
6. Optimize for performance and SEO
7. Add dark/light theme support
8. Implement analytics and user tracking
9. Create responsive design for all devices
10. Deploy to production with CI/CD

This exercise teaches you:
- Next.js 14 App Router and server components
- Advanced animations with Framer Motion
- Performance optimization techniques
- SEO best practices
- Responsive design principles
- State management and data fetching
- Form validation and API integration
- Analytics and user tracking
- Deployment and DevOps
- Modern web development patterns

---

**Next Up**: Learn about building the E-Commerce Platform! E-Commerce Development
