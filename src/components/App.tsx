import { useState, useEffect, ReactNode } from 'react';
import { ArrowRight, ExternalLink, ChevronDown, Sparkles, Bot, LineChart, Zap, Code, Github, Linkedin, Twitter, Facebook, Instagram, X, PlusCircle, Info, Layers, Calendar } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './components/MobileMenu';
import AnimatedSection from './components/AnimatedSection';
import AnimatedText from './components/AnimatedText';
import ContactForm from './components/ContactForm';
import IdealPartners from './components/IdealPartners';
import CaseStudies from './components/CaseStudies';
import AboutMe from './components/AboutMe';
import PricingModal from './components/PricingModal';
import ResultsDrawer from './components/ResultsDrawer';
import ScheduleModal from './components/ScheduleModal';

// Navigation items - removed pricing from nav
const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

// Social media links
const socialLinks = [
  { 
    icon: <Twitter size={20} />, 
    href: 'https://twitter.com/enrizhulati', 
    label: 'Twitter',
    color: 'text-[#1DA1F2] bg-white/10 hover:bg-[#1DA1F2]/10' 
  },
  { 
    icon: <Linkedin size={20} />, 
    href: 'https://linkedin.com/in/enrizhulati', 
    label: 'LinkedIn',
    color: 'text-[#0A66C2] bg-white/10 hover:bg-[#0A66C2]/10' 
  },
  { 
    icon: <Github size={20} />, 
    href: 'https://github.com/enrizhulati', 
    label: 'GitHub',
    color: 'text-white bg-white/10 hover:bg-white/20' 
  },
  { 
    icon: <Facebook size={20} />, 
    href: 'https://facebook.com/enrizhulati', 
    label: 'Facebook',
    color: 'text-[#1877F2] bg-white/10 hover:bg-[#1877F2]/10'  
  },
  { 
    icon: <Instagram size={20} />, 
    href: 'https://instagram.com/enrizhulati', 
    label: 'Instagram',
    color: 'text-[#E4405F] bg-white/10 hover:bg-[#E4405F]/10'  
  }
];

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  // Google Calendar client ID and secret
  const googleCalendarConfig = {
    clientId: "263378139761-b6ftm7f3qvf7meo3t4mdgk35lskkj442.apps.googleusercontent.com",
    apiKey: "" // The API key is optional for client-side auth - we're using clientId auth
  };
  
  // Handle scroll events for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2">
              <div className="text-primary relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
                <picture>
                  <source srcSet="https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=32&h=32&fit=crop" type="image/webp" />
                  <img 
                    src="https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&w=32&h=32&fit=crop" 
                    alt="Enri Zhulati" 
                    className="h-8 w-8 rounded-full object-cover relative z-10 border border-blue-500/30"
                    width="32"
                    height="32" 
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </div>
              <span className="font-bold text-xl">Enri Zhulati</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map(item => (
                <a 
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
              
              {/* Small "pricing" button that's easy to miss */}
              <button 
                onClick={() => setIsPricingOpen(true)}
                className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:underline transition-colors ml-2"
                aria-label="View pricing information"
              >
                Pricing
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="hidden md:flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-indigo-500/20"
                aria-label="Schedule a meeting"
              >
                <Calendar size={16} className="mr-1" />
                <span>Schedule</span>
              </button>
              <a 
                href="#contact"
                className="hidden sm:flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-blue-500/20"
              >
                <span>Say hello</span>
                <ArrowRight size={16} />
              </a>
              <MobileMenu items={navItems} />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-36 pb-24 sm:pt-40 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
          </div>
          
          {/* Animated gradient lines */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            <div className="absolute left-[25%] top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
            <div className="absolute left-[75%] top-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  I help businesses <span className="text-blue-600 dark:text-blue-500">get found</span> online
                </h1>
                <AnimatedSection delay={0.2}>
                  <div className="mt-6 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-400/70"></div>
                    <p className="pl-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      I build websites, create content, and implement SEO strategies that actually work—without the agency markup or marketing fluff.
                    </p>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button 
                      onClick={() => setIsScheduleOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-lg transition-all duration-300 flex items-center justify-center sm:justify-start space-x-2 font-medium shadow-lg hover:shadow-indigo-500/30 group"
                    >
                      <Calendar className="h-5 w-5 mr-1" />
                      <span>Schedule a free call</span>
                    </button>
                    <a 
                      href="#about"
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors flex items-center justify-center sm:justify-start space-x-2 font-medium border border-gray-200 dark:border-gray-700"
                    >
                      <span>Learn more</span>
                      <ChevronDown className="h-4 w-4" />
                    </a>
                  </div>
                </AnimatedSection>
              </div>
              <AnimatedSection delay={0.4} className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
                    <dotlottie-player
                      src="https://lottie.host/d8378c4b-21f5-4660-8821-2304ad481643/26XrntllAM.lottie"
                      background="transparent"
                      speed="1"
                      style={{ width: '100%', height: '400px' }}
                      loop
                      autoplay
                    ></dotlottie-player>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/90 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block mb-4">
                What I Can Do For You
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Simple, effective digital solutions that get you real results
              </p>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard 
                icon={<FileText />}
                title="Content Creation"
                description="Words that actually connect with people and help Google find you"
                delay={0.1}
              />
              <ServiceCard 
                icon={<Code />}
                title="Web Development"
                description="Fast, mobile-friendly sites that look great and convert visitors"
                delay={0.2}
              />
              <ServiceCard 
                icon={<Globe />}
                title="SEO Strategy"
                description="No tricks or hacks—just solid optimization that works"
                delay={0.3}
              />
              <ServiceCard 
                icon={<Target />}
                title="Digital Marketing"
                description="Campaigns that focus on ROI, not vanity metrics"
                delay={0.4}
              />
              <ServiceCard 
                icon={<Zap />}
                title="Tech Automation"
                description="Smart tools that save you time and reduce busywork"
                delay={0.5}
              />
              <ServiceCard 
                icon={<Share2 />}
                title="Social Media"
                description="Content that builds genuine connections with your audience"
                delay={0.6}
              />
            </div>
            
            {/* Small link to view past results - discretely placed */}
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setIsResultsOpen(true)}
                className="group inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50"
              >
                <Info size={16} className="opacity-60 group-hover:opacity-100" />
                <span>See some of the results I've delivered</span>
                <ArrowRight size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block mb-4">
                How I Work
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                No complicated processes or endless meetings—just focused work that gets results
              </p>
            </AnimatedSection>
            
            <div className="space-y-12 mt-12 max-w-4xl mx-auto">
              <ProcessStep 
                number="01"
                title="Listen to understand"
                description="I dig into what you actually need and what success looks like for your business. No cookie-cutter approaches."
                delay={0.1}
              />
              <ProcessStep 
                number="02"
                title="Build a practical plan"
                description="Together we'll create a roadmap that fits your timeline and budget, with clear steps and expectations."
                delay={0.2}
              />
              <ProcessStep 
                number="03"
                title="Set up the foundations"
                description="I'll build the core technical elements you need—whether that's a website, analytics, or content system."
                delay={0.3}
              />
              <ProcessStep 
                number="04"
                title="Create what connects"
                description="With the foundations in place, I'll create content that genuinely resonates with your target audience."
                delay={0.4}
              />
              <ProcessStep 
                number="05"
                title="Measure and improve"
                description="Using real data, we'll see what's working and make smart adjustments to get even better results."
                delay={0.5}
              />
            </div>

            {/* Schedule a call section */}
            <div className="mt-16 text-center">
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-lg transition-colors shadow-md hover:shadow-indigo-500/30 font-medium"
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span>Schedule a free 30-minute consultation</span>
              </button>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                Let's talk about your project and see if we're a good fit
              </p>
            </div>
            
            {/* Subtle prompt for pricing information */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsPricingOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700/70 transition-colors border border-blue-200 dark:border-blue-900/50 shadow-sm"
              >
                <PlusCircle size={16} className="mr-2" />
                <span>Curious about investment details?</span>
              </button>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <AboutMe />

        {/* Who I Work With Best */}
        <IdealPartners />

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/90 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <AnimatedSection>
                <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block mb-4">
                  Want to work together?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6"></div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Tell me what you're looking for, and I'll let you know if I can help. No sales pitch, just an honest conversation.
                </p>
                
                <div className="mt-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg shadow-inner">
                      <Zap className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Quick replies</h3>
                      <p className="text-gray-600 dark:text-gray-300">I usually respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg shadow-inner">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">No cookie-cutter solutions</h3>
                      <p className="text-gray-600 dark:text-gray-300">Everything is tailored to what you actually need</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg shadow-inner">
                      <LineChart className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Results you can see</h3>
                      <p className="text-gray-600 dark:text-gray-300">I'll track metrics that actually matter to your business</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => setIsScheduleOpen(true)}
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-lg transition-colors shadow-md hover:shadow-indigo-500/30 flex items-center justify-center font-medium"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Schedule a free consultation</span>
                  </button>
                  
                  <a 
                    href="/resume.html" 
                    target="_blank"
                    className="w-full group flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors space-x-2 font-medium border border-gray-200 dark:border-gray-700"
                  >
                    <span>View my resume</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3} className="bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center border-b border-gray-200 dark:border-gray-700/50 pb-3">
                  Send me a message
                </h3>
                <ContactForm />
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 border-t border-gray-100 dark:border-gray-800 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
                <picture>
                  <source srcSet="https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&fm=webp&w=32&h=32&fit=crop" type="image/webp" />
                  <img 
                    src="https://i.postimg.cc/SxbS61PK/EZ-Headshot.png?dl=1&w=32&h=32&fit=crop" 
                    alt="Enri Zhulati" 
                    className="h-8 w-8 rounded-full object-cover relative z-10 border border-blue-500/30"
                    width="32"
                    height="32" 
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </div>
              <span className="font-semibold text-xl">Enri Zhulati</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full ${social.color} transition-colors flex items-center justify-center hover:scale-110 duration-300`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 md:mb-0">
              <a href="/" className="hover:text-blue-500 transition-colors">Home</a>
              <a href="#services" className="hover:text-blue-500 transition-colors">Services</a>
              <a href="#process" className="hover:text-blue-500 transition-colors">Process</a>
              <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
              <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
              <a href="/privacy.html" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              
              {/* Very subtle pricing link in footer */}
              <button 
                onClick={() => setIsPricingOpen(true)}
                className="hover:text-blue-500 transition-colors text-gray-500 dark:text-gray-500"
              >
                Pricing
              </button>
              
              {/* Calendar scheduling link in footer */}
              <button 
                onClick={() => setIsScheduleOpen(true)}
                className="hover:text-blue-500 transition-colors flex items-center text-gray-500 dark:text-gray-500"
              >
                <Calendar size={14} className="mr-1" />
                Schedule
              </button>
            </div>
            
            <div className="text-center md:text-right text-sm text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()} Enri Zhulati. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Pricing Modal - Only shown when isPricingOpen is true */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      
      {/* Results Drawer - Only shown when isResultsOpen is true */}
      <ResultsDrawer isOpen={isResultsOpen} onClose={() => setIsResultsOpen(false)} />
      
      {/* Schedule Modal - Only shown when isScheduleOpen is true */}
      <ScheduleModal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
        clientId={googleCalendarConfig.clientId} 
      />
    </div>
  );
}

// Custom icons as needed
const FileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const Target = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const Share2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const Globe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Service Card Component
interface ServiceCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  delay: number;
  className?: string;
}

const ServiceCard = ({ icon, title, description, delay, className = "" }: ServiceCardProps) => {
  return (
    <AnimatedSection 
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${className}`}
      delay={delay}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full translate-x-16 -translate-y-16 filter blur-xl group-hover:bg-blue-400/20 transition-colors duration-700"></div>
      
      <div className="relative z-10">
        {icon && (
          <div className="bg-blue-600/20 p-3 inline-flex rounded-lg text-white mb-4 shadow-inner">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </AnimatedSection>
  );
};

// Process Step Component
interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

const ProcessStep = ({ number, title, description, delay }: ProcessStepProps) => {
  return (
    <AnimatedSection 
      className="flex gap-6 bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm rounded-xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
      delay={delay}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-16 -translate-y-16 filter blur-xl group-hover:bg-blue-400/20 transition-colors duration-700"></div>
      
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold relative z-10">
        {number}
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
    </AnimatedSection>
  );
};

export default App;