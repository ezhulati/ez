import React, { useState, useEffect } from 'react';
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
  Info, 
  Percent, 
  Search
} from 'lucide-react';

interface InputValues {
  monthlyInvestment: number;
  keywords: {
    keyword: string;
    currentPosition: number;
    monthlyVolume: number;
    conversionRate: number;
  }[];
  averageCustomerValue: number;
  timeframe: number;
  industryType: string;
  includeCompounding: boolean;
}

interface ResultValues {
  months: {
    month: number;
    traffic: number;
    conversions: number;
    revenue: number;
    cost: number;
    totalRevenue: number;
    totalCost: number;
    roi: number;
  }[];
  summary: {
    totalTraffic: number;
    totalConversions: number;
    totalRevenue: number;
    totalCost: number;
    totalROI: number;
    breakEvenMonth: number;
  };
}

const SEOROICalculator = () => {
  // Input state
  const [inputs, setInputs] = useState<InputValues>({
    monthlyInvestment: 2000,
    keywords: [
      { keyword: 'seo services', currentPosition: 12, monthlyVolume: 2900, conversionRate: 3 }
    ],
    averageCustomerValue: 2500,
    timeframe: 24,
    industryType: 'saas',
    includeCompounding: true
  });
  
  // Results state
  const [results, setResults] = useState<ResultValues | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  
  // Industry factors for 2025
  const industryFactors = {
    saas: { improvementRate: 2.1, convMultiplier: 1.2, aiDiscoveryBoost: 1.3 },
    ecommerce: { improvementRate: 1.8, convMultiplier: 1.4, aiDiscoveryBoost: 1.2 },
    local: { improvementRate: 2.4, convMultiplier: 1.5, aiDiscoveryBoost: 1.4 },
    b2b: { improvementRate: 1.7, convMultiplier: 1.1, aiDiscoveryBoost: 1.2 },
    other: { improvementRate: 1.9, convMultiplier: 1.2, aiDiscoveryBoost: 1.2 }
  };
  
  // CTR estimates by position for 2025
  const ctrByPosition = {
    1: 26.8, 2: 14.3, 3: 9.6, 4: 7.2, 5: 5.5,
    6: 4.1, 7: 3.0, 8: 2.4, 9: 1.9, 10: 1.6,
    11: 0.4, 12: 0.3, 13: 0.2, 14: 0.2, 15: 0.1
  };
  
  const handleNewKeyword = () => {
    setInputs(prev => ({
      ...prev,
      keywords: [
        ...prev.keywords, 
        { keyword: '', currentPosition: 11, monthlyVolume: 1000, conversionRate: 2.5 }
      ]
    }));
  };
  
  const handleKeywordChange = (index: number, field: string, value: string | number) => {
    setInputs(prev => {
      const newKeywords = [...prev.keywords];
      newKeywords[index] = {
        ...newKeywords[index],
        [field]: field === 'keyword' ? value : Number(value)
      };
      
      return {
        ...prev,
        keywords: newKeywords
      };
    });
  };
  
  const handleRemoveKeyword = (index: number) => {
    setInputs(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setInputs(prev => {
      return {
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : (type === 'number' || name === 'timeframe') 
            ? parseFloat(value) 
            : value
      };
    });
  };
  
  const calculateResults = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const industry = industryFactors[inputs.industryType as keyof typeof industryFactors] || industryFactors.other;
      const months = [];
      
      // Calculate for each month
      for (let month = 1; month <= inputs.timeframe; month++) {
        let monthlyTraffic = 0;
        let monthlyConversions = 0;
        
        // For each keyword
        inputs.keywords.forEach(keyword => {
          // Calculate improved position
          const improvement = industry.improvementRate * month * (inputs.includeCompounding ? (1 / (1 + Math.exp(-0.5 * (month - 4)))) : 1);
          const newPosition = Math.max(1, keyword.currentPosition - improvement);
          const roundedPosition = Math.round(newPosition);
          
          // Get CTR for position
          const ctr = ctrByPosition[roundedPosition as keyof typeof ctrByPosition] || 0.1;
          
          // Calculate traffic
          const traffic = keyword.monthlyVolume * (ctr / 100) * industry.aiDiscoveryBoost;
          
          // Calculate conversions
          const conversions = traffic * (keyword.conversionRate / 100) * industry.convMultiplier;
          
          monthlyTraffic += traffic;
          monthlyConversions += conversions;
        });
        
        const monthlyRevenue = monthlyConversions * inputs.averageCustomerValue;
        const monthlyCost = inputs.monthlyInvestment;
        
        const previousRevenue: number = month > 1 ? months[month - 2].totalRevenue : 0;
        const previousCost: number = month > 1 ? months[month - 2].totalCost : 0;
        
        const totalRevenue: number = previousRevenue + monthlyRevenue;
        const totalCost: number = previousCost + monthlyCost;
        const roi = ((totalRevenue - totalCost) / totalCost) * 100;
        
        months.push({
          month,
          traffic: Math.round(monthlyTraffic),
          conversions: Math.round(monthlyConversions * 10) / 10,
          revenue: Math.round(monthlyRevenue),
          cost: monthlyCost,
          totalRevenue,
          totalCost,
          roi: Math.round(roi * 100) / 100
        });
      }
      
      // Calculate summary
      const lastMonth = months[months.length - 1];
      const breakEvenMonth = months.findIndex(m => m.totalRevenue >= m.totalCost) + 1;
      
      setResults({
        months,
        summary: {
          totalTraffic: months.reduce((sum, m) => sum + m.traffic, 0),
          totalConversions: months.reduce((sum, m) => sum + m.conversions, 0),
          totalRevenue: lastMonth.totalRevenue,
          totalCost: lastMonth.totalCost,
          totalROI: lastMonth.roi,
          breakEvenMonth: breakEvenMonth || 0
        }
      });
      
      setIsCalculating(false);
      setActiveTab('results');
    }, 500);
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
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('input')}
          >
            <div className="flex items-center">
              <span className="flex items-center justify-center bg-green-50 dark:bg-green-900/20 p-1.5 rounded-md mr-2">
                <Calculator className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </span>
              Calculator
            </div>
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm sm:text-base ${
              activeTab === 'results'
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('results')}
            disabled={!results}
          >
            <div className="flex items-center">
              <span className="flex items-center justify-center bg-green-50 dark:bg-green-900/20 p-1.5 rounded-md mr-2">
                <BarChart2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
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
            {/* Monthly SEO Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="monthlyInvestment">
                Monthly SEO Investment ($)
              </label>
              <div className="flex items-center">
                <div className="bg-green-50 dark:bg-green-900/20 p-2.5 rounded-l-md border border-r-0 border-green-200 dark:border-green-800 flex items-center justify-center w-12">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <input
                  type="number"
                  id="monthlyInvestment"
                  name="monthlyInvestment"
                  value={inputs.monthlyInvestment}
                  onChange={handleInputChange}
                  min="0"
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <input
                type="range"
                id="monthlyInvestmentRange"
                name="monthlyInvestment"
                min="500"
                max="10000"
                step="500"
                value={inputs.monthlyInvestment}
                onChange={handleInputChange}
                className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>
            
            {/* Average Customer Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="averageCustomerValue">
                Average Customer Value ($)
              </label>
              <div className="flex items-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-l-md border border-r-0 border-blue-200 dark:border-blue-800 flex items-center justify-center w-12">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <input
                  type="number"
                  id="averageCustomerValue"
                  name="averageCustomerValue"
                  value={inputs.averageCustomerValue}
                  onChange={handleInputChange}
                  min="0"
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                />
              </div>
              <input
                type="range"
                id="averageCustomerValueRange"
                name="averageCustomerValue"
                min="100"
                max="10000"
                step="100"
                value={inputs.averageCustomerValue}
                onChange={handleInputChange}
                className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </div>
            
            {/* Industry Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="industryType">
                Industry
              </label>
              <div className="flex items-center">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2.5 rounded-l-md border border-r-0 border-purple-200 dark:border-purple-800 flex items-center justify-center w-12">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <select 
                  id="industryType" 
                  name="industryType" 
                  value={inputs.industryType} 
                  onChange={handleInputChange}
                  className="flex-1 block w-full rounded-r-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="saas">SaaS / Software</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="local">Local Business</option>
                  <option value="b2b">B2B Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            {/* Timeframe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="timeframe">
                Timeframe (Months): <span className="font-semibold">{inputs.timeframe}</span>
              </label>
              <input 
                type="range" 
                min="6" 
                max="36" 
                step="6" 
                id="timeframe"
                name="timeframe"
                value={inputs.timeframe} 
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>6</span>
                <span>12</span>
                <span>18</span>
                <span>24</span>
                <span>30</span>
                <span>36</span>
              </div>
            </div>
            
            {/* Target Keywords */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Keywords</label>
                <button 
                  onClick={handleNewKeyword}
                  className="text-green-600 dark:text-green-400 text-sm hover:underline flex items-center"
                >
                  <span>Add Keyword</span>
                  <span className="ml-1 w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">+</span>
                </button>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm bg-gray-50 dark:bg-gray-800/50">
                      <th className="p-2">Keyword</th>
                      <th className="p-2">Current Position</th>
                      <th className="p-2">Monthly Searches</th>
                      <th className="p-2">Conv. Rate (%)</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputs.keywords.map((keyword, index) => (
                      <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="p-2">
                          <div className="flex items-center">
                            <div className="mr-2">
                              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                              type="text"
                              value={keyword.keyword}
                              onChange={(e) => handleKeywordChange(index, 'keyword', e.target.value)}
                              className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                              placeholder="e.g., seo services"
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={keyword.currentPosition}
                            onChange={(e) => handleKeywordChange(index, 'currentPosition', e.target.value)}
                            className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                            min="1"
                            max="100"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={keyword.monthlyVolume}
                            onChange={(e) => handleKeywordChange(index, 'monthlyVolume', e.target.value)}
                            className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                            min="0"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={keyword.conversionRate}
                            onChange={(e) => handleKeywordChange(index, 'conversionRate', e.target.value)}
                            className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                            min="0"
                            step="0.1"
                          />
                        </td>
                        <td className="p-2">
                          {inputs.keywords.length > 1 && (
                            <button
                              onClick={() => handleRemoveKeyword(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Compounding Effect */}
            <div>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  name="includeCompounding"
                  checked={inputs.includeCompounding}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Include compounding effects (SEO benefits accelerate over time)</span>
              </label>
            </div>
            
            <button
              onClick={calculateResults}
              disabled={isCalculating}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium rounded-md shadow-sm transition-colors disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                'Calculate SEO ROI'
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Results Panel */}
      {activeTab === 'results' && results && (
        <div className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total ROI</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{results.summary.totalROI.toFixed(2)}%</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Break-even</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Month {results.summary.breakEvenMonth || '—'}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(results.summary.totalRevenue)}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(results.summary.totalCost)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">ROI Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.months}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                        stroke="#9ca3af"
                      />
                      <YAxis 
                        label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
                        stroke="#9ca3af"
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value}%`, 'ROI']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          color: '#1f2937'
                        }}
                      />
                      <ReferenceLine y={0} stroke="#ef4444" />
                      <Line 
                        type="monotone" 
                        dataKey="roi" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Revenue vs. Cost</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.months}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                        stroke="#9ca3af"
                      />
                      <YAxis 
                        label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                        stroke="#9ca3af"
                      />
                      <Tooltip 
                        formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          color: '#1f2937'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalRevenue" 
                        name="Total Revenue"
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalCost" 
                        name="Total Cost"
                        stroke="#f59e0b" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2, fill: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Traffic & Conversions</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.months}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      stroke="#8b5cf6"
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#3b82f6"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        color: '#1f2937'
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="traffic" 
                      name="Organic Traffic" 
                      fill="#8b5cf6"
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="conversions" 
                      name="Conversions" 
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Next Steps for SEO Success
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <span className="text-green-700 dark:text-green-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Target your highest-value keywords first</h4>
                    <p className="text-gray-600 dark:text-gray-300">Focus on keywords with high search volume, strong conversion potential, and reasonable competition.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <span className="text-green-700 dark:text-green-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Build comprehensive content assets</h4>
                    <p className="text-gray-600 dark:text-gray-300">Develop detailed, authoritative content that aligns with search intent and positions you as an industry leader.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <span className="text-green-700 dark:text-green-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Focus on technical excellence</h4>
                    <p className="text-gray-600 dark:text-gray-300">Ensure your site provides an exceptional user experience with fast loading times and solid technical foundation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setActiveTab('input')}
              className="w-full py-2 px-4 bg-white dark:bg-gray-800 border border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 font-medium rounded-md shadow-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              Modify Calculations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOROICalculator; 