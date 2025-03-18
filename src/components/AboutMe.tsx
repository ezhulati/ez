import { CheckCircle, ExternalLink, Award, TrendingUp, Code, Globe, ArrowRight, User, Briefcase, GraduationCap, Zap, LightbulbIcon, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const AboutMe = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'approach' | 'achievements' | 'background' | 'pricing'>('approach');
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>("style-1");
  const { isDarkMode } = useAppContext();

  useEffect(() => {
    // Set loaded state after a delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle pricing tab click - trigger pricing modal to open
  const handlePricingClick = () => {
    // Toggle pricing modal via the global state
    const event = new CustomEvent('openPricingModal');
    window.dispatchEvent(event);
    
    // Return to approach tab to maintain consistent UI
    setSelectedTab('approach');
  };

  // Toggle accordion items
  const toggleAccordion = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  return (
    <section id="about" className={`py-24 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white' 
        : 'bg-gradient-to-b from-gray-50 via-gray-100 to-white text-gray-900'
    }`}>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-64 h-64 rounded-full filter blur-3xl ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full filter blur-3xl ${
          isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-500/5'
        }`}></div>
      </div>
      
      {/* Animated gradient lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute top-[60%] left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute left-[20%] top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute left-[70%] top-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main content grid layout - with quote and intro rather than "About Me" heading */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left column - Takes 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            <AnimatedSection className={`backdrop-blur-sm rounded-xl p-6 relative overflow-hidden group ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50'
                : 'bg-white/90 border border-gray-200'
            } shadow-xl`}>
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full translate-x-16 -translate-y-16 filter blur-xl ${
                isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/5'
              }`}></div>
              
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 blur opacity-60"></div>
                    <img 
                      src="https://i.postimg.cc/SxbS61PK/EZ-Headshot.png" 
                      alt="Enri Zhulati"
                      className="relative w-32 h-32 rounded-full object-cover border-2 border-blue-400/30" 
                      loading="eager"
                    />
                  </div>
                  
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Enri Zhulati</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 mb-4`}>Growth Advisor</p>
                  
                  <div className="flex justify-center space-x-3 mb-5">
                    <a 
                      href="https://linkedin.com/in/enrizhulati" 
                      className={`${isDarkMode ? 'bg-gray-700/70' : 'bg-gray-100'} hover:bg-blue-600/70 transition-colors p-2 rounded-full`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" className={`${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a 
                      href="https://twitter.com/enrizhulati" 
                      className={`${isDarkMode ? 'bg-gray-700/70' : 'bg-gray-100'} hover:bg-blue-600/70 transition-colors p-2 rounded-full`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" className={`${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="/resume.html" 
                      className={`${isDarkMode ? 'bg-gray-700/70' : 'bg-gray-100'} hover:bg-blue-600/70 transition-colors p-2 rounded-full`}
                      target="_blank" 
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" className={`${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Career timeline - OPTIMIZED for mobile view */}
            <AnimatedSection delay={0.2} className={`backdrop-blur-sm rounded-xl p-6 relative overflow-hidden ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/90 border border-gray-200'
            } shadow-xl`}>
              <h3 className={`text-lg font-semibold mb-5 flex items-center border-b pb-3 ${
                isDarkMode 
                  ? 'text-gray-300 border-gray-700/50' 
                  : 'text-gray-700 border-gray-200'
              }`}>
                <Briefcase className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={18} />
                Career Snapshot
              </h3>
              
              <div className="relative">
                {/* Fixed position vertical line */}
                <div className={`absolute left-4 top-4 bottom-4 w-px ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                
                {/* Timeline items */}
                <div className="space-y-6">
                  <TimelineItem 
                    year="2017 - Now" 
                    title="Consumer Advocate"
                    company="ComparePower.com"
                    isDarkMode={isDarkMode}
                  />
                  <TimelineItem 
                    year="2015 - 2017" 
                    title="Product Manager"
                    company="OsteoMed"
                    isDarkMode={isDarkMode}
                  />
                  <TimelineItem 
                    year="2013 - 2015" 
                    title="Portfolio Manager"
                    company="Stryker"
                    isLast={true}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
              
              <div className="text-center mt-6">
                <a
                  href="/resume.html"
                  target="_blank"
                  className={`inline-flex items-center text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  <span>Full work history</span>
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </AnimatedSection>
          </div>

          {/* Right column - Takes 8 columns on large screens */}
          <div className="lg:col-span-8">
            {/* Introduction text - No "About Me" heading */}
            <AnimatedSection className={`backdrop-blur-sm rounded-xl p-8 border shadow-xl mb-6 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <h2 className={`text-3xl font-bold mb-5 ${
                isDarkMode ? 'text-gray-50' : 'text-gray-900'
              }`}>Hi, I'm <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>Enri</span></h2>
              
              <div className={`space-y-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="text-lg leading-relaxed">
                  I help small businesses and growing companies get seen online without wasting money on tactics that don't work.
                </p>
                
                <p className="text-lg leading-relaxed">
                  After 15+ years working in product management and growth roles, I've seen firsthand how the right digital strategy can transform a business—and how the wrong one can drain resources with nothing to show for it.
                </p>
                
                <div className="relative pl-6 mt-8">
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-400/70"></div>
                  <p className="text-lg">
                    My approach isn't about fancy jargon or false promises. I combine AI-powered tools with time-tested marketing fundamentals to create websites and digital systems that actually work—all at a fraction of what agencies charge.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Tabbed content area */}
            <div className={`backdrop-blur-sm rounded-xl p-1.5 flex flex-wrap sm:flex-nowrap ${
              isDarkMode ? 'bg-gray-800/70' : 'bg-gray-200/70'
            }`}>
              <TabButton 
                isActive={selectedTab === 'approach'}
                onClick={() => setSelectedTab('approach')}
                icon={<Zap size={18} />}
                label="How I Work"
                isDarkMode={isDarkMode}
              />
              <TabButton 
                isActive={selectedTab === 'achievements'}
                onClick={() => setSelectedTab('achievements')}
                icon={<Award size={18} />}
                label="Results"
                isDarkMode={isDarkMode}
              />
              <TabButton 
                isActive={selectedTab === 'background'}
                onClick={() => setSelectedTab('background')}
                icon={<User size={18} />}
                label="Background"
                isDarkMode={isDarkMode}
              />
              <TabButton 
                isActive={selectedTab === 'pricing'}
                onClick={handlePricingClick}
                icon={<DollarSign size={18} />}
                label="Pricing"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Tab content */}
            <div className="relative min-h-[480px] mt-6">
              {/* Approach Tab */}
              <TabContent isVisible={selectedTab === 'approach'} isDarkMode={isDarkMode}>
                <div className="space-y-6">
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>My Working Style</h3>
                  
                  <div className="space-y-4">
                    {/* Accordion Item 1 */}
                    <AccordionItem 
                      id="style-1"
                      title="Direct Communication"
                      number="1"
                      isExpanded={expandedAccordion === "style-1"}
                      onClick={() => toggleAccordion("style-1")}
                      isDarkMode={isDarkMode}
                    >
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        I tell you exactly what works and what doesn't without marketing-speak or complexity.
                      </p>
                    </AccordionItem>
                    
                    {/* Accordion Item 2 */}
                    <AccordionItem 
                      id="style-2"
                      title="Strategic Technology"
                      number="2"
                      isExpanded={expandedAccordion === "style-2"}
                      onClick={() => toggleAccordion("style-2")}
                      isDarkMode={isDarkMode}
                    >
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        I use AI and automation where they add real value—not to replace human creativity but to enhance it and handle repetitive tasks.
                      </p>
                    </AccordionItem>
                    
                    {/* Accordion Item 3 */}
                    <AccordionItem 
                      id="style-3"
                      title="Results Over Activity"
                      number="3"
                      isExpanded={expandedAccordion === "style-3"}
                      onClick={() => toggleAccordion("style-3")}
                      isDarkMode={isDarkMode}
                    >
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        I focus on metrics that actually matter to your business—leads, sales, and ROI—not vanity metrics that look good on reports but don't pay the bills.
                      </p>
                    </AccordionItem>
                  </div>
                </div>
              </TabContent>

              {/* Achievements Tab */}
              <TabContent isVisible={selectedTab === 'achievements'} isDarkMode={isDarkMode}>
                <div className="space-y-5">
                  <h3 className={`text-xl font-semibold mb-3 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>Results I've Delivered</h3>
                  
                  <Achievement 
                    title="ComparePower.com"
                    metric="100,000+ Monthly Visitors"
                    description="Scaled to 100,000 monthly visitors through targeted SEO strategies and conversion optimization"
                    icon={<TrendingUp className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />}
                    isDarkMode={isDarkMode}
                  />
                  
                  <Achievement 
                    title="AlbaniaVisit.com"
                    metric="Premier Tourism Resource"
                    description="Built from scratch into a leading tourism resource with comprehensive guides and booking systems"
                    icon={<Globe className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />}
                    isDarkMode={isDarkMode}
                  />
                  
                  <Achievement 
                    title="ProsperaHealthcare.com"
                    metric="2,000 Monthly Visits in 60 Days"
                    description="Helped achieve 2,000 monthly organic visits within just 60 days of launch through content strategy and technical SEO"
                    icon={<CheckCircle className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} />}
                    isDarkMode={isDarkMode}
                  />
                  
                  <div className={`relative p-6 rounded-xl border mt-6 ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-900/30'
                      : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50'
                  }`}>
                    <blockquote className={`italic leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      "Enri transformed our online presence in just 90 days. His approach generated a 215% increase in online leads."
                    </blockquote>
                    <div className={`mt-4 font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>— Kyle, Prospera Healthcare</div>
                  </div>
                </div>
              </TabContent>

              {/* Background Tab */}
              <TabContent isVisible={selectedTab === 'background'} isDarkMode={isDarkMode}>
                <div className="space-y-6">
                  <h3 className={`text-xl font-semibold mb-3 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>My Background</h3>
                  
                  <div className={`flex gap-5 p-6 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-900/50 border-gray-700/50'
                      : 'bg-gray-50 border-gray-200/70'
                  }`}>
                    <div className={`p-3 rounded-lg h-fit shadow-inner flex-shrink-0 ${
                      isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                      <GraduationCap className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={24} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Mechanical Engineering, University of North Texas</h4>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>2002 - 2006</p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>My engineering background gave me strong analytical skills and problem-solving abilities that I now apply to digital strategies.</p>
                    </div>
                  </div>
                  
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    I spent over a decade in product management roles for medical device companies, where I learned how to balance technical requirements with user needs and business goals.
                  </p>
                  
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    In 2017, I shifted my focus to digital growth, combining my technical background with marketing expertise to help businesses build effective online systems.
                  </p>
                  
                  <div className={`p-6 rounded-xl border mt-4 ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-900/30'
                      : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Continuous Learning</h4>
                    <p className={`mb-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      The digital landscape changes constantly. I dedicate at least 10 hours weekly to staying current with the latest developments in:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`}></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>SEO & Content Strategy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`}></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Web Development</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`}></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>AI Implementation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                        }`}></div>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Marketing Technology</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Accordion Item Component
interface AccordionItemProps {
  id: string;
  title: string;
  number: string;
  isExpanded: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const AccordionItem = ({ id, title, number, isExpanded, onClick, children, isDarkMode }: AccordionItemProps) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${
      isDarkMode 
        ? 'bg-gray-900/60 border border-gray-700/70' 
        : 'bg-white border border-gray-200/70'
    }`}>
      {/* Accordion Header */}
      <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-5 text-left focus:outline-none transition-colors ${
          isExpanded 
            ? isDarkMode 
              ? 'bg-gray-800/60 border-b border-gray-700/70' 
              : 'bg-gray-50 border-b border-gray-200/70'
            : isDarkMode 
              ? 'hover:bg-gray-800/40' 
              : 'hover:bg-gray-50/60'
        }`}
        aria-expanded={isExpanded}
        aria-controls={`content-${id}`}
      >
        <div className="flex items-center">
          <span className={`flex items-center justify-center w-7 h-7 rounded-full mr-4 text-sm ${
            isExpanded
              ? isDarkMode
                ? 'bg-blue-600/30 text-blue-300'
                : 'bg-blue-100 text-blue-700'
              : isDarkMode
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-blue-50 text-blue-600'
          }`}>
            {number}
          </span>
          <h4 className={`font-medium text-lg ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{title}</h4>
        </div>
        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''} ${
          isDarkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          <ChevronDown size={20} />
        </div>
      </button>
      
      {/* Accordion Content */}
      <motion.div
        id={`content-${id}`}
        initial={false}
        animate={{ 
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="p-5 pt-3 pl-16">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// Helper Components
interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isDarkMode: boolean;
}

const TabButton = ({ isActive, onClick, icon, label, isDarkMode }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 ${
      isActive 
        ? 'bg-blue-600 text-white font-medium' 
        : isDarkMode
          ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300/50'
    }`}
  >
    {icon}
    <span className="text-sm sm:text-base">{label}</span>
  </button>
);

interface TabContentProps {
  isVisible: boolean;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const TabContent = ({ isVisible, children, isDarkMode }: TabContentProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ 
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 0 : 10,
    }}
    transition={{ duration: 0.3 }}
    className={`backdrop-blur-sm rounded-xl p-6 sm:p-8 border shadow-xl h-full ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700/50' 
        : 'bg-white/90 border-gray-200'
    } ${isVisible ? 'block' : 'hidden'}`}
  >
    {children}
  </motion.div>
);

interface AchievementProps {
  title: string;
  metric: string;
  description: string;
  icon: React.ReactNode;
  isDarkMode: boolean;
  className?: string;
}

const Achievement = ({ title, metric, description, icon, isDarkMode, className = "" }: AchievementProps) => (
  <div className={`flex gap-4 p-5 rounded-lg border hover:border-blue-900/40 transition-all ${
    isDarkMode 
      ? 'bg-gray-900/50 border-gray-700/50' 
      : 'bg-gray-50 border-gray-200/70'
  } ${className}`}>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner ${
      isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
    }`}>
      {icon}
    </div>
    <div>
      <h4 className={`font-semibold text-lg ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>{title}</h4>
      <div className={`font-medium text-sm mb-1 ${
        isDarkMode ? 'text-blue-400' : 'text-blue-600'
      }`}>{metric}</div>
      <p className={`text-sm leading-relaxed ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>{description}</p>
    </div>
  </div>
);

// Improved TimelineItem component to fix mobile UI jank
interface TimelineItemProps {
  year: string;
  title: string;
  company: string;
  isLast?: boolean;
  isDarkMode: boolean;
}

const TimelineItem = ({ year, title, company, isLast = false, isDarkMode }: TimelineItemProps) => (
  <div className="relative pl-12">
    <div className="absolute left-0 top-1.5">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isDarkMode
          ? 'bg-blue-900/50 border border-blue-500/50'
          : 'bg-blue-100 border border-blue-300'
      }`}>
        <div className={`w-3 h-3 rounded-full ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
        }`}></div>
      </div>
    </div>
    <div>
      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
        {year}
      </p>
      <p className={`font-medium ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </p>
      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
        {company}
      </p>
    </div>
  </div>
);

export default AboutMe;