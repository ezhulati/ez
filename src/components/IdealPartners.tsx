import AnimatedSection from './AnimatedSection';
import AnimatedText from './AnimatedText';
import { Users, Rocket, Building, Map, LightbulbIcon, Users2, Paintbrush } from 'lucide-react';
import { motion } from 'framer-motion';

const IdealPartners = () => {
  return (
    <section id="ideal-partners" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Animated gradient lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-[40%] left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute left-[30%] top-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute left-[70%] top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block mb-4">
            Is My Help Right For You?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I'm not the right fit for everyone. I work best with:
          </p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <PartnerCard 
            icon={<Rocket className="text-blue-400" />}
            title="Small Businesses Ready to Grow"
            description="You've got the business basics down, and now you need to expand your online presence"
            delay={0.1}
          />
          <PartnerCard 
            icon={<Building className="text-blue-400" />}
            title="Local Services Going Digital"
            description="You want to reach beyond your physical location and bring in leads while you sleep"
            delay={0.2}
          />
          <PartnerCard 
            icon={<Users className="text-blue-400" />}
            title="Established Companies"
            description="You need someone to handle your digital presence so you can focus on running your business"
            delay={0.3}
          />
          <PartnerCard 
            icon={<LightbulbIcon className="text-blue-400" />}
            title="Consultants & Experts"
            description="You have valuable knowledge to share but need help turning it into online visibility"
            delay={0.4}
          />
          <PartnerCard 
            icon={<Users2 className="text-blue-400" />}
            title="Time-Pressed Business Owners"
            description="You know digital matters, but you don't have time to learn everything yourself"
            delay={0.5}
          />
          <PartnerCard 
            icon={<Paintbrush className="text-blue-400" />}
            title="Creative Professionals"
            description="You have innovative ideas but need guidance on validating and executing them effectively"
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

interface PartnerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  className?: string;
}

const PartnerCard = ({ icon, title, description, delay, className = "" }: PartnerCardProps) => {
  return (
    <AnimatedSection 
      className={`bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700/50 p-6 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${className}`}
      delay={delay}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-16 -translate-y-16 filter blur-xl group-hover:bg-blue-400/20 transition-colors duration-700"></div>
      
      <div className="relative z-10 flex items-start space-x-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg shadow-inner flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default IdealPartners;