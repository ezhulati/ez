import { useState, useEffect } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Contact form validation types
type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    package: "",
    message: ""
  });

  // Form validation and submission state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitCount, setSubmitCount] = useState(0);

  // Validate form when data changes and we've attempted to submit
  useEffect(() => {
    if (submitCount > 0) {
      validateForm();
    }
  }, [formData, submitCount]);

  // Form validation function
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Please let me know what you need";
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Please tell me about your project";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message is too short";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Handle field blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id } = e.target;
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
    
    // Validate the form to show errors for this field
    validateForm();
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitCount(prev => prev + 1);
    
    const isValid = validateForm();
    if (!isValid) return;
    
    setStatus("loading");

    try {
      // Send the form data to Formspree
      const response = await fetch("https://formspree.io/f/xanewdzl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          package: "",
          message: ""
        });
        setTouched({});
        setSubmitCount(0);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  // Determine if a field has an error
  const hasError = (field: keyof FormErrors) => touched[field] && errors[field];

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {/* Name field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Name
          </label>
          {hasError('name') && (
            <span className="text-red-500 text-xs flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.name}
            </span>
          )}
        </div>
        <input 
          type="text" 
          id="name" 
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-lg border ${hasError('name') ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700/50 dark:backdrop-blur-sm focus:ring-2 focus:border-transparent transition-colors shadow-sm`}
          placeholder="What should I call you?"
          disabled={status === "loading"}
          aria-invalid={hasError('name') ? "true" : "false"}
        />
      </div>
      
      {/* Email field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Email
          </label>
          {hasError('email') && (
            <span className="text-red-500 text-xs flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.email}
            </span>
          )}
        </div>
        <input 
          type="email" 
          id="email" 
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-lg border ${hasError('email') ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700/50 dark:backdrop-blur-sm focus:ring-2 focus:border-transparent transition-colors shadow-sm`}
          placeholder="So I can get back to you"
          disabled={status === "loading"}
          aria-invalid={hasError('email') ? "true" : "false"}
        />
      </div>
      
      {/* Subject field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            What do you need?
          </label>
          {hasError('subject') && (
            <span className="text-red-500 text-xs flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.subject}
            </span>
          )}
        </div>
        <input 
          type="text" 
          id="subject" 
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-lg border ${hasError('subject') ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700/50 dark:backdrop-blur-sm focus:ring-2 focus:border-transparent transition-colors shadow-sm`}
          placeholder="Website, SEO, content, etc."
          disabled={status === "loading"}
          aria-invalid={hasError('subject') ? "true" : "false"}
        />
      </div>

      {/* Package selection */}
      <div>
        <label htmlFor="package" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Interested in a package?
        </label>
        <select
          id="package"
          value={formData.package}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 dark:backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm appearance-none"
          disabled={status === "loading"}
        >
          <option value="">Not sure yet (that's okay!)</option>
          <option value="strategy">Strategy Plan ($2,750)</option>
          <option value="done-with-you">Done-With-You ($3,250/month)</option>
          <option value="done-for-you">Done-For-You ($5,995/month)</option>
          <option value="custom">Something custom</option>
        </select>
      </div>
      
      {/* Message field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tell me about your project
          </label>
          {hasError('message') && (
            <span className="text-red-500 text-xs flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.message}
            </span>
          )}
        </div>
        <textarea 
          id="message" 
          rows={5}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 rounded-lg border ${hasError('message') ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} bg-white dark:bg-gray-700/50 dark:backdrop-blur-sm focus:ring-2 focus:border-transparent transition-colors shadow-sm resize-none`}
          placeholder="What are you trying to accomplish? Any timeline or budget constraints?"
          disabled={status === "loading"}
          aria-invalid={hasError('message') ? "true" : "false"}
        />
      </div>
      
      {/* Submit button */}
      <div>
        <button 
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-blue-500/30 group disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <span className="opacity-0">Send it</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </span>
            </>
          ) : (
            <span className="flex items-center justify-center">
              <span>Send it</span>
              <Send size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          )}
        </button>
      </div>

      {/* Success message */}
      {status === "success" && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          <p className="text-sm font-medium">Got it! I'll get back to you soon.</p>
        </div>
      )}
      
      {/* Error message */}
      {status === "error" && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          <p className="text-sm font-medium">Something went wrong. Try emailing me directly at contact@enrizhulati.com instead.</p>
        </div>
      )}
    </form>
  );
}