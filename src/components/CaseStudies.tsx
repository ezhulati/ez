import { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const CaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      title: 'Texas Legislative Advisors',
      metric: '140% increase in leads',
      image: 'http://texaslegislativeadvisors.com/wp-content/uploads/2024/11/Capitol-Insights-Texas-Legislative-Consultants.jpeg',
      alt: 'Texas State Capitol Building',
      delay: 0.1
    },
    {
      id: 2,
      title: 'Visit Albania',
      metric: '215% more booking inquiries',
      image: 'https://albaniavisit.com/wp-content/uploads/2023/07/Dhermi-beach.jpeg',
      alt: 'Albanian coastline with beautiful beaches',
      delay: 0.2
    },
    {
      id: 3,
      title: 'Prospera Healthcare',
      metric: '3X patient enrollment',
      image: 'https://ehosyjg2p9u.exactdn.com/wp-content/uploads/2024/07/ABA-Therapy-Prospera-Healthcare_2-3.jpeg?strip=all&lossy=1&ssl=1',
      alt: 'Healthcare professional consulting with patient',
      delay: 0.3
    },
    {
      id: 4,
      title: 'LC Events',
      metric: '92% more event bookings',
      image: 'https://lindsaycummingsevents.com/wp-content/uploads/2024/04/Mike-Birthday-Party-223-scaled.jpeg',
      alt: 'Concert venue with stage and audience',
      delay: 0.4
    }
  ];

  return (
    <section id="success-stories" className="py-24 bg-gradient-to-b from-gray-900 to-gray-900/80 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Animated gradient lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute left-[40%] top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 inline-block mb-4">
            Results I've Delivered
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Here's how I've helped other businesses grow
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {caseStudies.map((study) => (
            <AnimatedSection
              key={study.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative"
              delay={study.delay}
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-1 text-white">{study.title}</h3>
                <p className="text-blue-400 text-sm font-medium">{study.metric}</p>
              </div>
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
                  <span className="text-white font-medium flex items-center">
                    See full case study
                    <ExternalLink size={14} className="ml-1" />
                  </span>
                </div>
                <img 
                  src={study.image} 
                  alt={study.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        {/* Client testimonial */}
        <AnimatedSection delay={0.5} className="mt-16 max-w-4xl mx-auto">
          <div className="relative p-8 rounded-xl bg-gradient-to-tr from-blue-900/50 to-indigo-900/50 border border-blue-700/30 shadow-inner">
            <div className="absolute -inset-px bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-xl blur"></div>
            <div className="relative">
              <svg className="h-10 w-10 text-blue-400 mb-4 opacity-80" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <blockquote className="text-xl text-gray-200 leading-relaxed mb-6">
                "Enri helped us fix our mess of a website and actually start getting leads from Google. He explained everything in plain English and delivered exactly what he promised. Worth every penny."
              </blockquote>
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-blue-400 font-bold">MT</span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">Maria Torres</p>
                  <p className="text-gray-400 text-sm">CEO, Prospera Healthcare</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CaseStudies;