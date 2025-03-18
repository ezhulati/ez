import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, InfoIcon, Clock, Users } from 'lucide-react';
import { format, addMonths, getDate, getMonth, getYear } from 'date-fns';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WebsiteOption = 'existing' | 'standard' | 'premium' | null;

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');
  const [doneWithYouWebsiteOption, setDoneWithYouWebsiteOption] = useState<WebsiteOption>(null);
  const [doneForYouWebsiteOption, setDoneForYouWebsiteOption] = useState<WebsiteOption>(null);

  // Current month for dynamic display
  const getCurrentMonth = () => format(new Date(), 'MMMM');
  
  // Next month for dynamic display
  const getNextMonth = () => format(addMonths(new Date(), 1), 'MMMM');
  
  // Get the number of remaining spots based on the week of the month
  const getRemainingSpots = () => {
    const today = new Date();
    const day = getDate(today);
    
    // Calculate which week of the month we're in (roughly)
    if (day <= 7) return 3;
    if (day <= 14) return 2;
    if (day <= 21) return 1;
    return 0; // Last week of the month - sold out
  };
  
  // Check if the current month is full/sold out
  const isMonthSoldOut = () => {
    return getRemainingSpots() === 0;
  };

  // Close modal on escape key press
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

  // Prevent body scrolling when modal is open
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

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle website option change
  const handleWebsiteOptionChange = (
    option: WebsiteOption,
    packageType: 'doneWithYou' | 'doneForYou'
  ) => {
    if (packageType === 'doneWithYou') {
      setDoneWithYouWebsiteOption(option);
    } else {
      setDoneForYouWebsiteOption(option);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 sm:pt-32 bg-black/40 backdrop-blur-sm overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0"
          ></motion.div>
          
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 350 
            }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden relative w-full max-w-6xl z-50 max-h-[85vh] flex flex-col my-4"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Close pricing information"
            >
              <X size={20} />
            </button>
            
            {/* Modal header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block mb-2">
                Transparent Pricing
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                I believe in honest, straightforward pricing with no surprises or hidden fees.
              </p>
            </div>
            
            {/* Modal content - made scrollable */}
            <div className="overflow-y-auto px-6 py-6 flex-grow">
              {/* Billing toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      billingCycle === 'monthly'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  
                  <button
                    onClick={() => setBillingCycle('quarterly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                      billingCycle === 'quarterly'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <span>Quarterly Billing</span>
                    <span className="ml-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Save 15%
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Pricing tables - Redesigned for better space usage on desktop */}
              <div className="grid md:grid-cols-3 gap-5 xl:gap-6">
                <PricingCard 
                  title="Digital Strategy Plan"
                  price="$2,750"
                  description="One-time fee"
                  expertServices={[
                    "SEO Strategy Development",
                    "Project Management",
                    "UX Analysis"
                  ]}
                  features={[
                    "In-depth analysis of your current setup",
                    "Competitive research (analysis of top 5 competitors)",
                    "Tech recommendations that fit your budget",
                    "90-day action plan with weekly milestones",
                    "Traffic growth strategy with keyword targets",
                    "Conversion improvement recommendations"
                  ]}
                  ctaText={isMonthSoldOut() ? "Join Waitlist" : "Get Started"}
                  ctaLink="https://square.link/u/Yp5e7G1O"
                  availabilityInfo={{
                    month: getCurrentMonth(),
                    nextMonth: getNextMonth(),
                    spotsRemaining: getRemainingSpots(),
                    isSoldOut: isMonthSoldOut()
                  }}
                  footerText="We can get started once the one-time fee is secured."
                />
                
                <PricingCard 
                  title="Done-With-You"
                  price={billingCycle === 'monthly' ? "$3,250" : "$2,762"}
                  description={billingCycle === 'monthly' ? "Per month" : "Per month (billed quarterly)"}
                  serviceFocusAreas={[
                    "Strategic SEO Planning",
                    "End-to-End Project Management",
                    "Professional Content Creation",
                    "Website Optimization",
                    "Technical SEO Implementation"
                  ]}
                  features={[
                    "4 content pieces per month (blog posts/pages)",
                    "Monthly content calendar",
                    "Optimization for visibility (15 target keywords)",
                    "Conversion rate optimization (3 key pages)",
                    "Regular performance updates (weekly reports)",
                    "Monthly strategy check-ins (60-min call)"
                  ]}
                  websiteOptions={{
                    selected: doneWithYouWebsiteOption,
                    onChange: (option) => handleWebsiteOptionChange(option, 'doneWithYou'),
                    standardDescription: "5-7 custom pages, mobile-responsive design, basic SEO optimization, standard contact forms, content management system, basic analytics integration, 30-day post-launch support",
                    premiumDescription: "10-15 custom pages, advanced mobile optimization, custom animations, advanced e-commerce capabilities, customer portal/login area, advanced lead capture forms with automation, enhanced security, custom database integration, 90-day support, user testing and UX optimization"
                  }}
                  ctaText={isMonthSoldOut() ? "Join Waitlist" : "Get Started"}
                  ctaLink={billingCycle === 'monthly' ? "https://square.link/u/R5sg5iPH" : "https://square.link/u/lZGnMg7z"}
                  availabilityInfo={{
                    month: getCurrentMonth(),
                    nextMonth: getNextMonth(),
                    spotsRemaining: getRemainingSpots(),
                    isSoldOut: isMonthSoldOut()
                  }}
                  popular={true}
                  footerText="We can get started once the initial retainer is secured."
                />
                
                <PricingCard 
                  title="Done-For-You"
                  price={billingCycle === 'monthly' ? "$5,995" : "$5,095"}
                  description={billingCycle === 'monthly' ? "Per month" : "Per month (billed quarterly)"}
                  serviceFocusAreas={[
                    "Advanced SEO Strategy",
                    "Dedicated Project Management",
                    "Enhanced Content Production",
                    "Premium Web Optimization",
                    "Technical SEO Mastery",
                    "Conversion Rate Optimization",
                    "Advanced Analytics & Reporting"
                  ]}
                  features={[
                    "Everything in Done-With-You plus:",
                    "8 content pieces per month (vs. 4)",
                    "Custom lead generation system",
                    "Marketing automation setup",
                    "Priority access and support (24-hour response)",
                    "Weekly progress updates and strategy calls",
                    "Optimization for 30+ target keywords (vs. 15)",
                    "Conversion rate optimization for all key pages"
                  ]}
                  websiteOptions={{
                    selected: doneForYouWebsiteOption,
                    onChange: (option) => handleWebsiteOptionChange(option, 'doneForYou'),
                    standardDescription: "5-7 custom pages, mobile-responsive design, basic SEO optimization, standard contact forms, content management system, basic analytics integration, 30-day post-launch support",
                    premiumDescription: "10-15 custom pages, advanced mobile optimization, custom animations, advanced e-commerce capabilities, customer portal/login area, advanced lead capture forms with automation, enhanced security, custom database integration, 90-day support, user testing and UX optimization"
                  }}
                  ctaText={isMonthSoldOut() ? "Join Waitlist" : "Get Started"}
                  ctaLink={billingCycle === 'monthly' ? "https://square.link/u/4FldCCun" : "https://square.link/u/DsFzOChv"}
                  availabilityInfo={{
                    month: getCurrentMonth(),
                    nextMonth: getNextMonth(),
                    spotsRemaining: getRemainingSpots(),
                    isSoldOut: isMonthSoldOut()
                  }}
                  footerText="We can get started once the initial retainer is secured."
                />
              </div>
              
              {/* FAQ - Redesigned with more compact layout */}
              <div className="mt-12">
                <div className="flex items-center mb-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                  <div className="ml-3 h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
                  <FaqItem 
                    question="Do you require long-term contracts?"
                    answer="No. While I recommend at least a 3-month commitment for most projects to see meaningful results, all work is month-to-month with no long-term contracts."
                  />
                  
                  <FaqItem 
                    question="What payment methods do you accept?"
                    answer="I accept all major credit cards, ACH transfers, and PayPal. Payments are typically due at the beginning of each month for ongoing work."
                  />
                  
                  <FaqItem 
                    question="Do you offer custom packages?"
                    answer="Absolutely. The packages above are starting points, but I'm happy to create a custom solution based on your specific needs and budget."
                  />
                  
                  <FaqItem 
                    question="How quickly will I see results?"
                    answer="It depends on your starting point and goals. Some clients see improvements within weeks, while others may take 3-6 months to see significant results. We'll set clear expectations based on your specific situation."
                  />
                  
                  <FaqItem 
                    question="What if I'm not happy with the work?"
                    answer="I want you to be thrilled with the results. If you're not satisfied, let me know right away and I'll do my best to fix the issues. If we can't resolve them, you can cancel at any time."
                    className="md:col-span-2"
                  />
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700/50 text-center flex-shrink-0">
              <a 
                href="#contact"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-colors shadow-md hover:shadow-blue-500/20 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={onClose}
              >
                <span>Let's discuss your project</span>
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Have a specific need? I offer completely custom solutions as well.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface WebsiteOptionsProps {
  selected: WebsiteOption;
  onChange: (option: WebsiteOption) => void;
  standardDescription: string;
  premiumDescription: string;
}

interface AvailabilityInfo {
  month: string;
  nextMonth: string;
  spotsRemaining: number;
  isSoldOut: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  expertServices?: string[];
  serviceFocusAreas?: string[];
  websiteOptions?: WebsiteOptionsProps;
  ctaText: string;
  ctaLink: string;
  availabilityInfo: AvailabilityInfo;
  footerText?: string;
  popular?: boolean;
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  description, 
  features, 
  expertServices,
  serviceFocusAreas,
  websiteOptions,
  ctaText, 
  ctaLink,
  availabilityInfo,
  footerText,
  popular = false,
  className = "" 
}) => {
  // Calculate capacity percentage for visual display
  const capacityPercentage = Math.min(100 - (availabilityInfo.spotsRemaining * 25), 95);
  
  // Determine availability status text
  const getAvailabilityStatusText = () => {
    if (availabilityInfo.isSoldOut) {
      return `${availabilityInfo.month} full • Next openings in ${availabilityInfo.nextMonth}`;
    } else {
      return `${availabilityInfo.spotsRemaining} ${availabilityInfo.spotsRemaining === 1 ? 'spot' : 'spots'} left in ${availabilityInfo.month}`;
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col ${
      popular 
        ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-xl translate-y-0 sm:-translate-y-2' 
        : 'border border-gray-200 dark:border-gray-700 shadow-lg hover:-translate-y-1'
    } ${className}`}>
      {popular && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center text-sm font-medium py-1.5">
          MOST POPULAR
        </div>
      )}
      
      <div className={`p-5 sm:p-6 bg-white dark:bg-gray-800 flex-grow flex flex-col ${!popular && 'pt-6'}`}>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
          <div className="flex items-baseline space-x-1.5 mb-3">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{price}</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{description}</span>
          </div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-4"></div>
        </div>
        
        {/* Content container with fixed height to ensure consistent layout */}
        <div className="flex-grow flex flex-col">
          {/* Conditional Expert Services Section */}
          {expertServices && expertServices.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">Expert Services:</h4>
              <ul className="space-y-2">
                {expertServices.map((service, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Conditional Service Focus Areas Section */}
          {serviceFocusAreas && serviceFocusAreas.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">Service Focus Areas:</h4>
              <ul className="space-y-2">
                {serviceFocusAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
              {expertServices ? 'Deliverables:' : 'Monthly Deliverables:'}
            </h4>
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Website Options Section */}
          {websiteOptions && (
            <div className="mb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Website Options:</h4>
              <div className="space-y-2.5">
                <WebsiteOption 
                  id={`${title.toLowerCase().replace(/\s+/g, '-')}-existing`}
                  label="I already have a website"
                  description="No additional cost"
                  checked={websiteOptions.selected === 'existing'}
                  onChange={() => websiteOptions.onChange('existing')}
                />
                
                <WebsiteOption 
                  id={`${title.toLowerCase().replace(/\s+/g, '-')}-standard`}
                  label="Standard Website"
                  description="+$8,500 one-time"
                  checked={websiteOptions.selected === 'standard'}
                  onChange={() => websiteOptions.onChange('standard')}
                  expandableDescription={websiteOptions.standardDescription}
                />
                
                <WebsiteOption 
                  id={`${title.toLowerCase().replace(/\s+/g, '-')}-premium`}
                  label="Premium Website"
                  description="+$12,500 one-time"
                  checked={websiteOptions.selected === 'premium'}
                  onChange={() => websiteOptions.onChange('premium')}
                  expandableDescription={websiteOptions.premiumDescription}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Fixed-height bottom section with CTA button - this ensures buttons align */}
        <div className="mt-auto pt-4">
          {footerText && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
              {footerText}
            </p>
          )}
          
          {/* Availability information - moved out of the button */}
          <div className="mb-4 space-y-2">
            {/* Capacity bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className={`flex items-center font-medium ${
                  availabilityInfo.spotsRemaining === 0
                    ? 'text-orange-500 dark:text-orange-400'
                    : availabilityInfo.spotsRemaining === 1
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : 'text-blue-500 dark:text-blue-400'
                }`}>
                  <Clock size={12} className="mr-1" />
                  {getAvailabilityStatusText()}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {capacityPercentage}% Full
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    availabilityInfo.spotsRemaining === 0
                      ? 'bg-orange-500 dark:bg-orange-600'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${capacityPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* CTA button - simplified text */}
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 px-4 rounded-lg font-medium text-center flex items-center justify-center transition-all duration-200 ${
              popular 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-blue-500/20'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
            onClick={() => document.body.style.overflow = ''}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  );
};

interface WebsiteOptionProps {
  id: string;
  label: string;
  description: string;
  expandableDescription?: string;
  checked: boolean;
  onChange: () => void;
}

const WebsiteOption: React.FC<WebsiteOptionProps> = ({
  id,
  label,
  description,
  expandableDescription,
  checked,
  onChange
}) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="relative">
      <div 
        className={`flex gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
          checked 
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/70'
        }`}
        onClick={onChange}
      >
        <div className="flex-shrink-0 pt-0.5">
          <div 
            className={`w-4 h-4 rounded-full border-2 ${
              checked 
                ? 'border-blue-500 dark:border-blue-400' 
                : 'border-gray-400 dark:border-gray-600'
            } flex items-center justify-center`}
          >
            {checked && <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
              {label}
            </label>
            {expandableDescription && (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className={`text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline`}
              >
                {expanded ? 'Hide details' : 'Show details'}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          
          {expandableDescription && expanded && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
              {expandableDescription}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
  className?: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-800/50 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors ${className}`}>
      <div className="flex items-start gap-2">
        <InfoIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1.5">{question}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;