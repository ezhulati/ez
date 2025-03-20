import React, { useState, useEffect } from 'react';
import { 
  LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, Line
} from 'recharts';
import { 
  AlertCircle, Clock, DollarSign, TrendingUp, CheckCircle, 
  ArrowRight, ArrowDown, ArrowUp
} from 'lucide-react';

interface InputValues {
  monthlyVisitors: number;
  conversionRate: number;
  averageOrderValue: number;
  currentLoadTime: number;
  targetLoadTime: number;
}

interface ResultValues {
  currentRevenue: number;
  potentialRevenue: number;
  potentialIncrease: number;
  potentialIncreasePercentage: number;
  annualImpact: number;
}

interface ChartDataPoint {
  loadTime: number;
  revenue: number;
}

const SpeedROICalculator = () => {
  const [inputs, setInputs] = useState<InputValues>({
    monthlyVisitors: 10000,
    conversionRate: 2.5,
    averageOrderValue: 75,
    currentLoadTime: 5.0,
    targetLoadTime: 2.0,
  });

  const [results, setResults] = useState<ResultValues>({
    currentRevenue: 0,
    potentialRevenue: 0,
    potentialIncrease: 0,
    potentialIncreasePercentage: 0,
    annualImpact: 0
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeTab, setActiveTab] = useState('input');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: parseFloat(value)
    });
  };

  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const calculateResults = () => {
    // Based on research showing ~4.42% conversion drop per additional second
    const conversionImpactRatePerSecond = 0.0442;
    
    const currentConversionRate = inputs.conversionRate;
    const secondsDifference = inputs.currentLoadTime - inputs.targetLoadTime;
    
    // Calculate potential conversion rate improvement
    const potentialConversionRate = currentConversionRate * 
      (1 + (conversionImpactRatePerSecond * secondsDifference));
    
    // Calculate revenue figures
    const currentRevenue = (inputs.monthlyVisitors * (currentConversionRate / 100) * inputs.averageOrderValue);
    const potentialRevenue = (inputs.monthlyVisitors * (potentialConversionRate / 100) * inputs.averageOrderValue);
    const potentialIncrease = potentialRevenue - currentRevenue;
    const potentialIncreasePercentage = (potentialIncrease / currentRevenue) * 100;
    const annualImpact = potentialIncrease * 12;
    
    setResults({
      currentRevenue,
      potentialRevenue,
      potentialIncrease,
      potentialIncreasePercentage,
      annualImpact
    });
    
    // Generate chart data
    const data: ChartDataPoint[] = [];
    
    // Ensure chart range covers both current and target load times, plus some buffer
    const maxChartTime = Math.max(inputs.currentLoadTime, inputs.targetLoadTime) + 2;
    const minChartTime = Math.max(0.5, Math.min(inputs.targetLoadTime, inputs.currentLoadTime) - 1);
    
    // Make sure we include exact points for current and target times
    const exactPoints = new Set([inputs.currentLoadTime, inputs.targetLoadTime]);
    
    // Generate data points at regular intervals
    for (let i = minChartTime; i <= maxChartTime; i += 0.5) {
      addDataPoint(i);
    }
    
    // Add exact data points for current and target load times
    exactPoints.forEach(point => {
      // Check if we already have this exact point
      if (!data.some(d => d.loadTime === point)) {
        addDataPoint(point);
      }
    });
    
    // Sort data points by load time
    data.sort((a, b) => a.loadTime - b.loadTime);
    
    function addDataPoint(loadTime: number) {
      const simulatedConvRate = inputs.conversionRate * 
        (1 - (conversionImpactRatePerSecond * (loadTime - inputs.targetLoadTime)));
      const simulatedRevenue = (inputs.monthlyVisitors * (Math.max(0, simulatedConvRate) / 100) * inputs.averageOrderValue);
      
      data.push({
        loadTime,
        revenue: simulatedRevenue,
      });
    }
    
    setChartData(data);
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: parseFloat(value)
    });
  };

  return (
    <div className="font-sans">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 rounded-t-xl overflow-hidden bg-white shadow-sm">
        <div className="flex">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-4 px-4 font-medium text-sm focus:outline-none relative ${
              activeTab === 'input'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Your Website Metrics</span>
            {activeTab === 'input' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-4 px-4 font-medium text-sm focus:outline-none relative ${
              activeTab === 'results'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Revenue Impact</span>
            {activeTab === 'results' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
        </div>
      </div>
      
      {/* Methodology note - prominent location */}
      <div className="text-center py-2 bg-blue-50 border-b border-blue-100">
        <p className="text-sm text-blue-700">
          Based on industry research showing conversion rates drop <span className="font-semibold">~4.42%</span> per additional second of load time
        </p>
      </div>
      
      {/* Input Tab */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-b-xl shadow-sm p-6">
          {/* Traffic & Conversion Section */}
          <div className="mb-8">
            <div className="flex items-center mb-5">
              <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Traffic & Conversion</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Monthly Visitors */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Website Visitors
                  </label>
                  <span className="text-sm text-gray-500">{inputs.monthlyVisitors.toLocaleString()}</span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="range"
                    name="monthlyVisitors"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={inputs.monthlyVisitors}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                    <span>1K</span>
                    <span>1M</span>
                  </div>
                </div>
              </div>
              
              {/* Conversion Rate */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Conversion Rate (%)
                  </label>
                  <span className="text-sm text-gray-500">{inputs.conversionRate}%</span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="range"
                    name="conversionRate"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={inputs.conversionRate}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                    <span>0.1%</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Average Order Value */}
            <div className="mt-6">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Average Order Value ($)
                </label>
                <span className="text-sm text-gray-500">${inputs.averageOrderValue}</span>
              </div>
              <div className="relative mt-1">
                <input
                  type="range"
                  name="averageOrderValue"
                  min="1"
                  max="500"
                  step="1"
                  value={inputs.averageOrderValue}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                  <span>$1</span>
                  <span>$500</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Page Speed Section */}
          <div className="mt-12 mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Clock size={20} />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Page Speed</h3>
              </div>
              <a 
                href="https://pagespeed.web.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                aria-label="Test your site speed with Google PageSpeed Insights"
              >
                Don't know your site speed? Test it
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Current Load Time */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Page Load Time (seconds)
                  </label>
                  <span className="text-sm text-gray-500">{inputs.currentLoadTime}s</span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="range"
                    name="currentLoadTime"
                    min="1"
                    max="10"
                    step="0.1"
                    value={inputs.currentLoadTime}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                    <span>1s</span>
                    <span>10s</span>
                  </div>
                </div>
              </div>
              
              {/* Target Load Time */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Target Page Load Time (seconds)
                  </label>
                  <span className="text-sm text-gray-500">{inputs.targetLoadTime}s</span>
                </div>
                <div className="relative mt-1">
                  <input
                    type="range"
                    name="targetLoadTime"
                    min="1"
                    max="10"
                    step="0.1"
                    value={inputs.targetLoadTime}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                    <span>1s</span>
                    <span>10s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              See Your Results
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-b-xl shadow-sm p-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Current Revenue Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                  <AlertCircle size={18} className="text-red-600" />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-700">Current Monthly Revenue</h3>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.currentRevenue)}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">At {inputs.currentLoadTime}s load time</p>
              </div>
            </div>
            
            {/* Potential Revenue Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-700">Potential Monthly Revenue</h3>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(results.potentialRevenue)}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">At {inputs.targetLoadTime}s load time</p>
              </div>
            </div>
            
            {/* Annual Impact Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <DollarSign size={18} className="text-blue-600" />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-700">Potential Annual Impact</h3>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-blue-700">{formatCurrency(results.annualImpact)}</p>
                </div>
                <div className="flex items-center mt-1">
                  <ArrowUp size={14} className="text-green-600 mr-1" />
                  <p className="text-sm font-medium text-green-600">
                    {results.potentialIncreasePercentage.toFixed(1)}% revenue increase
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Revenue vs. Page Speed</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Current: {inputs.currentLoadTime}s</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Target: {inputs.targetLoadTime}s</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="loadTime" 
                    label={{ 
                      value: 'Page Load Time (seconds)',
                      position: 'insideBottom',
                      offset: -15
                    }}
                    domain={['dataMin', 'dataMax']}
                    allowDataOverflow={true}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    label={{ 
                      value: 'Monthly Revenue',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -10
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
                    labelFormatter={(value: string) => `Load Time: ${value}s`}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                  
                  {/* Current load time vertical line */}
                  <ReferenceLine 
                    x={inputs.currentLoadTime} 
                    stroke="#EF4444"
                    strokeWidth={3} 
                    strokeDasharray="3 3"
                    label={{
                      value: "Current Speed",
                      fill: "#EF4444",
                      fontSize: 14,
                      fontWeight: "bold",
                      position: "top"
                    }}
                    ifOverflow="extendDomain"
                    z={10}
                  />
                  
                  {/* Target load time vertical line */}
                  <ReferenceLine 
                    x={inputs.targetLoadTime} 
                    stroke="#10B981"
                    strokeWidth={3} 
                    strokeDasharray="3 3"
                    label={{
                      value: "Target Speed",
                      fill: "#10B981",
                      fontSize: 14,
                      fontWeight: "bold",
                      position: "top"
                    }}
                    ifOverflow="extendDomain"
                    z={10}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Chart explanation text */}
          <div className="mt-2 mb-8">
            <p className="text-sm text-gray-500 leading-relaxed">
              This chart illustrates how improving your page loading speed from <span className="font-medium text-red-600">{inputs.currentLoadTime}s</span> to <span className="font-medium text-green-600">{inputs.targetLoadTime}s</span> could impact your monthly revenue.
              <span className="block mt-1">Faster websites have higher conversion rates, leading to increased revenue.</span>
            </p>
          </div>
          
          {/* Recommendations */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Speed Optimization Recommendations</h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={14} className="text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Optimize images</p>
                  <p className="text-sm text-gray-500">Potential 0.8-1.2s improvement</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={14} className="text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Implement effective caching</p>
                  <p className="text-sm text-gray-500">Potential 0.5-1.0s improvement</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={14} className="text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Minimize and defer JavaScript</p>
                  <p className="text-sm text-gray-500">Potential 0.7-1.5s improvement</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={14} className="text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Optimize Core Web Vitals</p>
                  <p className="text-sm text-gray-500">Improved user experience and SEO</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('input')}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Edit Your Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedROICalculator; 