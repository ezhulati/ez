import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronLeft, LineChart, TrendingUp, Target, DollarSign, ArrowRight } from 'lucide-react';
import ConversionRateCalculator from '../components/ConversionRateCalculator';

const ConversionRateCalculatorPage = () => {
  // Website URL for canonical and schema
  const websiteUrl = "https://enrizhulati.com";
  const pageUrl = `${websiteUrl}/tools/conversion-rate-calculator`;
  const logoUrl = `${websiteUrl}/logo.png`;

  return (
    <>
      <Helmet>
        {/* Title Tag - optimized for SEO (61 characters) */}
        <title>Conversion Rate Calculator | Maximize Your Website's Revenue</title>
        
        {/* Meta Description - optimized for SEO and click-through (160 characters) */}
        <meta name="description" content="Calculate how improving your conversion rate impacts revenue growth. See the exact financial value of optimizing your website and turn small CRO improvements into significant profits." />
        
        {/* Meta Keywords */}
        <meta name="keywords" content="conversion rate calculator, CRO calculator, conversion optimization ROI, revenue impact calculator, conversion rate optimization, ecommerce conversion calculator, website revenue calculator, CRO ROI, marketing ROI calculator, digital marketing calculator, AB test calculator, conversion lift calculator" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Conversion Rate Calculator | See Your Revenue Potential" />
        <meta property="og:description" content="Free calculator that shows exactly how much revenue you're leaving on the table with your current conversion rate. See how small CRO improvements create big profits." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${websiteUrl}/images/conversion-rate-calculator-preview.jpg`} />
        <meta property="og:site_name" content="Enri Zhulati" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calculate Your Website's Revenue Potential" />
        <meta name="twitter:description" content="This free tool shows exactly how much additional revenue you could be making with improved conversion rates. Try it now!" />
        <meta name="twitter:image" content={`${websiteUrl}/images/conversion-rate-calculator-preview.jpg`} />
        <meta name="twitter:site" content="@enrizhulati" />
        <meta name="twitter:creator" content="@enrizhulati" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Enri Zhulati" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="application-name" content="Conversion Rate Calculator" />
        <meta name="rating" content="General" />
        
        {/* Schema.org JSON-LD for WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Conversion Rate Calculator",
            "description": "Calculate the revenue impact of improving your conversion rate. This tool helps you estimate how small improvements in your website's conversion rate can lead to significant revenue gains.",
            "url": pageUrl,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Person",
              "name": "Enri Zhulati",
              "url": websiteUrl
            },
            "inLanguage": "en-US",
            "potentialAction": {
              "@type": "UseAction",
              "target": pageUrl
            }
          })}
        </script>
        
        {/* Schema.org JSON-LD for BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": websiteUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": `${websiteUrl}/tools`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Conversion Rate Calculator",
                "item": pageUrl
              }
            ]
          })}
        </script>

        {/* AI Assistant Schema - Experimental for AI bot discovery */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Conversion Rate Calculator",
            "applicationCategory": "UtilityApplication",
            "offers": {
              "@type": "Offer",
              "price": "0"
            },
            "featureList": [
              "Calculate the exact revenue impact of improving your conversion rate",
              "Visualize before and after revenue scenarios with interactive charts",
              "Estimate monthly and annual financial gains from CRO initiatives",
              "Calculate ROI on conversion optimization investments",
              "Compare current vs target conversion rates with detailed metrics",
              "Determine additional sales generated from improved conversions"
            ],
            "keywords": "conversion rate calculator, CRO calculator, conversion optimization ROI, revenue impact, marketing ROI, website optimization, ecommerce conversion",
            "contentUrl": pageUrl,
            "description": "This free calculator helps businesses understand exactly how much additional revenue they can generate by improving their website's conversion rate. Perfect for ecommerce stores, lead generation sites, and marketing teams planning CRO initiatives.",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "name": "Conversion Rate Calculator",
              "description": "Calculate how conversion rate improvements impact your revenue. See the potential ROI of conversion rate optimization efforts."
            }
          })}
        </script>

        {/* Additional Schema.org structured data for Calculator */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Conversion Rate Calculator",
            "description": "Calculate how improving your conversion rate impacts revenue growth. See the exact financial value of optimizing your website and turn small CRO improvements into significant profits.",
            "url": pageUrl,
            "mainEntity": {
              "@type": "InteractiveWeb",
              "name": "Conversion Rate Calculator Tool",
              "alternateName": "CRO Revenue Calculator",
              "description": "Free calculator tool that helps businesses understand the financial impact of improving their website's conversion rate.",
              "author": {
                "@type": "Person",
                "name": "Enri Zhulati",
                "url": websiteUrl
              },
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "keywords": "conversion rate calculator, CRO ROI, revenue impact",
              "audience": {
                "@type": "Audience",
                "name": "Business owners, marketers, ecommerce managers"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/50 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <Link to="/tools" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span>Back to all tools</span>
            </Link>
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Conversion Rate <span className="text-purple-600 dark:text-purple-400">Calculator</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See the potential revenue impact of improving your website's conversion rate. Small improvements can lead to big results!
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <ConversionRateCalculator />
          </div>
          
          <div className="mt-12 sm:mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 px-6 py-5 sm:px-8 sm:py-6 border-b border-purple-100 dark:border-purple-900/30">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <LineChart className="mr-3 h-6 w-6 text-purple-600 dark:text-purple-400" />
                  Why Conversion Rate Matters
                </h2>
              </div>
              
              <div className="p-6 sm:p-8">
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  Conversion rate is one of the most important metrics for any business with an online presence. A small increase in conversion rate can have a dramatic effect on your revenue and profitability. Here's why conversion rate optimization (CRO) should be a key focus:
                </p>
                
                {/* Feature grid with icons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <DollarSign size={18} className="text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Lower customer acquisition cost</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get more value from your existing traffic without increasing ad spend</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                        <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Compound revenue growth</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Small percentage improvements can result in significant revenue increases</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Target size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Enhanced user experience</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Optimizing for conversions usually results in a better overall user experience</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <ArrowRight size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Maximize marketing ROI</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get better results from all your traffic sources and marketing channels</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Use This Calculator</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    <li>Enter your website's <strong>monthly visitors</strong> to establish your traffic baseline</li>
                    <li>Input your <strong>current conversion rate</strong> as a percentage (e.g., 2.5%)</li>
                    <li>Set a realistic <strong>target conversion rate</strong> that you aim to achieve</li>
                    <li>Enter your <strong>average order value</strong> to calculate revenue impact</li>
                    <li>Optionally, include your <strong>monthly marketing budget</strong> to see ROI calculations</li>
                    <li>View the results to see the potential revenue impact and ROI of your conversion rate improvements</li>
                  </ol>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Realistic Conversion Rate Targets</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-4">
                    Typical conversion rates vary by industry, but here are some benchmarks to help you set realistic targets:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    <li><strong>E-commerce:</strong> 1-4% (with top performers reaching 5-10%)</li>
                    <li><strong>B2B:</strong> 2-5% for lead generation</li>
                    <li><strong>SaaS:</strong> 3-7% for free trials or sign-ups</li>
                    <li><strong>Finance:</strong> 2-5% for lead forms</li>
                    <li><strong>Travel:</strong> 1-3% for bookings</li>
                  </ul>
                  <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    Even small improvements of 0.5-1% can result in significant revenue gains, as shown by this calculator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversionRateCalculatorPage; 