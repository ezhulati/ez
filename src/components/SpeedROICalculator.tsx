import React, { useState, useEffect, useRef } from 'react';
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
  
  // Add refs for tracking previous values to animate value changes
  const prevInputsRef = useRef<InputValues>(inputs);
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => {
      // Save the previous value
      prevInputsRef.current = prev;
      // Mark the field as changed for animation
      setChangedFields({
        ...changedFields,
        [name]: true
      });
      
      // Clear the changed status after animation
      setTimeout(() => {
        setChangedFields(prev => ({
          ...prev,
          [name]: false
        }));
      }, 300);
      
      return {
        ...prev,
        [name]: parseFloat(value)
      };
    });
  };

  // Use handleSliderChange instead of handleInputChange for sliders
  const handleSliderChange = handleInputChange;

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

  // Calculate the width of progress bars for each slider
  const getProgressPercentage = (value: number, min: number, max: number): number => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="font-sans max-w-full overflow-x-hidden">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 rounded-t-xl overflow-hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 font-medium text-sm focus:outline-none relative transition-colors duration-200 ${
              activeTab === 'input'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Your Website Metrics</span>
            {activeTab === 'input' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-slide-in-right"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 font-medium text-sm focus:outline-none relative transition-colors duration-200 ${
              activeTab === 'results'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Revenue Impact</span>
            {activeTab === 'results' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-slide-in-right"></span>
            )}
          </button>
        </div>
      </div>
      
      {/* Methodology note - prominent location */}
      <div className="text-center py-2 bg-blue-50 border-b border-blue-100">
        <p className="text-xs sm:text-sm text-blue-700 px-2">
          Based on industry research showing conversion rates drop <span className="font-semibold">~4.42%</span> per additional second of load time
        </p>
      </div>
      
      {/* Input Tab */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-b-xl shadow-sm p-4 sm:p-6 animate-fade-in">
          {/* Traffic & Conversion Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-4 sm:mb-5">
              <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <TrendingUp size={18} className="sm:hidden" />
                <TrendingUp size={20} className="hidden sm:block" />
              </div>
              <h3 className="ml-3 text-base sm:text-lg font-medium text-gray-900">Traffic & Conversion</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Monthly Visitors */}
              <div className="space-y-2">
                <div className="flex justify-between items-center flex-wrap">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                    Monthly Website Visitors
                  </label>
                  <span className={`slider-value blue ${changedFields.monthlyVisitors ? 'changed' : ''}`}>
                    {inputs.monthlyVisitors.toLocaleString()}
                  </span>
                </div>
                <div className="slider-container">
                  <div 
                    className="slider-progress" 
                    style={{ width: `${getProgressPercentage(inputs.monthlyVisitors, 1000, 1000000)}%` }}
                  ></div>
                  <input
                    type="range"
                    name="monthlyVisitors"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={inputs.monthlyVisitors}
                    onChange={handleSliderChange}
                    className="premium-slider"
                  />
                </div>
                <div className="slider-labels">
                  <span className="slider-label">1K</span>
                  <span className="slider-label">1M</span>
                </div>
              </div>
              
              {/* Conversion Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center flex-wrap">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                    Conversion Rate (%)
                  </label>
                  <span className={`slider-value blue ${changedFields.conversionRate ? 'changed' : ''}`}>
                    {inputs.conversionRate}%
                  </span>
                </div>
                <div className="slider-container">
                  <div 
                    className="slider-progress" 
                    style={{ width: `${getProgressPercentage(inputs.conversionRate, 0.1, 10)}%` }}
                  ></div>
                  <input
                    type="range"
                    name="conversionRate"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={inputs.conversionRate}
                    onChange={handleSliderChange}
                    className="premium-slider"
                  />
                </div>
                <div className="slider-labels">
                  <span className="slider-label">0.1%</span>
                  <span className="slider-label">10%</span>
                </div>
              </div>
            </div>
            
            {/* Average Order Value */}
            <div className="mt-5 sm:mt-6">
              <div className="flex justify-between items-center flex-wrap">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                  Average Order Value ($)
                </label>
                <span className={`slider-value blue ${changedFields.averageOrderValue ? 'changed' : ''}`}>
                  ${inputs.averageOrderValue}
                </span>
              </div>
              <div className="slider-container">
                <div 
                  className="slider-progress" 
                  style={{ width: `${getProgressPercentage(inputs.averageOrderValue, 1, 500)}%` }}
                ></div>
                <input
                  type="range"
                  name="averageOrderValue"
                  min="1"
                  max="500"
                  step="1"
                  value={inputs.averageOrderValue}
                  onChange={handleSliderChange}
                  className="premium-slider"
                />
              </div>
              <div className="slider-labels">
                <span className="slider-label">$1</span>
                <span className="slider-label">$500</span>
              </div>
            </div>
          </div>
          
          {/* Page Speed Section */}
          <div className="mt-8 sm:mt-12 mb-6 sm:mb-10">
            <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-2">
              <div className="flex items-center">
                <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Clock size={18} className="sm:hidden" />
                  <Clock size={20} className="hidden sm:block" />
                </div>
                <h3 className="ml-3 text-base sm:text-lg font-medium text-gray-900">Page Speed</h3>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Current Load Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center flex-wrap">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                    Current Page Load Time (seconds)
                  </label>
                  <span className={`slider-value red ${changedFields.currentLoadTime ? 'changed' : ''}`}>
                    {inputs.currentLoadTime}s
                  </span>
                </div>
                <div className="slider-container">
                  <div 
                    className="slider-progress red" 
                    style={{ width: `${getProgressPercentage(inputs.currentLoadTime, 1, 10)}%` }}
                  ></div>
                  <input
                    type="range"
                    name="currentLoadTime"
                    min="1"
                    max="10"
                    step="0.1"
                    value={inputs.currentLoadTime}
                    onChange={handleSliderChange}
                    className="premium-slider red"
                  />
                </div>
                <div className="slider-labels">
                  <span className="slider-label">1s</span>
                  <span className="slider-label">10s</span>
                </div>
              </div>
              
              {/* Target Load Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center flex-wrap">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                    Target Page Load Time (seconds)
                  </label>
                  <span className={`slider-value green ${changedFields.targetLoadTime ? 'changed' : ''}`}>
                    {inputs.targetLoadTime}s
                  </span>
                </div>
                <div className="slider-container">
                  <div 
                    className="slider-progress green" 
                    style={{ width: `${getProgressPercentage(inputs.targetLoadTime, 1, 10)}%` }}
                  ></div>
                  <input
                    type="range"
                    name="targetLoadTime"
                    min="1"
                    max="10"
                    step="0.1"
                    value={inputs.targetLoadTime}
                    onChange={handleSliderChange}
                    className="premium-slider green"
                  />
                </div>
                <div className="slider-labels">
                  <span className="slider-label">1s</span>
                  <span className="slider-label">10s</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add hint for sliders */}
          <div className="text-center mt-6 sm:mt-8 mb-4 sm:mb-6">
            <p className="flex items-center justify-center text-xs sm:text-sm text-gray-600 bg-gray-50 py-3 px-3 sm:px-4 rounded-lg shadow-sm border border-gray-100">
              <span className="inline-block w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </span>
              <span className="font-medium">Drag the sliders</span> to adjust values and see their impact on your potential revenue
            </p>
          </div>
          
          {/* Action Button */}
          <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              See Your Results
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-b-xl shadow-sm p-4 sm:p-6 animate-fade-in">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:gap-6 sm:mb-10">
            {/* Current Revenue Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-red-50">
                  <AlertCircle size={16} className="text-red-600 sm:hidden" />
                  <AlertCircle size={18} className="text-red-600 hidden sm:block" />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-700">Current Monthly Revenue</h3>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(results.currentRevenue)}</p>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">At {inputs.currentLoadTime}s load time</p>
              </div>
            </div>
            
            {/* Potential Revenue Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle size={16} className="text-green-600 sm:hidden" />
                  <CheckCircle size={18} className="text-green-600 hidden sm:block" />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-700">Potential Monthly Revenue</h3>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{formatCurrency(results.potentialRevenue)}</p>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">At {inputs.targetLoadTime}s load time</p>
              </div>
            </div>
            
            {/* Annual Impact Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-blue-100">
                  <DollarSign size={16} className="text-blue-600 sm:hidden" />
                  <DollarSign size={18} className="text-blue-600 hidden sm:block" />
                </div>
                <h3 className="ml-3 text-sm font-medium text-gray-700">Potential Annual Impact</h3>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-700">{formatCurrency(results.annualImpact)}</p>
                </div>
                <div className="flex items-center mt-1">
                  <ArrowUp size={12} className="text-green-600 mr-1 sm:hidden" />
                  <ArrowUp size={14} className="text-green-600 mr-1 hidden sm:block" />
                  <p className="text-xs sm:text-sm font-medium text-green-600">
                    {results.potentialIncreasePercentage.toFixed(1)}% revenue increase
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-y-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Revenue vs. Page Speed</h3>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Current: {inputs.currentLoadTime}s</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Target: {inputs.targetLoadTime}s</span>
                </div>
              </div>
            </div>
            <div className="h-60 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="loadTime" 
                    label={{ 
                      value: 'Page Load Time (seconds)',
                      position: 'insideBottom',
                      offset: -15,
                      style: { fontSize: '10px', fill: '#6B7280' }
                    }}
                    tick={{ fontSize: 10 }}
                    domain={['dataMin', 'dataMax']}
                    allowDataOverflow={true}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    label={{ 
                      value: 'Monthly Revenue',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -5,
                      style: { fontSize: '10px', fill: '#6B7280' }
                    }}
                    tick={{ fontSize: 10 }}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
                    labelFormatter={(value: string) => `Load Time: ${value}s`}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  
                  {/* Current load time vertical line */}
                  <ReferenceLine 
                    x={inputs.currentLoadTime} 
                    stroke="#EF4444"
                    strokeWidth={2} 
                    strokeDasharray="3 3"
                    label={{
                      value: "Current",
                      fill: "#EF4444",
                      fontSize: 12,
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
                    strokeWidth={2} 
                    strokeDasharray="3 3"
                    label={{
                      value: "Target",
                      fill: "#10B981",
                      fontSize: 12,
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
          <div className="mt-2 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              This chart illustrates how improving your page loading speed from <span className="font-medium text-red-600">{inputs.currentLoadTime}s</span> to <span className="font-medium text-green-600">{inputs.targetLoadTime}s</span> could impact your monthly revenue.
              <span className="block mt-1">Faster websites have higher conversion rates, leading to increased revenue.</span>
            </p>
          </div>
          
          {/* Recommendations */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Speed Optimization Recommendations</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={12} className="text-blue-600 sm:hidden" />
                    <CheckCircle size={14} className="text-blue-600 hidden sm:block" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Optimize images</p>
                  <p className="text-xs text-gray-500">Potential 0.8-1.2s improvement</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={12} className="text-blue-600 sm:hidden" />
                    <CheckCircle size={14} className="text-blue-600 hidden sm:block" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Implement effective caching</p>
                  <p className="text-xs text-gray-500">Potential 0.5-1.0s improvement</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={12} className="text-blue-600 sm:hidden" />
                    <CheckCircle size={14} className="text-blue-600 hidden sm:block" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Minimize and defer JavaScript</p>
                  <p className="text-xs text-gray-500">Potential 0.7-1.5s improvement</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-100">
                    <CheckCircle size={12} className="text-blue-600 sm:hidden" />
                    <CheckCircle size={14} className="text-blue-600 hidden sm:block" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Optimize Core Web Vitals</p>
                  <p className="text-xs text-gray-500">Improved user experience and SEO</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8">
            <div className="flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => setActiveTab('input')}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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