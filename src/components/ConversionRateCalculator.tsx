import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, Line, Legend, BarChart, Bar
} from 'recharts';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  BarChart2, 
  Target, 
  ArrowUpRight, 
  Info, 
  Percent, 
  ChevronLeft, 
  ArrowRight, 
  Zap, 
  Award, 
  PieChart 
} from 'lucide-react';

interface InputValues {
  monthlyVisitors: number;
  currentConversionRate: number;
  targetConversionRate: number;
  averageOrderValue: number;
  marketingBudget: number;
}

interface ResultValues {
  currentRevenue: number;
  potentialRevenue: number;
  additionalRevenue: number;
  additionalSales: number;
  revenueIncrease: number;
  roi: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

const ConversionRateCalculator = () => {
  const [inputs, setInputs] = useState<InputValues>({
    monthlyVisitors: 10000,
    currentConversionRate: 2.5,
    targetConversionRate: 3.5,
    averageOrderValue: 75,
    marketingBudget: 5000
  });

  const [results, setResults] = useState<ResultValues>({
    currentRevenue: 0,
    potentialRevenue: 0,
    additionalRevenue: 0,
    additionalSales: 0,
    revenueIncrease: 0,
    roi: 0,
  });

  const [comparisonData, setComparisonData] = useState<ChartDataPoint[]>([]);
  const [conversionImpactData, setConversionImpactData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('input');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const calculateResults = () => {
    // Calculate current metrics
    const currentSales = Math.round(inputs.monthlyVisitors * (inputs.currentConversionRate / 100));
    const currentRevenue = currentSales * inputs.averageOrderValue;
    
    // Calculate potential metrics with improved conversion rate
    const potentialSales = Math.round(inputs.monthlyVisitors * (inputs.targetConversionRate / 100));
    const potentialRevenue = potentialSales * inputs.averageOrderValue;
    
    // Calculate differences
    const additionalSales = potentialSales - currentSales;
    const additionalRevenue = potentialRevenue - currentRevenue;
    const revenueIncrease = (additionalRevenue / currentRevenue) * 100;
    
    // Calculate ROI if marketing budget is provided
    const roi = inputs.marketingBudget > 0 ? ((additionalRevenue - inputs.marketingBudget) / inputs.marketingBudget) * 100 : 0;
    
    setResults({
      currentRevenue,
      potentialRevenue,
      additionalRevenue,
      additionalSales,
      revenueIncrease,
      roi
    });
    
    // Create comparison chart data
    setComparisonData([
      { name: 'Current', value: currentRevenue },
      { name: 'Potential', value: potentialRevenue }
    ]);
    
    // Create conversion impact data for different rates
    const impactData = [];
    const baseRate = Math.max(0.5, inputs.currentConversionRate - 1);
    const maxRate = inputs.targetConversionRate + 1;
    
    for (let rate = baseRate; rate <= maxRate; rate += 0.5) {
      const sales = Math.round(inputs.monthlyVisitors * (rate / 100));
      const revenue = sales * inputs.averageOrderValue;
      
      impactData.push({
        conversionRate: rate.toFixed(1),
        revenue: revenue,
        sales: sales
      });
    }
    
    setConversionImpactData(impactData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Calculator Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            className={`px-4 py-3 font-medium text-sm sm:text-base ${
              activeTab === 'input'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('input')}
          >
            <div className="flex items-center">
              <span className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-md mr-2">
                <Calculator className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </span>
              Calculator
            </div>
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm sm:text-base ${
              activeTab === 'results'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('results')}
          >
            <div className="flex items-center">
              <span className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-md mr-2">
                <BarChart2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </span>
              Results
            </div>
          </button>
        </div>
      </div>

      {/* Inputs Panel */}
      {activeTab === 'input' && (
        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Monthly Visitors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="monthlyVisitors">
                Monthly Website Visitors
              </label>
              <div className="flex items-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-l-md border border-r-0 border-blue-200 dark:border-blue-800 flex items-center justify-center w-12">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <input
                  type="number"
                  id="monthlyVisitors"
                  name="monthlyVisitors"
                  value={inputs.monthlyVisitors}
                  onChange={handleInputChange}
                  min="100"
                  max="10000000"
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <input
                type="range"
                id="monthlyVisitorsRange"
                name="monthlyVisitors"
                min="1000"
                max="1000000"
                step="1000"
                value={inputs.monthlyVisitors}
                onChange={handleInputChange}
                className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Current Conversion Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="currentConversionRate">
                Current Conversion Rate (%)
              </label>
              <div className="flex items-center">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-l-md border border-r-0 border-amber-200 dark:border-amber-800 flex items-center justify-center w-12">
                  <Percent className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <input
                  type="number"
                  id="currentConversionRate"
                  name="currentConversionRate"
                  value={inputs.currentConversionRate}
                  onChange={handleInputChange}
                  min="0.1"
                  max="100"
                  step="0.1"
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <input
                type="range"
                id="currentConversionRateRange"
                name="currentConversionRate"
                min="0.1"
                max="10"
                step="0.1"
                value={inputs.currentConversionRate}
                onChange={handleInputChange}
                className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Target Conversion Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="targetConversionRate">
                Target Conversion Rate (%)
              </label>
              <div className="flex items-center">
                <div className="bg-green-50 dark:bg-green-900/20 p-2.5 rounded-l-md border border-r-0 border-green-200 dark:border-green-800 flex items-center justify-center w-12">
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <input
                  type="number"
                  id="targetConversionRate"
                  name="targetConversionRate"
                  value={inputs.targetConversionRate}
                  onChange={handleInputChange}
                  min="0.1"
                  max="100"
                  step="0.1"
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <input
                type="range"
                id="targetConversionRateRange"
                name="targetConversionRate"
                min="0.1"
                max="10"
                step="0.1"
                value={inputs.targetConversionRate}
                onChange={handleInputChange}
                className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Average Order Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="averageOrderValue">
                Average Order Value
              </label>
              <div className="flex items-center">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2.5 rounded-l-md border border-r-0 border-purple-200 dark:border-purple-800 flex items-center justify-center w-12">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <input
                  type="number"
                  id="averageOrderValue"
                  name="averageOrderValue"
                  value={inputs.averageOrderValue}
                  onChange={handleInputChange}
                  min="1"
                  max="10000"
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <input
                type="range"
                id="averageOrderValueRange"
                name="averageOrderValue"
                min="10"
                max="500"
                step="5"
                value={inputs.averageOrderValue}
                onChange={handleInputChange}
                className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Marketing Budget (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="marketingBudget">
                Monthly Marketing Budget (Optional)
              </label>
              <div className="flex items-center">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2.5 rounded-l-md border border-r-0 border-indigo-200 dark:border-indigo-800 flex items-center justify-center w-12">
                  <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <input
                  type="number"
                  id="marketingBudget"
                  name="marketingBudget"
                  value={inputs.marketingBudget}
                  onChange={handleInputChange}
                  min="0"
                  max="1000000"
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <input
                type="range"
                id="marketingBudgetRange"
                name="marketingBudget"
                min="0"
                max="50000"
                step="1000"
                value={inputs.marketingBudget}
                onChange={handleInputChange}
                className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Summary Box */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <div className="bg-blue-100 dark:bg-blue-800/40 p-1.5 rounded-md mr-2 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Monthly Revenue</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(results.currentRevenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Potential Monthly Revenue</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(results.potentialRevenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Additional Monthly Revenue</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(results.additionalRevenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Additional Monthly Sales</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{results.additionalSales}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('results')}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm inline-flex items-center justify-center transition-colors duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <span>View Detailed Results</span>
                <div className="flex items-center justify-center bg-blue-500/30 ml-2 p-1 rounded">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Panel */}
      {activeTab === 'results' && (
        <div className="p-4 sm:p-6">
          {/* Results Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Monthly Revenue Increase */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Revenue Increase</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(results.additionalRevenue)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {results.revenueIncrease.toFixed(1)}% increase from current
              </p>
            </div>

            {/* Additional Annual Revenue */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                  <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Annual Revenue Impact</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(results.additionalRevenue * 12)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Over 12 months at current rates
              </p>
            </div>

            {/* Additional Customers */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Additional Monthly Sales</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {results.additionalSales}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                New conversions per month
              </p>
            </div>
          </div>

          {/* ROI Section (only if marketing budget is provided) */}
          {inputs.marketingBudget > 0 && (
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-800/40 p-1.5 rounded-md mr-2 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Marketing ROI Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Marketing Budget</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(inputs.marketingBudget)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Net Monthly Profit</p>
                  <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(results.additionalRevenue - inputs.marketingBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Return on Investment</p>
                  <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {results.roi.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Comparison Chart */}
          <div className="mt-6 bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <div className="bg-blue-100 dark:bg-blue-800/40 p-1.5 rounded-md mr-2 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Revenue Comparison
            </h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                  barGap={50}
                >
                  <defs>
                    <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatLargeNumber(value)} 
                    domain={[0, 'dataMax * 1.1']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]} 
                    labelStyle={{ color: '#111827', fontWeight: 500 }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    cursor={{ fill: 'rgba(243, 244, 246, 0.3)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barFill)"
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={70}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion Rate Impact Chart */}
          <div className="mt-6 bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <div className="bg-green-100 dark:bg-green-800/40 p-1.5 rounded-md mr-2 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              Conversion Rate Impact on Revenue
            </h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={conversionImpactData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="conversionRate" 
                    label={{ 
                      value: 'Conversion Rate (%)', 
                      position: 'insideBottom', 
                      offset: -10,
                      style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
                    }} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatLargeNumber(value)} 
                    label={{ 
                      value: 'Monthly Revenue ($)', 
                      angle: -90, 
                      position: 'insideLeft',
                      offset: -5,
                      style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 } 
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') return [formatCurrency(value), "Revenue"];
                      if (name === 'sales') return [value, "Sales"];
                      return [value, name];
                    }}
                    labelStyle={{ color: '#111827', fontWeight: 500 }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ paddingTop: 20 }}
                  />
                  <ReferenceLine
                    x={inputs.currentConversionRate.toFixed(1)}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    label={{
                      value: 'Current',
                      position: 'insideTopRight',
                      style: { fill: '#f59e0b', fontWeight: 600, fontSize: 12 }
                    }}
                  />
                  <ReferenceLine
                    x={inputs.targetConversionRate.toFixed(1)}
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    label={{
                      value: 'Target',
                      position: 'insideTopLeft',
                      style: { fill: '#10b981', fontWeight: 600, fontSize: 12 }
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center">
              <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/20">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center font-medium">
                  <Info className="mr-2 h-4 w-4" />
                  Even a 1% improvement in conversion rate can significantly impact revenue
                </p>
              </div>
            </div>
          </div>

          {/* Back to Calculator Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setActiveTab('input')}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 p-1 rounded mr-2">
                <ChevronLeft className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              </div>
              <span>Back to Calculator</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionRateCalculator; 