import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronLeft, Zap, TrendingUp, ArrowDown, Search, Smile, AlertCircle, ArrowRight } from 'lucide-react';
import SpeedROICalculator from '../components/SpeedROICalculator';

const SpeedRoiCalculatorPage = () => {
  // Website URL for canonical and schema
  const websiteUrl = "https://enrizhulati.com";
  const pageUrl = `${websiteUrl}/tools/website-speed-impact-calculator`;
  const logoUrl = `${websiteUrl}/logo.png`;

  return (
    <>
      <Helmet>
        {/* Title Tag - 58 characters */}
        <title>Website Speed Calculator | See How Loading Time Affects Revenue</title>
        
        {/* Meta Description - 155-160 characters */}
        <meta name="description" content="Discover how much revenue you're losing from slow page speed. Calculate the financial impact of speed optimization with our free tool based on real conversion data." />
        
        {/* Meta Keywords */}
        <meta name="keywords" content="website speed calculator, page load time, speed impact calculator, conversion rate, site performance, speed optimization, revenue impact, ecommerce speed" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Website Speed Calculator - See Revenue Impact of Loading Times" />
        <meta property="og:description" content="Discover how much revenue you're losing from slow page speed. Calculate the financial impact of speed optimization with our free tool based on real conversion data." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${websiteUrl}/images/speed-roi-calculator-preview.jpg`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Website Speed Calculator" />
        <meta name="twitter:description" content="Discover how much revenue you're losing from slow page speed. Calculate the financial impact of speed optimization with our free tool." />
        <meta name="twitter:image" content={`${websiteUrl}/images/speed-roi-calculator-preview.jpg`} />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Enri Zhulati" />
        
        {/* Schema.org JSON-LD for Website */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Website Speed Impact Calculator",
            "description": "Discover how much revenue you're losing from slow page speed. Calculate the financial impact of speed optimization based on real industry conversion data.",
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
                "name": "Website Speed Impact Calculator",
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
            "name": "Website Speed Impact Calculator",
            "applicationCategory": "UtilityApplication",
            "offers": {
              "@type": "Offer",
              "price": "0"
            },
            "featureList": [
              "Calculate revenue impact of website speed",
              "Visualize conversion rate changes",
              "Estimate annual financial benefits of speed optimization",
              "Compare current vs target page load times"
            ],
            "keywords": "website speed, page load time, speed impact calculator, conversion rate, site performance, speed optimization, revenue impact",
            "contentUrl": pageUrl,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "name": "Website Speed Impact Calculator",
              "description": "Calculate how website speed impacts your revenue. See the potential ROI of improving page load time."
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
              Website Speed <span className="text-blue-600 dark:text-blue-400">ROI</span> Calculator
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See the potential revenue impact of improving your website's loading time. Faster websites convert better!
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            <SpeedROICalculator />
          </div>
          
          <div className="mt-12 sm:mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-5 sm:px-8 sm:py-6 border-b border-blue-100 dark:border-blue-900/30">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Zap className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Why Website Speed Matters
                </h2>
              </div>
              
              <div className="p-6 sm:p-8">
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  Website speed is a critical factor in user experience and conversion rates. Research consistently shows that faster websites lead to:
                </p>
                
                {/* Feature grid with icons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Higher conversion rates</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Users are more likely to complete purchases on fast-loading sites</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                        <ArrowDown size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Lower bounce rates</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Visitors stay longer when pages load quickly</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Search size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Better SEO rankings</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Google considers page speed as a ranking factor</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex">
                    <div className="mr-4 mt-1">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Smile size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Improved user satisfaction</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fast sites create positive brand experiences</p>
                    </div>
                  </div>
                </div>
                
                {/* Google Research Highlight */}
                <div className="mt-8 bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                        <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        According to research by Google, as page load time increases from 1 second to 3 seconds, the probability of bounce increases by <span className="text-red-600 dark:text-red-400 font-semibold">32%</span>. When load times reach 6 seconds, that probability jumps to <span className="text-red-600 dark:text-red-400 font-semibold">106%</span>.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* CTA Section */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <p className="text-gray-700 dark:text-gray-300 sm:mr-4 mb-4 sm:mb-0 font-medium">
                    Need help improving your website's speed?
                  </p>
                  <Link 
                    to="/#contact" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Get in touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeedRoiCalculatorPage; 