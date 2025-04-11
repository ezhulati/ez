import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ArrowRight, CheckCircle, User, Mail, MessageSquare, Loader2, Phone, Video, Users, AlertCircle } from 'lucide-react';
import { format, addDays, addMinutes, set, addMonths, getDate } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import useScreenSize from '../hooks/useScreenSize';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}

type TimeSlot = {
  startTime: string;
  endTime: string;
  formatted: string;
};

type BookingStep = 'date' | 'time' | 'details' | 'confirmation';

// Secure random token generator using Web Crypto API
const generateSecureToken = (): string => {
  // Use crypto.getRandomValues for secure random generation
  const array = new Uint32Array(4);
  window.crypto.getRandomValues(array);
  return Array.from(array, val => val.toString(16).padStart(8, '0')).join('');
};

// Simple input sanitization to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, clientId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: '',
    preferredContact: 'video' as 'video' | 'phone',
    _csrf: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useScreenSize();
  
  // Get current and next month for dynamic messaging
  const getCurrentMonth = () => format(new Date(), 'MMMM');
  const getNextMonth = () => format(addMonths(new Date(), 1), 'MMMM');
  
  // Get remaining spots based on week of the month
  const getRemainingSpots = () => {
    const day = getDate(new Date());
    
    // Calculate which week of the month we're in (roughly)
    if (day <= 7) return 3;
    if (day <= 14) return 2;
    if (day <= 21) return 1;
    return 0; // Last week of the month - sold out
  };
  
  // Check if month is full
  const isMonthFull = () => getRemainingSpots() === 0;
  
  // Custom availability message based on the week of the month
  const getAvailabilityMessage = () => {
    const spots = getRemainingSpots();
    const currentMonth = getCurrentMonth();
    const nextMonth = getNextMonth();
    
    if (spots === 0) {
      return `${currentMonth} is fully booked • Next openings in ${nextMonth}`;
    } else {
      return `${spots} ${spots === 1 ? 'spot' : 'spots'} remaining in ${currentMonth}`;
    }
  };
  
  // Generate a CSRF token (replaced with more secure version)
  const generateCSRFToken = () => {
    return generateSecureToken();
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  };

  // Initialize CSRF token
  useEffect(() => {
    const csrfToken = generateCSRFToken();
    setFormData(prev => ({
      ...prev,
      _csrf: csrfToken
    }));
    
    // Store in sessionStorage for verification
    try {
      sessionStorage.setItem('scheduleModalCsrfToken', csrfToken);
    } catch (e) {
      console.error('Error storing CSRF token:', e);
    }
  }, []);
  
  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('date');
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
      setBookingComplete(false);
      setError(null);
      
      // Generate a new CSRF token
      const csrfToken = generateCSRFToken();
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        topic: '',
        preferredContact: 'video',
        _csrf: csrfToken
      });
      
      // Store in sessionStorage
      try {
        sessionStorage.setItem('scheduleModalCsrfToken', csrfToken);
      } catch (e) {
        console.error('Error storing CSRF token:', e);
      }
    }
  }, [isOpen]);
  
  // Update available time slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      setAvailableTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);
  
  // Generate time slots for the selected date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    // Early morning hours from 7 AM to 9 AM
    const startHour = 7;
    const endHour = 9;
    
    // 30-minute slots
    const slotDurationMinutes = 30;
    
    const slots: TimeSlot[] = [];
    const currentDate = new Date();
    
    // If date is today, only show future time slots
    const baseHour = date.getDate() === currentDate.getDate() ? 
      Math.max(startHour, currentDate.getHours() + (currentDate.getMinutes() >= 30 ? 1 : 0)) : 
      startHour;
    
    for (let hour = baseHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        // Skip this slot if it's today and the time has passed
        if (date.getDate() === currentDate.getDate() && 
            (hour < currentDate.getHours() || 
             (hour === currentDate.getHours() && minute <= currentDate.getMinutes()))) {
          continue;
        }
        
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Calculate end time
        const startDateTime = set(new Date(date), { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 });
        const endDateTime = addMinutes(startDateTime, slotDurationMinutes);
        const endTime = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;
        
        // Format for display (e.g. "7:00 AM - 7:30 AM")
        const formattedStart = format(startDateTime, 'h:mm a');
        const formattedEnd = format(endDateTime, 'h:mm a');
        
        slots.push({
          startTime,
          endTime,
          formatted: `${formattedStart} - ${formattedEnd}`
        });
      }
    }
    
    return slots;
  };
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    topic?: string;
  }>({});

  // Validate form inputs
  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      topic?: string;
    } = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length > 100) {
      errors.name = "Name is too long";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    
    // Phone validation (optional)
    if (formData.phone.trim() && !/^[\d\s\-+()]{7,20}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number";
    }
    
    // Topic validation
    if (!formData.topic.trim()) {
      errors.topic = "Please let us know what you'd like to discuss";
    } else if (formData.topic.length > 500) {
      errors.topic = "Topic is too long";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limit input length for security
    const maxLengths: {[key: string]: number} = {
      name: 100,
      email: 100,
      phone: 20,
      topic: 500
    };
    
    const truncatedValue = maxLengths[name] ? value.slice(0, maxLengths[name]) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: truncatedValue
    }));
    
    // Clear validation error when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle radio button change for preferred contact method
  const handleContactMethodChange = (method: 'video' | 'phone') => {
    setFormData(prev => ({
      ...prev,
      preferredContact: method
    }));
  };
  
  // Rate limiting for form submissions
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  
  // Handle form submission - send data to Formspree with CSRF protection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot) return;
    
    // Rate limiting check - prevent submissions more than once per 10 seconds
    const now = Date.now();
    if (now - lastSubmissionTime < 10000) {
      setError("Please wait a moment before submitting again");
      return;
    }
    
    // Validate form inputs
    if (!validateForm()) {
      return;
    }
    
    setLastSubmissionTime(now);
    setIsSubmitting(true);
    
    try {
      // Verify CSRF token matches
      let storedToken;
      try {
        storedToken = sessionStorage.getItem('scheduleModalCsrfToken');
      } catch (e) {
        console.error('Error retrieving CSRF token:', e);
      }
      
      if (!storedToken || storedToken !== formData._csrf) {
        // Generate a new token if verification fails (using secure method)
        const newToken = generateSecureToken();
        setFormData(prev => ({
          ...prev,
          _csrf: newToken
        }));
        try {
          sessionStorage.setItem('scheduleModalCsrfToken', newToken);
        } catch (e) {
          console.error('Error storing new CSRF token:', e);
        }
        throw new Error('Security verification failed. Please try again.');
      }
      
      // Format the date and time for email
      const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');
      const formattedTime = selectedTimeSlot.formatted;
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        scheduledDate: formattedDate,
        scheduledTime: formattedTime,
        _subject: `Meeting Request: ${formData.name} for ${formattedDate}`,
      };
      
      // Submit to Formspree with CSRF token
      const response = await fetch("https://formspree.io/f/xanewdzl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": formData._csrf
        },
        body: JSON.stringify(submissionData),
      });
      
      if (response.ok) {
        // Move to confirmation step
        setBookingComplete(true);
        setCurrentStep('confirmation');
      } else {
        console.error('Form submission error:', await response.text());
        setError('There was an error submitting your request. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error instanceof Error ? error.message : 'Unknown error');
      setError('There was an error submitting your request. Please try again later.');
      
      // Generate a new CSRF token after an error (using secure method)
      const newToken = generateSecureToken();
      setFormData(prev => ({
        ...prev,
        _csrf: newToken
      }));
      try {
        sessionStorage.setItem('scheduleModalCsrfToken', newToken);
      } catch (e) {
        console.error('Error storing new CSRF token:', e);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setCurrentStep('time');
    }
  };
  
  // Handle time slot selection
  const handleTimeSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setCurrentStep('details');
  };
  
  // Go back to previous step
  const goBack = () => {
    if (currentStep === 'time') {
      setCurrentStep('date');
    } else if (currentStep === 'details') {
      setCurrentStep('time');
    }
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
  
  // Calendar disabledDays function - disable Sundays and past days
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past days
    if (date < today) {
      return true;
    }
    
    // Disable Sundays (0 = Sunday)
    const day = date.getDay();
    return day === 0; // Only disable Sundays
  };
  
  // Custom CSS for DayPicker
  const dayPickerClassNames = `
    .rdp {
      --rdp-cell-size: ${isMobile ? '36px' : '40px'};
      --rdp-accent-color: #3b82f6;
      --rdp-background-color: rgba(59, 130, 246, 0.1);
      margin: 0;
    }
    .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
      background-color: var(--rdp-accent-color);
      color: white;
    }
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: var(--rdp-background-color);
    }
    .rdp-day {
      border-radius: 9999px;
    }
    .rdp-day_today:not(.rdp-day_selected) {
      border: 1px solid var(--rdp-accent-color);
    }
    .rdp-caption_label {
      font-weight: 600;
    }
    .rdp-head_cell {
      font-weight: 500;
      font-size: 0.875rem;
      color: #6b7280;
    }
    .dark .rdp-head_cell {
      color: #9ca3af;
    }
    .dark .rdp-day {
      color: #e5e7eb;
    }
    .dark .rdp-day_disabled {
      color: #6b7280;
    }
  `;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 pb-8 px-4 overflow-y-auto bg-black/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <style>{dayPickerClassNames}</style>
          
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
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden relative w-full max-w-3xl z-50 max-h-[80vh] flex flex-col my-4"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Close scheduling dialog"
            >
              <X size={20} />
            </button>
            
            {/* Modal header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block">
                Schedule a Meeting
              </h2>
              <div className="flex items-center justify-between mt-1">
                <p className="text-gray-600 dark:text-gray-300">
                  30-minute free consultation with Enri Zhulati
                </p>
                
                {/* Availability indicator */}
                <span className={`inline-flex items-center text-sm ${
                  isMonthFull() 
                    ? 'text-orange-500 dark:text-orange-400' 
                    : 'text-blue-600 dark:text-blue-400'
                }`}>
                  <Clock size={14} className="mr-1" />
                  <span>{getAvailabilityMessage()}</span>
                </span>
              </div>
            </div>
            
            {/* Modal content - scrollable container */}
            <div className="overflow-y-auto p-6 flex-grow">
              {/* Step indicators */}
              <div className="flex items-center justify-between max-w-md mx-auto mb-8 relative">
                {/* Horizontal lines connecting steps */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" style={{ zIndex: 1 }}></div>
                
                {/* Step indicators positioned above the line */}
                <StepIndicator 
                  step={1} 
                  label="Date" 
                  status={
                    currentStep === 'date' 
                      ? 'active' 
                      : currentStep === 'time' || currentStep === 'details' || currentStep === 'confirmation'
                        ? 'completed' 
                        : 'inactive'
                  } 
                />
                
                <StepIndicator 
                  step={2} 
                  label="Time" 
                  status={
                    currentStep === 'time' 
                      ? 'active' 
                      : currentStep === 'details' || currentStep === 'confirmation'
                        ? 'completed' 
                        : 'inactive'
                  } 
                />
                
                <StepIndicator 
                  step={3} 
                  label="Details" 
                  status={
                    currentStep === 'details' 
                      ? 'active' 
                      : currentStep === 'confirmation'
                        ? 'completed' 
                        : 'inactive'
                  } 
                />
              </div>
              
              {/* Step 1: Select date */}
              {currentStep === 'date' && (
                <div className="flex flex-col items-center">
                  <div className="mb-6">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={disabledDays}
                      fromDate={new Date()}
                      toDate={addDays(new Date(), 30)}
                      showOutsideDays
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mx-auto bg-white dark:bg-gray-800 shadow-sm"
                    />
                  </div>
                  
                  {/* Month availability badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mb-4 ${
                    isMonthFull()
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
                      : getRemainingSpots() === 1
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                  }`}>
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    <span>{getAvailabilityMessage()}</span>
                  </div>
                  
                  <div className="text-blue-500 dark:text-blue-400 text-sm text-center flex items-center bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Available: Monday-Saturday, 7:00 AM - 9:00 AM</span>
                  </div>
                </div>
              )}
              
              {/* Step 2: Select time */}
              {currentStep === 'time' && (
                <div>
                  <div className="flex items-center space-x-2 mb-5">
                    <button 
                      onClick={goBack}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      aria-label="Go back to date selection"
                    >
                      <ArrowRight className="h-5 w-5 transform rotate-180" />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                  </div>
                  
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 max-h-72 overflow-y-auto p-1">
                      {availableTimeSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleTimeSelect(slot)}
                          className="py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        >
                          <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">{slot.formatted}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Clock className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No available time slots for this date.</p>
                      <button
                        onClick={() => setCurrentStep('date')}
                        className="px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                        Select a different date
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 3: Enter details */}
              {currentStep === 'details' && (
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <button
                      onClick={goBack}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      aria-label="Go back to time selection"
                    >
                      <ArrowRight className="h-5 w-5 transform rotate-180" />
                    </button>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                        {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedTimeSlot?.formatted}
                      </p>
                    </div>
                  </div>
                  
                  {/* Error message */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg flex items-center mb-5">
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Your Name
                        </label>
                        {validationErrors.name && (
                          <span className="text-red-500 text-xs flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {validationErrors.name}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          maxLength={100}
                          className={`pl-10 w-full px-4 py-2.5 border ${validationErrors.name ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm`}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        {validationErrors.email && (
                          <span className="text-red-500 text-xs flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {validationErrors.email}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          maxLength={100}
                          className={`pl-10 w-full px-4 py-2.5 border ${validationErrors.email ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm`}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number <span className="text-gray-500 dark:text-gray-400 font-normal">(optional)</span>
                        </label>
                        {validationErrors.phone && (
                          <span className="text-red-500 text-xs flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {validationErrors.phone}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          maxLength={20}
                          pattern="[\d\s\-+()]{7,20}"
                          className={`pl-10 w-full px-4 py-2.5 border ${validationErrors.phone ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm`}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          What would you like to discuss?
                        </label>
                        {validationErrors.topic && (
                          <span className="text-red-500 text-xs flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {validationErrors.topic}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="topic"
                          name="topic"
                          value={formData.topic}
                          onChange={handleInputChange}
                          required
                          maxLength={500}
                          className={`pl-10 w-full px-4 py-2.5 border ${validationErrors.topic ? 'border-red-300 dark:border-red-600 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'} rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm`}
                          placeholder="Briefly describe what you'd like to discuss"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleContactMethodChange('video')}
                          className={`py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                            formData.preferredContact === 'video'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 ring-1 ring-blue-500'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <Video className="h-5 w-5 mr-2" />
                          <span>Video Call</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleContactMethodChange('phone')}
                          className={`py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                            formData.preferredContact === 'phone'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 ring-1 ring-blue-500'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <Phone className="h-5 w-5 mr-2" />
                          <span>Phone Call</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            <span>Scheduling...</span>
                          </>
                        ) : (
                          <span>Schedule Meeting</span>
                        )}
                      </button>
                      
                      {/* Subtle reassurance message */}
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                        Free consultation • No obligation • Available through {getNextMonth()}
                      </p>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Step 4: Confirmation */}
              {currentStep === 'confirmation' && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Your meeting is scheduled!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    I look forward to speaking with you.
                  </p>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-5 max-w-md mx-auto mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <Clock className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {selectedTimeSlot?.formatted}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <User className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {/* Sanitize user input to prevent XSS */}
                        {formData.name && sanitizeInput(formData.name)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {formData.preferredContact === 'video' ? (
                        <Video className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      ) : (
                        <Phone className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      )}
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {formData.preferredContact === 'video' ? 'Video Call' : 'Phone Call'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    I've received your request and will send confirmation details to <span className="font-medium">{formData.email && sanitizeInput(formData.email)}</span>
                  </p>
                  
                  <button
                    onClick={onClose}
                    className="mt-8 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface StepIndicatorProps {
  step: number;
  label: string;
  status: 'inactive' | 'active' | 'completed';
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, label, status }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-sm ${
        status === 'active' 
          ? 'bg-blue-600 text-white' 
          : status === 'completed'
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      } transition-colors duration-200`}>
        {status === 'completed' ? <CheckCircle size={16} /> : step}
      </div>
      <span className={`text-xs mt-1.5 font-medium ${
        status === 'active' 
          ? 'text-blue-600 dark:text-blue-400' 
          : status === 'completed'
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-500 dark:text-gray-400'
      } transition-colors duration-200`}>
        {label}
      </span>
    </div>
  );
};

export default ScheduleModal;