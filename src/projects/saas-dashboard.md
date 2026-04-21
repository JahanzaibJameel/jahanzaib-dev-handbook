# SaaS Dashboard

## Project Overview

A comprehensive, enterprise-grade SaaS dashboard application demonstrating advanced data visualization, real-time analytics, user management, and subscription billing. This project showcases expertise in building scalable SaaS platforms with modern web technologies.

## Tech Stack & Architecture

### Frontend Stack
- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better DX
- **Tailwind CSS** for rapid UI development
- **Recharts** for data visualization
- **React Query** for data fetching and caching
- **Zustand** for state management
- **React Hook Form** for form handling
- **Framer Motion** for animations

### Backend & Database
- **Node.js** with Express.js
- **PostgreSQL** for relational data
- **Redis** for caching and sessions
- **Prisma** as ORM
- **Stripe** for payment processing
- **SendGrid** for email services
- **Socket.io** for real-time features

### DevOps & Infrastructure
- **Docker** for containerization
- **AWS** for cloud infrastructure
- **Vercel** for frontend deployment
- **Railway** for backend deployment
- **GitHub Actions** for CI/CD

## Project Structure

```
saas-dashboard/
# Configuration
next.config.js
package.json
tsconfig.json
tailwind.config.js
prisma.schema
docker-compose.yml
.env.example

# Frontend Source
src/
  app/
    (dashboard)/
      layout.tsx
      page.tsx
      analytics/
      customers/
      billing/
      settings/
    api/
      auth/
        route.ts
      analytics/
        route.ts
      customers/
        route.ts
      billing/
        route.ts
      webhooks/
        stripe/
          route.ts
    
  components/
    ui/
      Button/
      Input/
      Modal/
      Card/
      Table/
      Dropdown/
    dashboard/
      Sidebar/
      Header/
      MetricCard/
      ChartContainer/
      DataTable/
      BillingForm/
      
  lib/
    prisma.ts
    auth.ts
    utils.ts
    constants.ts
    stripe.ts
    charts.ts
    
  hooks/
    useAuth.ts
    useAnalytics.ts
    useBilling.ts
    useRealtime.ts
    
  types/
    user.ts
    analytics.ts
    billing.ts
    customer.ts
    
  styles/
    globals.css
    components.css

# Backend Source
backend/
  src/
    controllers/
      authController.js
      analyticsController.js
      customersController.js
      billingController.js
    middleware/
      auth.js
      validation.js
      rateLimit.js
    models/
      User.js
      Subscription.js
      Analytics.js
    services/
      authService.js
      analyticsService.js
      billingService.js
      emailService.js
    routes/
      auth.js
      analytics.js
      customers.js
      billing.js
    utils/
      helpers.js
      validators.js
    config/
      database.js
      redis.js
      stripe.js

# Database
prisma/
  schema.prisma
  migrations/
  seed.ts

# Tests
__tests__/
  components/
  api/
  hooks/
  utils/

# Documentation
docs/
  API.md
  SETUP.md
  DEPLOYMENT.md
```

## Key Features & Implementation

### 1. Analytics Dashboard

```typescript
// src/components/dashboard/analytics/AnalyticsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Download
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricCard } from './MetricCard';
import { DateRangePicker } from '../DateRangePicker';
import { ExportButton } from '../ExportButton';

interface AnalyticsData {
  revenue: number;
  users: number;
  activeUsers: number;
  conversionRate: number;
  chartData: any[];
  topProducts: any[];
  userGrowth: any[];
}

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange }),
      });
      return response.json();
    },
  });

  const metrics = [
    {
      title: 'Total Revenue',
      value: analytics?.revenue || 0,
      change: '+12.5%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Total Users',
      value: analytics?.users || 0,
      change: '+8.2%',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Active Users',
      value: analytics?.activeUsers || 0,
      change: '+15.3%',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversionRate || 0}%`,
      change: '+2.1%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your business performance and key metrics
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <ExportButton
            data={analytics}
            filename={`analytics-${dateRange.start.toISOString().split('T')[0]}`}
          />
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Growth Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Products
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.topProducts || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Traffic Sources
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Direct', value: 400 },
                  { name: 'Social', value: 300 },
                  { name: 'Referral', value: 200 },
                  { name: 'Organic', value: 100 }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Conversion Funnel
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { stage: 'Visit', value: 1000 },
                { stage: 'Signup', value: 600 },
                { stage: 'Trial', value: 300 },
                { stage: 'Paid', value: 150 }
              ]}
              layout="horizontal"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
```

### 2. Customer Management System

```typescript
// src/components/dashboard/customers/CustomerManagement.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone,
  Calendar,
  DollarSign,
  UserCheck,
  UserX
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { CustomerModal } from './CustomerModal';
import { Customer } from '@/types/customer';

const CustomerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ['customers', searchTerm],
    queryFn: async () => {
      const response = await fetch(`/api/customers?search=${searchTerm}`);
      return response.json();
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      await fetch(`/api/customers/${customerId}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    },
  });

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (customer: Customer) => (
        <div className="flex items-center">
          <img
            src={customer.avatar || '/default-avatar.png'}
            alt={customer.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {customer.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {customer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (customer: Customer) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          customer.status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : customer.status === 'trial'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {customer.status}
        </span>
      ),
    },
    {
      key: 'subscription',
      label: 'Subscription',
      render: (customer: Customer) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {customer.subscription?.plan || 'Free'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ${customer.subscription?.price || 0}/mo
          </div>
        </div>
      ),
    },
    {
      key: 'revenue',
      label: 'Total Revenue',
      render: (customer: Customer) => (
        <div className="font-medium text-gray-900 dark:text-white">
          ${customer.totalRevenue?.toFixed(2) || '0.00'}
        </div>
      ),
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (customer: Customer) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(customer.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer: Customer) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedCustomer(customer);
              setIsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={() => deleteCustomerMutation.mutate(customer.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your customers and their subscriptions
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedCustomer(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        variants={itemVariants}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </motion.div>

      {/* Customer Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        {[
          { label: 'Total Customers', value: customers?.length || 0, icon: <UserCheck className="w-5 h-5" />, color: 'blue' },
          { label: 'Active Customers', value: customers?.filter(c => c.status === 'active').length || 0, icon: <UserCheck className="w-5 h-5" />, color: 'green' },
          { label: 'Trial Customers', value: customers?.filter(c => c.status === 'trial').length || 0, icon: <Calendar className="w-5 h-5" />, color: 'yellow' },
          { label: 'Churned Customers', value: customers?.filter(c => c.status === 'churned').length || 0, icon: <UserX className="w-5 h-5" />, color: 'red' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/20 p-4 rounded-lg border border-${stat.color}-200 dark:border-${stat.color}-800`}
          >
            <div className="flex items-center justify-between">
              <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Customers Table */}
      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={customers || []}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Customer Modal */}
      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries(['customers']);
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default CustomerManagement;
```

### 3. Billing & Subscription Management

```typescript
// src/components/dashboard/billing/BillingManagement.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingForm } from './BillingForm';
import { SubscriptionCard } from './SubscriptionCard';
import { InvoiceList } from './InvoiceList';
import { BillingOverview } from './BillingOverview';

const BillingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  const { data: billingData, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: async () => {
      const response = await fetch('/api/billing');
      return response.json();
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionData: any) => {
      const response = await fetch('/api/billing/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['billing']);
    },
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'invoices', label: 'Invoices', icon: <Calendar className="w-5 h-5" /> },
    { id: 'payment-methods', label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
  ];

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
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription and billing information
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Active</span>
        </div>
      </motion.div>

      {/* Current Subscription Status */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {billingData?.subscription?.plan || 'Free Plan'}
            </h2>
            <p className="text-blue-100 mb-4">
              {billingData?.subscription?.description || 'Upgrade to unlock premium features'}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>${billingData?.subscription?.price || 0}/month</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Billed {billingData?.subscription?.billingCycle || 'monthly'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-3xl font-bold">
              ${billingData?.monthlyRevenue || 0}
            </div>
            <div className="text-sm text-blue-100">
              Monthly Revenue
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('subscription')}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Upgrade Plan
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg"
        variants={itemVariants}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={itemVariants}>
        {activeTab === 'overview' && <BillingOverview data={billingData} />}
        {activeTab === 'subscription' && <SubscriptionForm />}
        {activeTab === 'invoices' && <InvoiceList />}
        {activeTab === 'payment-methods' && <PaymentMethods />}
      </motion.div>
    </motion.div>
  );
};

// Billing Overview Component
const BillingOverview: React.FC<{ data: any }> = ({ data }) => {
  const stats = [
    {
      label: 'Monthly Revenue',
      value: `$${data?.monthlyRevenue || 0}`,
      change: '+12.5%',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green'
    },
    {
      label: 'Active Subscriptions',
      value: data?.activeSubscriptions || 0,
      change: '+8.2%',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'blue'
    },
    {
      label: 'Pending Invoices',
      value: data?.pendingInvoices || 0,
      change: '-2.1%',
      icon: <Clock className="w-5 h-5" />,
      color: 'yellow'
    },
    {
      label: 'Failed Payments',
      value: data?.failedPayments || 0,
      change: '+1.3%',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'red'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/20 p-4 rounded-lg border border-${stat.color}-200 dark:border-${stat.color}-800`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {data?.recentTransactions?.map((transaction: any) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : transaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : transaction.status === 'pending' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${transaction.amount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {transaction.customer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
```

## Real Use Case

### Production SaaS Applications

**Stripe Dashboard**, **HubSpot**, and **Salesforce** implement similar patterns:

```typescript
// Advanced Analytics Service
class AdvancedAnalyticsService {
  async generateRealtimeMetrics(timeframe: string) {
    // Real-time data processing
    const metrics = await Promise.all([
      this.getRevenueMetrics(timeframe),
      this.getUserMetrics(timeframe),
      this.getConversionMetrics(timeframe),
      this.getRetentionMetrics(timeframe)
    ]);

    return this.aggregateMetrics(metrics);
  }

  async generatePredictiveAnalytics() {
    // Machine learning predictions
    const predictions = await this.mlService.predict({
      customerChurn: this.getCustomerData(),
      revenueForecast: this.getRevenueData(),
      userGrowth: this.getUserData()
    });

    return predictions;
  }

  private async getRevenueMetrics(timeframe: string) {
    // Revenue analytics implementation
  }

  private async getUserMetrics(timeframe: string) {
    // User analytics implementation
  }
}
```

## Pro Tip

**Implement Real-time Updates with WebSockets**

```typescript
// src/hooks/useRealtime.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useRealtime = (endpoint: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(endpoint, {
      transports: ['websocket'],
      autoConnect: true
    });

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to real-time server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from real-time server');
    });

    newSocket.on('data-update', (newData) => {
      setData(newData);
    });

    newSocket.on('analytics-update', (analytics) => {
      setData(prev => ({ ...prev, analytics }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [endpoint]);

  const emit = (event: string, data: any) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  return { socket, connected, data, emit };
};
```

## Exercise

**Build a Complete SaaS Dashboard**

Create a comprehensive SaaS dashboard application with the following requirements:

```typescript
// Exercise Tasks:
// 1. Set up the complete project structure
// 2. Implement analytics dashboard with charts
// 3. Create customer management system
// 4. Build billing and subscription management
// 5. Add real-time updates with WebSockets
// 6. Implement user authentication and roles
// 7. Create responsive design for all devices
// 8. Add data export and reporting
// 9. Implement caching and performance optimization
// 10. Set up monitoring and error tracking

// Implementation Checklist:

// 1. Project Setup
// - Initialize Next.js 14 project
// - Configure TypeScript and ESLint
// - Set up Tailwind CSS
// - Configure Prisma and PostgreSQL
// - Set up Redis for caching
// - Configure Stripe for payments

// 2. Core Features
// - Analytics dashboard with charts
// - Customer management system
// - Billing and subscription management
// - User authentication and authorization
// - Real-time data updates
// - Data export functionality

// 3. Advanced Features
// - Role-based access control
// - Multi-tenant architecture
// - API rate limiting
// - Background jobs processing
// - Email notifications
// - Data analytics and reporting

// 4. UI/UX
// - Responsive design
// - Dark/light theme support
// - Loading states and error handling
// - Interactive charts and graphs
// - Smooth animations and transitions
// - Accessibility features

// 5. Performance & Security
// - Database optimization
// - Caching strategies
// - Input validation and sanitization
// - Security headers and CORS
// - Rate limiting and throttling
// - Error monitoring and logging

// 6. Deployment
// - Docker containerization
// - CI/CD pipeline
// - Environment configuration
// - Database migrations
// - Monitoring and alerting
```

**Your Tasks:**
1. Set up the complete SaaS dashboard project structure
2. Implement analytics dashboard with interactive charts
3. Create comprehensive customer management system
4. Build billing and subscription management with Stripe
5. Add real-time updates using WebSockets
6. Implement user authentication and role-based access
7. Create responsive design for all screen sizes
8. Add data export and reporting functionality
9. Implement caching and performance optimization
10. Set up monitoring, logging, and error tracking

This exercise teaches you:
- SaaS application architecture
- Advanced data visualization
- Real-time communication
- Payment processing integration
- User management and authentication
- Database design and optimization
- Performance monitoring
- Security best practices
- Modern UI/UX patterns
- Production deployment strategies

---

**Next Up**: Learn about building the AI Chat Application! AI Application Development
