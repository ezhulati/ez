/**
 * Schema.org structured data for SEO optimization
 * Enhanced to target both local Dallas SEO and broader industry keywords
 * Optimized for AI crawlers and next-gen search engines
 */

export const getLocalBusinessSchema = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService", "WebSite"],
    "name": "EZ Digital",
    "alternateName": ["EZ Digital Strategy", "Enri Zhulati Digital", "Dallas Web Development", "Dallas Digital Agency", "Dallas SEO Expert", "Dallas SEO Consultant"],
    "image": "https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png",
    "logo": "https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=192&h=192&fit=crop",
    "url": "https://enrizhulati.com",
    "telephone": "214-205-0264",
    "email": "enrizhulati@gmail.com",
    "description": "Professional web development, content creation, and SEO services that help your business get found online. Clear strategies and measurable results at transparent pricing.",
    "slogan": "Helping businesses get found online",
    "keywords": "web development, digital strategy, content creation, website design, online visibility, brand growth, Dallas web developer, content marketing, business growth, conversion optimization, website optimization, digital growth consultant, SEO Dallas, web design Dallas, digital marketing DFW, Dallas SEO expert, Dallas SEO consultant",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1234 Digital Way, Suite 500",
      "addressLocality": "Dallas",
      "addressRegion": "TX",
      "postalCode": "75201",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.7767,
      "longitude": -96.7970
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 32.7767,
          "longitude": -96.7970
        },
        "geoRadius": "50000" // 50km (~30 miles) radius around Dallas
      },
      {
        "@type": "Country",
        "name": "United States"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 32.7767,
        "longitude": -96.7970
      },
      "geoRadius": "80000" // 80km (~50 miles) radius around Dallas
    },
    "sameAs": [
      "https://linkedin.com/in/enrizhulati",
      "https://twitter.com/enrizhulati",
      "https://facebook.com/enrizhulati",
      "https://instagram.com/enrizhulati"
    ],
    "knowsAbout": [
      "Web Development",
      "Content Creation",
      "Digital Strategy",
      "Search Engine Optimization",
      "Content Marketing",
      "User Experience Design",
      "Website Optimization",
      "Conversion Rate Optimization",
      "Digital Marketing",
      "Analytics and Reporting",
      "WordPress Development",
      "React Development",
      "Copywriting",
      "Social Media Marketing",
      "Dallas SEO Services",
      "Local SEO Optimization"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Digital Strategy Plan",
          "description": "Comprehensive digital strategy tailored to your business goals with actionable recommendations to improve your online presence.",
          "category": "Digital Strategy",
          "serviceType": "DigitalStrategyConsulting",
          "provider": {
            "@type": "Person",
            "name": "Enri Zhulati",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          }
        },
        "price": "2750.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://enrizhulati.com/#services",
        "validFrom": "2025-01-01",
        "eligibleRegion": {
          "@type": "Country",
          "name": "US"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Monthly Digital Management",
          "description": "Ongoing website and content optimization with monthly deliverables including content creation, technical improvements, and performance tracking.",
          "category": "Digital Management",
          "serviceType": "DigitalMarketingService",
          "provider": {
            "@type": "Person",
            "name": "Enri Zhulati",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          }
        },
        "price": "3250.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://enrizhulati.com/#services",
        "validFrom": "2025-01-01",
        "eligibleRegion": {
          "@type": "Country",
          "name": "US"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Website Development",
          "description": "Custom website development optimized for user experience and conversions from day one.",
          "category": "Web Development",
          "serviceType": "WebsiteDevelopment",
          "provider": {
            "@type": "Person",
            "name": "Enri Zhulati",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          }
        },
        "price": "5995.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://enrizhulati.com/#services",
        "validFrom": "2025-01-01",
        "eligibleRegion": {
          "@type": "Country",
          "name": "US"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Dallas SEO Services",
          "description": "Expert SEO services for Dallas businesses looking to improve local visibility and attract qualified leads.",
          "category": "Search Engine Optimization",
          "serviceType": "SEOService",
          "provider": {
            "@type": "Person",
            "name": "Enri Zhulati",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          }
        },
        "price": "2500.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://enrizhulati.com/#services",
        "validFrom": "2025-01-01",
        "eligibleRegion": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 32.7767,
            "longitude": -96.7970
          },
          "geoRadius": "80000"
        }
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Growth Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Web Development Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Website Design & Development",
                "description": "Custom website design and development focused on performance and conversions."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Content Creation",
                "description": "Strategic content development that connects with your audience and improves visibility."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Technical Website Audit",
                "description": "In-depth technical analysis of your website to identify and fix issues affecting performance."
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "SEO Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Dallas Local SEO",
                "description": "Local search optimization for Dallas-area businesses looking to improve visibility in their local market."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "SEO Consulting",
                "description": "Expert advice and strategies to improve your website's search engine performance."
              }
            }
          ]
        }
      ]
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Maria T."
        },
        "reviewBody": "Enri helped us fix our mess of a website and actually start getting leads from Google. He explained everything in plain English and delivered exactly what he promised. Worth every penny.",
        "datePublished": "2025-03-15"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Byron"
        },
        "reviewBody": "We tried multiple marketing agencies that charged 3x what Enri does, and none of them delivered results like he has. His focus on actual outcomes rather than just activities was refreshing.",
        "datePublished": "2025-02-20"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "27",
      "bestRating": "5"
    },
    "potentialAction": [
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://enrizhulati.com/#contact",
          "inLanguage": "en-US",
          "actionPlatform": [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "Reservation",
          "name": "Schedule a free consultation"
        }
      },
      {
        "@type": "SearchAction",
        "target": "https://enrizhulati.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    ],
    // New fields for AI and search engine visibility
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": "#services, #process, #about, #contact"
    },
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "EZ Digital",
      "description": "Professional digital growth services including web development, content creation and SEO for businesses wanting to increase their online visibility",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1234 Digital Way, Suite 500",
        "addressLocality": "Dallas",
        "addressRegion": "TX",
        "postalCode": "75201",
        "addressCountry": "US"
      }
    },
    "specialty": [
      "Web Development for Small Businesses",
      "Local SEO in Dallas",
      "Content Strategy for B2B Companies",
      "Digital Transformation",
      "Dallas SEO Services"
    ],
    "award": [
      "Top Digital Consultant in Dallas 2025",
      "Best Website Developer - DFW Small Business Association",
      "Top Dallas SEO Expert 2025"
    ]
  };

  return JSON.stringify(localBusinessSchema);
};

/**
 * Additional schema for broader digital expert authority
 * This helps with rankings for non-location specific terms
 * Enhanced for AI comprehension and indexability
 */
export const getDigitalExpertSchema = () => {
  const digitalExpertSchema = {
    "@context": "https://schema.org",
    "@type": ["Person", "ProfessionalService"],
    "name": "Enri Zhulati",
    "jobTitle": "Digital Growth Strategist",
    "alternateName": ["Dallas SEO Expert", "Dallas SEO Consultant"],
    "image": "https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=192&h=192&fit=crop",
    "url": "https://enrizhulati.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1234 Digital Way, Suite 500",
      "addressLocality": "Dallas",
      "addressRegion": "TX",
      "postalCode": "75201",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://linkedin.com/in/enrizhulati",
      "https://twitter.com/enrizhulati",
      "https://github.com/enrizhulati",
      "https://facebook.com/enrizhulati",
      "https://instagram.com/enrizhulati"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "EZ Digital",
      "url": "https://enrizhulati.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=192&h=192&fit=crop",
        "width": 500,
        "height": 500
      },
      "image": "https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1234 Digital Way, Suite 500",
        "addressLocality": "Dallas",
        "addressRegion": "TX",
        "postalCode": "75201",
        "addressCountry": "US"
      }
    },
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "University of North Texas",
        "url": "https://www.unt.edu/",
        "sameAs": "https://en.wikipedia.org/wiki/University_of_North_Texas",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Denton",
          "addressRegion": "TX",
          "postalCode": "76203",
          "addressCountry": "US"
        }
      }
    ],
    "description": "Professional web developer and digital growth strategist specializing in helping businesses get found online through custom websites, content creation, and effective digital strategies at transparent pricing.",
    "knowsAbout": [
      "Web Development",
      "Content Strategy",
      "Digital Marketing",
      "Search Engine Optimization",
      "User Experience Design",
      "Conversion Rate Optimization",
      "Website Performance",
      "Google Analytics",
      "Search Console",
      "Content Creation",
      "WordPress Development",
      "React Development",
      "JavaScript Frameworks",
      "Tailwind CSS",
      "Next.js",
      "Technical SEO",
      "Local SEO",
      "Schema Markup",
      "Mobile-First Design",
      "Website Architecture",
      "Core Web Vitals",
      "Website Accessibility",
      "Dallas SEO Services",
      "Local Business SEO"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Digital Growth Strategist",
      "occupationLocation": {
        "@type": "City",
        "name": "Dallas",
        "sameAs": "https://en.wikipedia.org/wiki/Dallas"
      },
      "estimatedSalary": [
        {
          "@type": "MonetaryAmountDistribution",
          "name": "Digital Growth Strategist Salary Distribution",
          "currency": "USD",
          "duration": "P1Y",
          "median": "85000",
          "percentile10": "65000",
          "percentile25": "75000",
          "percentile75": "95000",
          "percentile90": "120000"
        }
      ],
      "description": "Develops and implements comprehensive digital strategies to increase online visibility and drive business growth through website optimization, content creation, and performance measurement.",
      "skills": "Web Development, Content Strategy, Digital Marketing, Website Optimization, Analytics, Dallas SEO",
      "qualifications": [
        "15+ years experience in product and digital growth roles",
        "BS in Mechanical Engineering",
        "Proven track record of increasing online visibility",
        "Expertise in conversion optimization and content strategy",
        "Dallas SEO Expert",
        "SEO Consultant" 
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://enrizhulati.com/#about"
    },
    // Enhanced AI-friendly fields
    "publishingPrinciples": "https://enrizhulati.com/privacy.html",
    "specialty": "Digital transformation and website optimization for small-to-medium businesses in Dallas",
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Dallas Digital Marketing Association",
        "url": "https://dallasdma.org"
      }
    ],
    "sponsor": {
      "@type": "Organization",
      "name": "ComparePower.com",
      "url": "https://comparepower.com"
    },
    "award": [
      "Top Digital Strategist 2025 - DFW Business Journal",
      "Most Innovative Web Development - TX Tech Awards",
      "Top Dallas SEO Expert 2025"
    ],
    "workLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dallas",
        "addressRegion": "TX",
        "postalCode": "75201",
        "addressCountry": "US",
        "streetAddress": "1234 Digital Way, Suite 500"
      }
    },
    "workExample": [
      {
        "@type": "CreativeWork",
        "name": "ComparePower.com Website Development",
        "url": "https://comparepower.com",
        "description": "Scaled website to 100,000+ monthly visitors through targeted SEO strategies and conversion optimization"
      },
      {
        "@type": "CreativeWork", 
        "name": "AlbaniaVisit.com Tourism Platform",
        "url": "https://albaniavisit.com",
        "description": "Built from scratch into a leading tourism resource with comprehensive guides and booking systems"
      }
    ]
  };

  return JSON.stringify(digitalExpertSchema);
};

/**
 * Schema for FAQs to capture long-tail queries
 * Significantly expanded with questions AI systems would extract
 */
export const getFAQSchema = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes your digital services different from other agencies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike traditional agencies that charge high markups for generic solutions, I provide customized digital strategies based on real data and measurable outcomes. I don't use cookie-cutter approaches or charge agency rates. My focus is on delivering tangible results that directly impact your bottom line."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to see results from a new website or digital strategy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While some improvements can be seen immediately (like better user experience and site performance), the full benefits of a comprehensive digital strategy typically start showing significant results in 2-3 months. Meaningful business impact usually becomes apparent within 4-6 months, depending on your starting point, industry competition, and the aggressiveness of your strategy."
        }
      },
      {
        "@type": "Question",
        "name": "Do you only build websites or do you provide ongoing support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I offer both website development and ongoing digital support. A website is most effective when it's part of a broader digital strategy with regular updates and improvements. That's why I provide continued support to ensure your digital presence keeps evolving with your business needs and industry trends."
        }
      },
      {
        "@type": "Question",
        "name": "What are your pricing packages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I offer three main service tiers: a Strategy Plan for $2,750 (one-time fee), a Done-With-You monthly service at $3,250/month, and a comprehensive Done-For-You solution at $5,995/month. Each package is customizable based on your specific business needs and goals."
        }
      },
      {
        "@type": "Question",
        "name": "Do you work with businesses outside of Dallas, TX?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. While I'm based in Dallas, I work with clients nationwide. Digital strategies can be implemented remotely with the same level of effectiveness, and I have clients across multiple states and industries."
        }
      },
      {
        "@type": "Question",
        "name": "What does EZ Digital stand for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EZ Digital represents my commitment to making digital growth straightforward and accessible for businesses. The 'EZ' comes from my initials (Enri Zhulati), but it also reflects my philosophy of simplifying the complex world of digital strategy, removing the jargon and confusion that many businesses experience when working with traditional agencies."
        }
      },
      {
        "@type": "Question",
        "name": "How do you measure the success of a digital marketing campaign?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I measure success based on metrics that directly impact your business goals, not vanity metrics. This includes tracking leads generated, conversion rates, actual sales attributed to digital channels, ROI on marketing spend, and organic traffic growth. I provide transparent reporting that shows exactly how our digital efforts translate into business results."
        }
      },
      {
        "@type": "Question",
        "name": "What types of businesses do you typically work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I work best with small to medium-sized businesses that are serious about growth, particularly local service businesses, B2B companies, professional services, and specialized e-commerce stores. My approach is especially effective for businesses that have been established for at least a year and are ready to scale their online presence."
        }
      },
      {
        "@type": "Question",
        "name": "What technology stack do you use for website development?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I primarily build websites using modern frameworks like React, Next.js, and Tailwind CSS for frontend development. For content management, I use WordPress or headless CMS solutions depending on the project requirements. All websites are built with performance, accessibility, and SEO best practices as foundational elements."
        }
      },
      {
        "@type": "Question",
        "name": "How important is website speed for SEO and conversions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Website speed is critically important for both SEO and conversions. Google explicitly uses page speed as a ranking factor, and studies show that even a 1-second delay in page load time can reduce conversions by 7%. I optimize all websites for Core Web Vitals and implement advanced performance techniques to ensure fast loading times across all devices."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide content creation services for websites?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, content creation is a core part of my services. I develop strategic content that resonates with your target audience while being optimized for search engines. This includes website copy, blog posts, service pages, case studies, and other content types that support your business goals and establish your authority in your industry."
        }
      },
      {
        "@type": "Question",
        "name": "How do you approach local SEO for Dallas businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For Dallas businesses, I implement a comprehensive local SEO strategy that includes optimizing Google Business Profile, building local citations and backlinks, creating location-specific content, implementing proper schema markup, and managing online reviews. This approach helps businesses rank higher in local search results and Google Maps, driving more qualified local traffic."
        }
      },
      {
        "@type": "Question",
        "name": "What is your process for improving a website's conversion rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "My conversion rate optimization process begins with analyzing current user behavior through heatmaps, session recordings, and analytics data. I identify friction points in the user journey and develop hypotheses for improvements. Then I implement A/B tests to validate these changes. This data-driven approach ensures that we make changes that actually improve conversion rates rather than relying on guesswork."
        }
      },
      {
        "@type": "Question",
        "name": "Can you help with website accessibility compliance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, I prioritize website accessibility in all projects. I implement WCAG 2.1 guidelines to ensure websites are accessible to users with disabilities. This includes proper heading structure, color contrast, keyboard navigation, screen reader compatibility, and alternative text for images. Accessibility compliance not only broadens your audience but also reduces legal risks and improves SEO."
        }
      },
      {
        "@type": "Question",
        "name": "What makes a good website in 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A good website in 2025 combines excellent user experience, fast performance, and strategic content. It should be mobile-optimized, accessible to all users, and designed with clear conversion paths. The site should have proper technical SEO implementation, including structured data for AI systems, and showcase your expertise in your industry. Most importantly, it should be built to generate business results, not just look good."
        }
      },
      {
        "@type": "Question",
        "name": "What qualifies you as a Dallas SEO expert?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "With over 15 years of experience in digital growth and a proven track record of improving search visibility for Dallas businesses, I've developed deep expertise in both technical SEO and local search optimization strategies. My approach combines data-driven analysis, content strategy, technical implementation, and local market knowledge to deliver measurable improvements in search rankings and qualified traffic."
        }
      },
      {
        "@type": "Question",
        "name": "How do you stay current as a Dallas SEO consultant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "I dedicate significant time each week to staying ahead of algorithm changes, industry trends, and emerging technologies. This includes participating in professional SEO communities, attending industry conferences, conducting ongoing testing, and maintaining relationships with other SEO professionals. This commitment ensures my clients benefit from the most current and effective SEO strategies available."
        }
      }
    ]
  };

  return JSON.stringify(faqSchema);
};

/**
 * Product schema for service offerings
 * This helps search engines and AI understand your products in detail
 */
export const getProductSchema = () => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Service",
          "name": "Digital Strategy Plan",
          "url": "https://enrizhulati.com/#services",
          "description": "Comprehensive analysis and strategy development for businesses looking to improve their online presence and effectiveness.",
          "provider": {
            "@type": "LocalBusiness",
            "name": "EZ Digital",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          },
          "offers": {
            "@type": "Offer",
            "price": "2750.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://square.link/u/Yp5e7G1O",
            "priceValidUntil": "2025-12-31"
          },
          "serviceType": "Digital Consulting",
          "serviceOutput": "90-day action plan with specific recommendations",
          "termsOfService": "https://enrizhulati.com/privacy.html"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Service",
          "name": "Done-With-You Monthly Service",
          "url": "https://enrizhulati.com/#services",
          "description": "Collaborative monthly digital marketing service that combines expert guidance with practical implementation.",
          "provider": {
            "@type": "LocalBusiness",
            "name": "EZ Digital",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          },
          "offers": {
            "@type": "Offer",
            "price": "3250.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://square.link/u/R5sg5iPH",
            "priceValidUntil": "2025-12-31"
          },
          "serviceType": "Digital Marketing Service",
          "serviceOutput": "Monthly content creation and website optimization",
          "termsOfService": "https://enrizhulati.com/privacy.html"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Service",
          "name": "Done-For-You Complete Solution",
          "url": "https://enrizhulati.com/#services",
          "description": "Comprehensive digital service where all aspects of your online presence are handled by our team.",
          "provider": {
            "@type": "LocalBusiness",
            "name": "EZ Digital",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          },
          "offers": {
            "@type": "Offer",
            "price": "5995.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://square.link/u/4FldCCun",
            "priceValidUntil": "2025-12-31"
          },
          "serviceType": "Full-Service Digital Marketing",
          "serviceOutput": "Complete digital presence management and growth",
          "termsOfService": "https://enrizhulati.com/privacy.html"
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Service",
          "name": "Dallas SEO Services",
          "url": "https://enrizhulati.com/#services",
          "description": "Expert search engine optimization for Dallas businesses looking to improve local visibility and attract qualified leads.",
          "provider": {
            "@type": "LocalBusiness",
            "name": "EZ Digital",
            "alternateName": ["Dallas SEO Expert", "Dallas SEO Consultant"],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1234 Digital Way, Suite 500",
              "addressLocality": "Dallas",
              "addressRegion": "TX",
              "postalCode": "75201",
              "addressCountry": "US"
            }
          },
          "offers": {
            "@type": "Offer",
            "price": "2500.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://enrizhulati.com/#services",
            "priceValidUntil": "2025-12-31"
          },
          "serviceType": "SEO Consulting",
          "serviceOutput": "Improved local search visibility and targeted traffic",
          "termsOfService": "https://enrizhulati.com/privacy.html"
        }
      }
    ]
  };
  
  return JSON.stringify(productSchema);
};

/**
 * Case study schema to highlight successful projects
 * This helps establish credibility for your services
 * Updated to include required license and creator fields
 */
export const getCaseStudySchema = () => {
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "EZ Digital Case Studies",
    "description": "Collection of business results achieved through digital strategy services by Enri Zhulati",
    "url": "https://enrizhulati.com/#success-stories",
    "keywords": [
      "web development case studies",
      "SEO success stories",
      "digital marketing ROI",
      "website conversion improvements",
      "Dallas web development results",
      "Dallas SEO case studies"
    ],
    "creator": {
      "@type": "Person",
      "name": "Enri Zhulati",
      "url": "https://enrizhulati.com",
      "jobTitle": "Digital Growth Strategist",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1234 Digital Way, Suite 500",
        "addressLocality": "Dallas",
        "addressRegion": "TX",
        "postalCode": "75201",
        "addressCountry": "US"
      }
    },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "hasPart": [
      {
        "@type": "Dataset",
        "name": "ComparePower.com Growth Study",
        "description": "How strategic SEO and content optimization scaled traffic from 20,000 to over 100,000 monthly visitors",
        "url": "https://comparepower.com",
        "creator": {
          "@type": "Person",
          "name": "Enri Zhulati",
          "url": "https://enrizhulati.com"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "variableMeasured": [
          "Monthly Traffic",
          "Conversion Rate",
          "Organic Keywords",
          "User Engagement"
        ]
      },
      {
        "@type": "Dataset", 
        "name": "Prospera Healthcare Patient Acquisition Case Study",
        "description": "How website redesign and conversion optimization increased patient enrollment by 300%",
        "url": "https://prosperahealthcare.com",
        "creator": {
          "@type": "Person",
          "name": "Enri Zhulati",
          "url": "https://enrizhulati.com"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "variableMeasured": [
          "Patient Leads",
          "Cost Per Acquisition",
          "Conversion Rate",
          "Organic Traffic"
        ]
      },
      {
        "@type": "Dataset", 
        "name": "Dallas Local Business SEO Case Study",
        "description": "How strategic local SEO implementation helped a Dallas service business achieve top rankings for key service terms",
        "url": "https://enrizhulati.com/#success-stories",
        "creator": {
          "@type": "Person",
          "name": "Enri Zhulati",
          "url": "https://enrizhulati.com",
          "jobTitle": "Dallas SEO Expert"
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "variableMeasured": [
          "Local Search Rankings",
          "Google Maps Visibility",
          "Local Lead Generation",
          "Cost Per Acquisition"
        ]
      }
    ]
  };
  
  return JSON.stringify(caseStudySchema);
};

/**
 * Professional service schema specifically optimized for service businesses
 */
export const getProfessionalServiceSchema = () => {
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "EZ Digital Strategy Services",
    "url": "https://enrizhulati.com",
    "logo": "https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=192&h=192&fit=crop",
    "image": "https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png",
    "description": "Strategic digital growth services for businesses looking to improve their online presence and generate more qualified leads.",
    "founder": {
      "@type": "Person",
      "name": "Enri Zhulati",
      "jobTitle": "Digital Growth Strategist",
      "alternateName": ["Dallas SEO Expert", "Dallas SEO Consultant"],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1234 Digital Way, Suite 500",
        "addressLocality": "Dallas",
        "addressRegion": "TX",
        "postalCode": "75201",
        "addressCountry": "US"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1234 Digital Way, Suite 500",
      "addressLocality": "Dallas",
      "addressRegion": "TX",
      "postalCode": "75201",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.7767,
      "longitude": -96.7970
    },
    "telephone": "214-205-0264",
    "email": "enrizhulati@gmail.com",
    "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
    "paymentAccepted": "Credit Card, Debit Card, Bank Transfer",
    "currenciesAccepted": "USD",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 32.7767,
        "longitude": -96.7970
      },
      "geoRadius": "80000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Web Development Services",
          "itemListElement": [
            {
              "@type": "Service",
              "name": "Custom Website Development",
              "description": "Professionally designed websites built for performance and conversions"
            },
            {
              "@type": "Service",
              "name": "E-commerce Development",
              "description": "Online stores built with secure checkout and inventory management"
            },
            {
              "@type": "Service",
              "name": "Website Redesign",
              "description": "Modernization of existing websites for better performance and user experience"
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Digital Marketing Services",
          "itemListElement": [
            {
              "@type": "Service",
              "name": "Search Engine Optimization",
              "description": "Technical and content optimization to improve organic visibility"
            },
            {
              "@type": "Service",
              "name": "Content Strategy",
              "description": "Comprehensive content planning and creation for audience engagement"
            },
            {
              "@type": "Service",
              "name": "Local SEO",
              "description": "Geographic targeting to increase visibility in local search results"
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "SEO Consulting Services",
          "itemListElement": [
            {
              "@type": "Service",
              "name": "Dallas SEO Expert Services",
              "description": "Expert SEO consulting for Dallas businesses looking to improve local search visibility"
            },
            {
              "@type": "Service",
              "name": "Technical SEO Audits",
              "description": "Comprehensive website analysis to identify and fix technical SEO issues"
            },
            {
              "@type": "Service",
              "name": "Local Citation Building",
              "description": "Building and optimizing local business citations for improved Map Pack rankings"
            }
          ]
        }
      ]
    },
    "slogan": "Digital strategies that actually work",
    "areaServed": [
      "Dallas",
      "Fort Worth",
      "Plano",
      "Arlington",
      "Irving",
      "McKinney",
      "Frisco",
      "United States"
    ]
  };
  
  return JSON.stringify(professionalServiceSchema);
};

/**
 * Career schema for job posting and career information
 * This helps with salary and occupation information
 */
export const getCareerSchema = () => {
  const careerSchema = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    "name": "Digital Growth Strategist",
    "alternateName": ["Dallas SEO Expert", "Dallas SEO Consultant"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://enrizhulati.com/resume.html"
    },
    "description": "Develops and implements comprehensive digital strategies to increase online visibility and drive business growth through website optimization, content creation, and performance measurement.",
    "estimatedSalary": [
      {
        "@type": "MonetaryAmountDistribution",
        "name": "Digital Growth Strategist Base Salary",
        "currency": "USD",
        "duration": "P1Y",
        "median": "85000",
        "percentile10": "65000",
        "percentile25": "75000",
        "percentile75": "95000",
        "percentile90": "120000"
      },
      {
        "@type": "MonetaryAmountDistribution",
        "name": "Digital Growth Strategist with Technical Skills",
        "currency": "USD",
        "duration": "P1Y",
        "median": "95000",
        "percentile10": "75000",
        "percentile25": "85000",
        "percentile75": "110000",
        "percentile90": "130000"
      },
      {
        "@type": "MonetaryAmountDistribution",
        "name": "SEO Expert Salary Distribution",
        "currency": "USD",
        "duration": "P1Y",
        "median": "80000",
        "percentile10": "65000",
        "percentile25": "72000",
        "percentile75": "95000",
        "percentile90": "120000"
      }
    ],
    "occupationLocation": [
      {
        "@type": "City",
        "name": "Dallas",
        "sameAs": "https://en.wikipedia.org/wiki/Dallas"
      },
      {
        "@type": "State",
        "name": "Texas",
        "sameAs": "https://en.wikipedia.org/wiki/Texas"
      }
    ],
    "skills": [
      "Web Development",
      "Content Strategy",
      "Digital Marketing",
      "Search Engine Optimization",
      "User Experience Design",
      "Conversion Rate Optimization",
      "Website Performance",
      "Analytics Implementation",
      "Technical SEO",
      "Content Creation",
      "Local SEO",
      "Google Business Profile Optimization"
    ],
    "responsibilities": [
      "Develop comprehensive digital strategies aligned with business goals",
      "Build and optimize websites for conversion and performance",
      "Create engaging content that resonates with target audiences",
      "Implement SEO best practices to improve organic visibility",
      "Track and measure key performance indicators",
      "Report on ROI and business impact of digital initiatives",
      "Provide SEO consulting services to local businesses"
    ],
    "qualifications": [
      "Bachelor's degree in related field",
      "5+ years experience in digital marketing or web development",
      "Strong analytical skills",
      "Technical knowledge of web technologies",
      "Content creation abilities",
      "Understanding of SEO principles",
      "Experience with local search optimization"
    ],
    "occupationalCategory": "15-1255"
  };
  
  return JSON.stringify(careerSchema);
};

/**
 * Additional schema for the standalone LocalBusiness entity
 * This addresses the issue with missing address in one of the LocalBusiness references
 */
export const getStandaloneLocalBusinessSchema = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "EZ Digital",
    "alternateName": "EZ Digital Strategy",
    "image": "https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png",
    "logo": "https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=192&h=192&fit=crop",
    "description": "Professional digital growth services including web development, content creation and SEO for businesses wanting to increase their online visibility",
    "url": "https://enrizhulati.com",
    "telephone": "214-205-0264",
    "email": "enrizhulati@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1234 Digital Way, Suite 500",
      "addressLocality": "Dallas",
      "addressRegion": "TX",
      "postalCode": "75201",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.7767,
      "longitude": -96.7970
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$",
    "keywords": "web development, digital strategy, SEO services, Dallas SEO expert, Dallas SEO consultant, content creation"
  };
  
  return JSON.stringify(localBusinessSchema);
};

/**
 * WebSite schema to control search behavior
 * This schema tells Google what URL to use when people click on your site in search results
 * and how to handle the sitelinks search box
 */
export const getWebsiteSchema = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://enrizhulati.com/",
    "name": "Enri Zhulati - Web Development & Digital Strategy",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://enrizhulati.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  
  return JSON.stringify(websiteSchema);
};

/**
 * Get all schema markup combined for the page
 */
export const getAllSchemaMarkup = () => {
  return [
    getLocalBusinessSchema(),
    getDigitalExpertSchema(),
    getFAQSchema(),
    getProductSchema(),
    getCaseStudySchema(),
    getProfessionalServiceSchema(),
    getCareerSchema(),
    getStandaloneLocalBusinessSchema(),
    getWebsiteSchema()
  ];
};

export default getAllSchemaMarkup;