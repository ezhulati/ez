import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Globe, Users, TrendingUp, CheckCircle, Star, Award, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ResultsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResultsDrawer: React.FC<ResultsDrawerProps> = ({ isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useAppContext();

  // Close drawer on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl"
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Results I've Delivered
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Below are some examples of the results I've helped achieve. Every business is different, and results can vary based on your starting point, industry, and competitive landscape.
                </p>
                
                {/* Case Studies */}
                <div className="space-y-6">
                  <CaseStudy
                    title="ComparePower.com"
                    subtitle="Energy Comparison Platform"
                    domainUrl="https://comparepower.com"
                    image="https://i.postimg.cc/028tdgwV/All-Screwed-still-5-small-1920x1280.jpg"
                    stats={[
                      { label: "Monthly Visitors", value: "100,000+" },
                      { label: "Energy Marketplace", value: "#1" },
                      { label: "Keyword Rankings", value: "2,300+" }
                    ]}
                    description="Implemented a comprehensive SEO and content strategy that grew traffic from 20,000 to over 100,000 monthly visitors in 18 months. Focused on Texas energy market keywords and built content that answered common consumer questions."
                    icon={<Globe className="text-blue-500" />}
                  />
                  
                  <CaseStudy
                    title="AlbaniaVisit.com"
                    subtitle="My Personal Project"
                    domainUrl="https://albaniavisit.com"
                    image="https://albaniavisit.com/wp-content/uploads/2023/07/Dhermi-beach.jpeg"
                    stats={[
                      { label: "Booking Inquiries", value: "215% increase" },
                      { label: "Page Views", value: "120,000+" },
                      { label: "User Engagement", value: "4.2 min avg" }
                    ]}
                    description="Created my own tourism platform featuring SEO-optimized content about Albanian destinations. Developed and implemented a booking system that increased inquiries by 215% compared to the previous solution."
                    icon={<TrendingUp className="text-blue-500" />}
                  />
                  
                  <CaseStudy
                    title="ProsperaHealthcare.com"
                    subtitle="Healthcare Provider"
                    domainUrl="https://prosperahealthcare.com"
                    image="https://ehosyjg2p9u.exactdn.com/wp-content/uploads/2024/07/ABA-Therapy-Prospera-Healthcare_2-3.jpeg?strip=all&lossy=1&ssl=1"
                    stats={[
                      { label: "Organic Traffic", value: "2,000+ monthly visits" },
                      { label: "Lead Cost", value: "Reduced by 40%" },
                      { label: "Patient Enrollment", value: "3X increase" }
                    ]}
                    description="Rebuilt website with conversion-focused patient journeys. Created educational content targeting specific healthcare concerns. Implemented analytics to track patient acquisition costs which were reduced by 40%."
                    icon={<CheckCircle className="text-blue-500" />}
                  />
                  
                  <CaseStudy
                    title="Texas Legislative Advisors"
                    subtitle="Government Affairs Consulting"
                    domainUrl="http://texaslegislativeadvisors.com"
                    image="http://texaslegislativeadvisors.com/wp-content/uploads/2024/11/Capitol-Insights-Texas-Legislative-Consultants.jpeg"
                    stats={[
                      { label: "Lead Conversion", value: "140% increase" },
                      { label: "Site Authority", value: "DA from 0 to 14" },
                      { label: "Qualified Inquiries", value: "12 per month" }
                    ]}
                    description="Positioned the firm as an authority in Texas legislative affairs through strategic content development. Created a lead generation system that increased qualified prospect inquiries by 140%."
                    icon={<Award className="text-blue-500" />}
                  />
                </div>
                
                {/* Testimonials */}
                <div className="pt-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Star className="text-yellow-400 mr-2" size={20} />
                    <span>What Clients Say</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <Testimonial
                      quote="Enri helped us fix our mess of a website and actually start getting leads from Google. He explained everything in plain English and delivered exactly what he promised. Worth every penny."
                      author="Kyle"
                      company="Prospera Healthcare"
                    />
                    
                    <Testimonial
                      quote="We tried multiple marketing agencies that charged 3x what Enri does, and none of them delivered results like he has. His focus on actual outcomes rather than just activities was refreshing."
                      author="Byron"
                      company="Texas Legislative Advisors"
                    />
                    
                    <Testimonial
                      quote="Working with Enri felt like having a senior digital strategist on our team, but without the six-figure salary. His systems have generated a steady stream of leads that's transformed our business."
                      author="Lindsay"
                      company="LC Events"
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer with call-to-action */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/70 sticky bottom-0">
                <a
                  href="#contact"
                  className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-colors text-center font-medium flex items-center justify-center"
                  onClick={onClose}
                >
                  <span>Talk about your project</span>
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
              
              {/* Mobile-friendly close button - fixed at bottom */}
              <div className="block sm:hidden">
                <button
                  onClick={onClose}
                  className="fixed bottom-20 right-4 z-50 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg"
                  aria-label="Close drawer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface CaseStudyProps {
  title: string;
  subtitle: string;
  domainUrl: string;
  image: string;
  stats: { label: string; value: string }[];
  description: string;
  icon: React.ReactNode;
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, subtitle, domainUrl, image, stats, description, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50 shadow hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/75 to-transparent z-10 flex flex-col justify-end p-4">
          <div className="flex items-center space-x-3 text-white mb-2">
            <div className="bg-blue-600/40 p-2.5 rounded-lg backdrop-blur-sm shadow-inner flex-shrink-0">
              {icon}
            </div>
            <div>
              <a 
                href={domainUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-xl hover:text-blue-300 transition-colors flex items-center group"
              >
                {title}
                <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
              </a>
              <p className="text-blue-100/90 text-sm mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
        />
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">{stat.value}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
};

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, company }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 relative">
      <div className="absolute top-3 left-3 text-blue-300 dark:text-blue-700 text-4xl opacity-20">"</div>
      <p className="text-gray-700 dark:text-gray-300 italic relative z-10 text-sm leading-relaxed">
        {quote}
      </p>
      <div className="mt-3 flex items-center">
        <div className="bg-blue-200 dark:bg-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold text-sm mr-3">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white text-sm">{author}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{company}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDrawer;