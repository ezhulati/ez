import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Compass, Calculator, LineChart, ArrowRight } from 'lucide-react';

const Tools = () => {
  // Website URL for canonical and schema
  const websiteUrl = "https://enrizhulati.com";
  const pageUrl = `${websiteUrl}/tools`;

  return (
    <>
      <Helmet>
        {/* Title Tag - 61 characters */}
        <title>Marketing & SEO Tools | Calculators for Digital Success</title>
        
        {/* Meta Description - 160 characters */}
        <meta name="description" content="Boost your online performance with marketing calculators and SEO tools. Get instant insights on website speed, conversion rates, and revenue impact to make data-driven growth decisions." />
        
        {/* Meta Keywords */}
        <meta name="keywords" content="marketing calculators, SEO tools, website speed calculator, conversion rate calculator, marketing ROI calculator, website optimization tools, digital marketing tools, revenue impact calculator, CRO tools, website performance calculators" />
        
        {/* Canonical URL */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Marketing & SEO Tools | Calculators for Digital Growth" />
        <meta property="og:description" content="Access calculators that help you measure website speed impact, conversion rate potential, and marketing ROI. Make data-driven decisions with our suite of digital marketing tools." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${websiteUrl}/images/tools-collection-preview.jpg`} />
        <meta property="og:site_name" content="Enri Zhulati" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marketing & SEO Tools Collection" />
        <meta name="twitter:description" content="Access practical calculators to measure website speed impact, conversion optimization ROI, and marketing performance. Make smarter business decisions." />
        <meta name="twitter:image" content={`${websiteUrl}/images/tools-collection-preview.jpg`} />
        <meta name="twitter:site" content="@enrizhulati" />
        <meta name="twitter:creator" content="@enrizhulati" />
        
        {/* Additional SEO Tags */}
        <meta name="author" content="Enri Zhulati" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="application-name" content="Marketing Tools Suite" />
        <meta name="rating" content="General" />
        
        {/* Schema.org JSON-LD for CollectionPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Marketing & SEO Tools",
            "description": "A collection of marketing and SEO tools to help businesses improve their online performance and make data-driven decisions.",
            "url": pageUrl,
            "author": {
              "@type": "Person",
              "name": "Enri Zhulati",
              "url": websiteUrl
            },
            "inLanguage": "en-US",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Enri Zhulati",
              "url": websiteUrl
            },
            "hasPart": [
              {
                "@type": "SoftwareApplication",
                "name": "Website Speed Impact Calculator",
                "applicationCategory": "UtilityApplication",
                "url": `${websiteUrl}/tools/speed-roi-calculator`,
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Conversion Rate Calculator",
                "applicationCategory": "UtilityApplication",
                "url": `${websiteUrl}/tools/conversion-rate-calculator`,
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              }
            ]
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
                "item": pageUrl
              }
            ]
          })}
        </script>

        {/* AI Assistant Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "SoftwareApplication",
                  "name": "Website Speed Impact Calculator",
                  "description": "Calculate the potential revenue impact of improving your website's loading speed based on industry conversion rate data.",
                  "applicationCategory": "UtilityApplication",
                  "url": `${websiteUrl}/tools/speed-roi-calculator`,
                  "offers": {
                    "@type": "Offer",
                    "price": "0"
                  },
                  "keywords": "website speed, page load time, speed impact calculator, conversion rate"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "SoftwareApplication",
                  "name": "Conversion Rate Calculator",
                  "description": "Calculate the potential revenue impact of improving your conversion rate. See how small improvements can lead to significant gains.",
                  "applicationCategory": "UtilityApplication",
                  "url": `${websiteUrl}/tools/conversion-rate-calculator`,
                  "offers": {
                    "@type": "Offer",
                    "price": "0"
                  },
                  "keywords": "conversion rate, revenue impact, marketing ROI, CRO calculator"
                }
              }
            ],
            "mainEntityOfPage": {
              "@type": "WebPage",
              "name": "Marketing & SEO Tools",
              "description": "A collection of calculators and analyzers for digital marketing and website optimization."
            }
          })}
        </script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/50 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              <span className="text-blue-600 dark:text-blue-400">Pro</span> Marketing Tools
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Practical tools to help you make data-driven decisions, optimize your website performance, and boost your marketing ROI.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 md:mt-16 grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Website Speed ROI Calculator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
              <div className="p-4 sm:p-6 flex-grow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Website Speed ROI Calculator
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Calculate the potential revenue impact of improving your website's loading speed.
                </p>
              </div>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
                <Link 
                  to="/tools/speed-roi-calculator" 
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  <span>Try the calculator</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Conversion Rate Calculator - Updated from "coming soon" to active link */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
              <div className="p-4 sm:p-6 flex-grow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <LineChart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Conversion Rate Calculator
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Estimate your conversion rate improvements and revenue impact of optimization efforts.
                </p>
              </div>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
                <Link 
                  to="/tools/conversion-rate-calculator" 
                  className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
                >
                  <span>Try the calculator</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* More tools coming soon placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col opacity-50">
              <div className="p-4 sm:p-6 flex-grow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  More Tools Coming Soon
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  We're working on more tools to help optimize your marketing efforts.
                </p>
              </div>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
                <span className="inline-flex items-center text-gray-400 dark:text-gray-500 font-medium text-sm sm:text-base">
                  <span>Stay tuned</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tools; 