import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, TrendingUp, ArrowRight } from 'lucide-react';
import SEOROICalculator from '../components/SEOROICalculator';

const SEORoiCalculatorPage = () => {
  // Website URL for canonical and schema
  const websiteUrl = "https://enrizhulati.com";
  const pageUrl = `${websiteUrl}/tools/seo-roi-calculator`;
  const logoUrl = `${websiteUrl}/logo.png`;

  return (
    <>
      <Helmet>
        {/* Title Tag - optimized for search (55-65 characters) */}
        <title>SEO ROI Calculator | Measure Your Search Investment Returns</title>
        
        {/* Meta Description - 155-165 characters, keyword rich */}
        <meta name="description" content="Calculate your SEO investment returns with our data-driven ROI calculator. Forecast traffic growth, conversion improvements, and revenue potential based on industry-specific benchmarks." />
        
        {/* Meta Keywords - enhanced for search and AI discovery */}
        <meta name="keywords" content="seo roi calculator, seo investment returns, search optimization roi, keyword ranking calculator, organic traffic estimator, seo revenue forecasting, marketing roi tool, search engine optimization returns" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="SEO ROI Calculator | Measure Your Search Investment Returns" />
        <meta property="og:description" content="Calculate your SEO investment returns with our data-driven ROI calculator. Forecast traffic growth, conversion improvements, and revenue potential based on industry benchmarks." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${websiteUrl}/images/seo-roi-calculator-preview.jpg`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO ROI Calculator | Measure Your Search Investment Returns" />
        <meta name="twitter:description" content="Calculate your SEO investment returns with our data-driven ROI calculator. Forecast traffic growth and revenue potential for your business." />
        <meta name="twitter:image" content={`${websiteUrl}/images/seo-roi-calculator-preview.jpg`} />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Enri Zhulati" />
        
        {/* Schema.org JSON-LD for Website */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SEO ROI Calculator",
            "description": "Forecast the financial impact of your SEO investments with our data-driven calculator. See potential keyword improvements, traffic growth, and revenue impact over time.",
            "url": pageUrl,
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Enri Zhulati",
              "url": websiteUrl
            },
            "publisher": {
              "@type": "Person",
              "name": "Enri Zhulati",
              "logo": {
                "@type": "ImageObject",
                "url": logoUrl
              }
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
                "name": "SEO ROI Calculator",
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/50 pt-16 sm:pt-18 md:pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10">
            <Link 
              to="/tools" 
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Tools
            </Link>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              SEO <span className="text-green-600 dark:text-green-400">ROI</span> Calculator
            </h1>
            
            <p className="mt-3 sm:mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
              Forecast the return on your SEO investment. Calculate how improved rankings can impact your traffic, conversions, and revenue over time.
            </p>
          </div>
          
          <div className="mb-8 sm:mb-10 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <Search className="h-6 w-6 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">How This Calculator Works</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  This calculator uses industry data to estimate how SEO investments improve keyword rankings over time. It factors in:
                </p>
                <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300 list-disc list-inside">
                  <li>Industry-specific improvement rates</li>
                  <li>Click-through rates by position</li>
                  <li>Conversion rate optimization effects</li>
                  <li>Compounding benefits over time</li>
                </ul>
              </div>
            </div>
          </div>
          
          <SEOROICalculator />
          
          <div className="mt-10 sm:mt-12 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="mr-3 h-6 w-6 text-green-600 dark:text-green-400" />
                Understanding SEO ROI
              </h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Search Engine Optimization (SEO) is a long-term investment that continues to deliver returns over time. Unlike paid advertising that stops generating leads when you stop paying, SEO creates a sustainable foundation for organic growth.
                </p>
                
                <p>
                  When calculating SEO ROI, it's important to consider these factors:
                </p>
                
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Time Horizon:</strong> SEO typically takes 3-6 months to show initial results, with significant returns appearing after 6-12 months.</li>
                  <li><strong>Compounding Effects:</strong> As your authority grows, each new piece of content benefits from your existing reputation.</li>
                  <li><strong>Keyword Research:</strong> Targeting the right keywords with appropriate difficulty and search volume is crucial for success.</li>
                  <li><strong>Conversion Rate:</strong> Your site's ability to convert visitors affects the ultimate ROI of your SEO efforts.</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="mr-3 h-6 w-6 text-green-600 dark:text-green-400" />
                Maximize Your SEO Results
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strategic Advice</h3>
                  
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs mr-2 mt-0.5">1</span>
                      <span><strong>Balance your keyword portfolio</strong> with a mix of short-term wins (lower difficulty) and long-term value (higher volume).</span>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs mr-2 mt-0.5">2</span>
                      <span><strong>Optimize your conversion paths</strong> to maximize the value of organic traffic you're already receiving.</span>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs mr-2 mt-0.5">3</span>
                      <span><strong>Reinvest in content refreshes</strong> to maintain ranking positions and keep content relevant.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Need Expert Guidance?</h3>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    While this calculator provides estimates, every business is unique. For a personalized SEO strategy tailored to your specific goals and market:
                  </p>
                  
                  <a 
                    href="/contact" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <span>Schedule a free consultation</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEORoiCalculatorPage; 