import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Clock, Calendar, ArrowLeft, ArrowRight, CheckCircle, User, Mail, Phone, AlertCircle, X, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/SingleStepAppointment.css';
import '../styles/AppointmentFormFix.css';
import { format } from 'date-fns';

// Temporary definitions for missing APIs
const Button = ({ children, className, onClick, ...props }) => {
  return (
    <button
      className={`btn ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div className="dialog-overlay" onClick={() => onOpenChange(false)}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => <div className="dialog-content">{children}</div>;
const DialogHeader = ({ children }) => <div className="dialog-header">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="dialog-title">{children}</h2>;

// Mock API services
const api = {
  get: async (url) => ({ data: [] }),
  post: async (url, data) => ({ data: { id: 'mock-id' } })
};

const API_BASE_URL = 'http://localhost:5001';

const timeUtils = {
  createTimezoneAwareDate: (dateStr, timeStr) => new Date(`${dateStr}T${timeStr}`),
  to24Hour: (timeStr) => {
    const [timePart, modifier] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

const appointmentService = {
  getTakenSlots: async (date) => ({ data: [] })
};

const customToast = {
  success: (msg) => console.log('Success:', msg),
  error: (msg) => console.log('Error:', msg)
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

const SingleStepAppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(''); // Empty default, will be filled from API
  const [doctors, setDoctors] = useState([]); // Will be fetched from API
  const [appointmentPurpose, setAppointmentPurpose] = useState(''); // Purpose of appointment
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    purpose: ''
  });
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [takenSlots, setTakenSlots] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
  
  const purposeOptions = [
    { id: 1, value: 'pneumonia-check', label: 'Pneumonia Assessment' },
    { id: 2, value: 'scan-review', label: 'Scan Result Review' },
    { id: 3, value: 'general-checkup', label: 'General Check-up' },
    { id: 4, value: 'follow-up', label: 'Follow-up Appointment' },
    { id: 5, value: 'consultation', label: 'General Consultation' }
  ];
  
  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/doctors`);
      if (response.ok) {
        const doctorsList = await response.json();
        console.log('Fetched doctors:', doctorsList);
        setDoctors(doctorsList);
        
        // If user is not premium, select a random doctor based on appointment purpose
        if (user?.role !== 'premium' && appointmentPurpose) {
          const purposeLabel = purposeOptions.find(p => p.value === appointmentPurpose)?.label || '';
          let matchingSpecialty = 'Pulmonologist'; // Default specialty
          
          // Map purpose to specialties
          if (purposeLabel.includes('Pneumonia')) {
            matchingSpecialty = 'Pulmonologist';
          } else if (purposeLabel.includes('Scan')) {
            matchingSpecialty = 'Radiologist';
          } else if (purposeLabel.includes('Check-up')) {
            matchingSpecialty = 'General Practitioner';
          } else if (purposeLabel.includes('Follow-up')) {
            matchingSpecialty = 'Internal Medicine';
          }
          
          // Find doctors with matching specialty
          const matchingDoctors = doctorsList.filter(d => 
            d.specialty && d.specialty.includes(matchingSpecialty)
          );
          
          if (matchingDoctors.length > 0) {
            // Select random doctor from matching ones
            const randomDoctor = matchingDoctors[Math.floor(Math.random() * matchingDoctors.length)];
            setSelectedDoctor(randomDoctor._id);
          } else if (doctorsList.length > 0) {
            // Fallback to any doctor if no matching specialty
            setSelectedDoctor(doctorsList[0]._id);
          }
        }
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };
    // Check authentication and redirect to login if needed
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    // Fetch doctors list when component mounts
    fetchDoctors();
    
    // Fetch user profile to pre-fill form fields
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profiles/');
        const profile = response.data[0];
        setProfileData(profile);
        
        // Pre-fill form fields from user data
        if (user) {
          setFirstName(user.first_name || '');
          setLastName(user.last_name || '');
          setEmail(user.email || '');
        }
        
        if (profile) {
          setPhone(profile.phone_number || '');
        }
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, user, navigate, location]);

  // Enhanced function to create a timezone-aware date object
  const createTimezoneAwareDate = (dateString, timeString) => {
    console.log('Creating timezone-aware date with:', { dateString, timeString });
    
    // Use the common timeUtils implementation for consistent behavior
    return timeUtils.createTimezoneAwareDate(dateString, timeString);
  };

  // Enhanced function to fetch taken slots with better format handling
  const fetchTakenSlots = async (date) => {
    try {
      console.log(`Fetching taken slots for date: ${date}`);
      
      // Call the appointmentService directly
      const takenSlotsResponse = await appointmentService.getTakenSlots(date);
      console.log('Raw taken slots response:', takenSlotsResponse);
      
      // Normalize the taken slots to ensure consistent format
      const rawSlots = takenSlotsResponse.data || [];
      const normalizedSlots = [];
      
      // Process each slot to ensure we have consistent formats
      rawSlots.forEach(slot => {
        if (!slot || typeof slot !== 'string') return;
        
        try {
          // Handle ISO datetime format (contains T)
          if (slot.includes('T')) {
            const dateParts = slot.split('T');
            if (dateParts.length > 1) {
              // Extract just the time part and remove any seconds/milliseconds
              const timePart = dateParts[1].split(':').slice(0, 2).join(':');
              normalizedSlots.push(timePart); // 24-hour format
              normalizedSlots.push(timeUtils.to12Hour(timePart)); // 12-hour format
            }
          } 
          // Handle 12-hour format (contains AM/PM)
          else if (slot.includes('AM') || slot.includes('PM')) {
            normalizedSlots.push(slot); // Original 12-hour format
            normalizedSlots.push(timeUtils.to24Hour(slot)); // 24-hour format
          } 
          // Handle 24-hour format (HH:MM)
          else if (slot.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
            normalizedSlots.push(slot); // Original 24-hour format
            normalizedSlots.push(timeUtils.to12Hour(slot)); // 12-hour format
          }
          // Any other format, just include as is
          else {
            normalizedSlots.push(slot);
          }
        } catch (formatError) {
          console.error('Error normalizing time slot:', formatError);
          // Still include the original slot
          normalizedSlots.push(slot);
        }
      });
      
      // Remove duplicates and set state
      const uniqueSlots = [...new Set(normalizedSlots)];
      console.log('Normalized taken slots:', uniqueSlots);
      setTakenSlots(uniqueSlots);
      
      return uniqueSlots;
    } catch (error) {
      console.error('Error fetching taken slots:', error);
      customToast.error('Failed to fetch availability. Using default slots.');
      return [];
    }
  };

  // Update when date changes
  useEffect(() => {
    if (appointmentDate) {
      fetchTakenSlots(appointmentDate);
    }
  }, [appointmentDate]);

  // Check if a slot is available - improved to handle different time formats
  const isSlotAvailable = (time) => {
    // Handle empty or invalid slots array
    if (!takenSlots || !Array.isArray(takenSlots) || takenSlots.length === 0) {
      return true;
    }
    
    console.log('Checking availability for time:', time);
    
    // Normalize the input time for consistent comparison
    let normalizedInputTime;
    
    // First convert to 24-hour format if needed
    if (time.includes('AM') || time.includes('PM')) {
      normalizedInputTime = timeUtils.to24Hour(time);
    } else {
      normalizedInputTime = time;
    }
    
    // Remove any seconds and just keep hours and minutes (HH:MM)
    if (normalizedInputTime.includes(':')) {
      const [hours, minutes] = normalizedInputTime.split(':');
      normalizedInputTime = `${hours.padStart(2, '0')}:${minutes.substring(0, 2).padStart(2, '0')}`;
    }
    
    console.log('Normalized input time for comparison:', normalizedInputTime);
    
    // Also generate 12-hour format for comparison
    const inputTime12h = timeUtils.to12Hour(normalizedInputTime);
    
    // Get all normalized forms of the time for comparison
    const timeFormatsToCheck = [
      normalizedInputTime,                        // 24-hour (HH:MM)
      inputTime12h,                               // 12-hour (H:MM AM/PM)
      inputTime12h.replace(' 0', ' ').replace('0', '') // Fix padding for 12-hour
    ];
    
    console.log('Time formats to check:', timeFormatsToCheck);
    
    // Check against normalized taken slots
    const isUnavailable = takenSlots.some(slot => {
      // Skip invalid slots
      if (!slot || typeof slot !== 'string') return false;
      
      // Normalize the slot time for comparison
      let normalizedSlotTime = slot;
      
      // Handle ISO datetime format (contains T)
      if (slot.includes('T')) {
        const dateParts = slot.split('T');
        if (dateParts.length > 1) {
          // Extract just the time part and remove any seconds/milliseconds
          normalizedSlotTime = dateParts[1].split(':').slice(0, 2).join(':');
        }
      }
      
      // For 12-hour format, convert to 24-hour
      if (slot.includes('AM') || slot.includes('PM')) {
        normalizedSlotTime = timeUtils.to24Hour(slot);
      }
      
      // Ensure format is HH:MM by removing seconds and padding hours
      if (normalizedSlotTime.includes(':')) {
        const [hours, minutes] = normalizedSlotTime.split(':');
        normalizedSlotTime = `${hours.padStart(2, '0')}:${minutes.substring(0, 2).padStart(2, '0')}`;
      }
      
      // Check all formats of the input time against the normalized slot time
      return timeFormatsToCheck.some(format => normalizedSlotTime === format);
    });
    
    console.log(`Time ${time} is ${isUnavailable ? 'unavailable' : 'available'}`);
    return !isUnavailable;
  };

  // Handle date selection
  const handleDateSelection = async (e) => {
    const newDate = e.target.value;
    setAppointmentDate(newDate);
    setErrors({...errors, date: ''});
    
    // Immediately fetch taken slots and check availability
    if (newDate) {
      const newTakenSlots = await fetchTakenSlots(newDate);
      if (selectedTimeSlot && newTakenSlots.includes(selectedTimeSlot)) {
        setSelectedTimeSlot('');
        customToast.warning('This time slot is not available on the selected date');
      }
    }
  };

  // Update time slot selection to prevent selecting unavailable slots
  const handleTimeSlotSelection = (time) => {
    if (!isSlotAvailable(time)) return;
    setSelectedTimeSlot(time);
    setErrors({...errors, time: ''});
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};

    if (!firstName.trim()) {
      newErrors.firstName = 'Please enter your first name';
      isValid = false;
    } else {
      newErrors.firstName = '';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Please enter your last name';
      isValid = false;
    } else {
      newErrors.lastName = '';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Allow phone format to be more flexible
    if (!phone || phone.trim().length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    } else {
      newErrors.phone = '';
    }

    if (!appointmentDate) {
      newErrors.date = 'Please select a date';
      isValid = false;
    } else {
      newErrors.date = '';
    }

    if (!selectedTimeSlot) {
      newErrors.time = 'Please select a time slot';
      isValid = false;
    } else {
      newErrors.time = '';
    }
    
    if (!appointmentPurpose) {
      newErrors.purpose = 'Please select a purpose for your appointment';
      isValid = false;
    } else {
      newErrors.purpose = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      customToast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    try {
      // Check authentication
      if (!isAuthenticated || !user) {
        customToast.error('Please log in to book an appointment');
        navigate('/login', { state: { returnPath: location.pathname } });
        setLoading(false);
        return;
      }
      
      // Validate date and time are selected
      if (!appointmentDate || !selectedTimeSlot) {
        customToast.error('Please select a date and time');
        setLoading(false);
        return;
      }
        // Create date in local time without timezone adjustment
      try {
        // Parse date and time components directly
        const [year, month, day] = appointmentDate.split('-').map(Number);
        
        // Convert time to 24-hour format if needed
        let time24 = selectedTimeSlot;
        if (selectedTimeSlot.includes('AM') || selectedTimeSlot.includes('PM')) {
          time24 = timeUtils.to24Hour(selectedTimeSlot);
        }
        const [hours, minutes] = time24.split(':').map(Number);
        
        // Create date directly with local values (no timezone conversion)
        const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
        
        // Log values for debugging
        console.log('Appointment submission details:', {
          appointmentDate,
          selectedTimeSlot,
          time24Format: time24,
          dateObject: localDate.toString(),
          isoString: localDate.toISOString()
        });
        
        // Format date string in ISO format for API but with consistent values
        // This uses a format that avoids timezone issues: "YYYY-MM-DDTHH:MM:00"
        const formattedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;          // Get selected doctor details
        const selectedDoctorData = doctors.find(d => d._id === selectedDoctor) || null;
          
        // Prepare appointment data for our backend API format
        const appointmentData = {
          doctor: selectedDoctorData ? `${selectedDoctorData.first_name} ${selectedDoctorData.last_name}` : selectedDoctor,
          doctorId: selectedDoctorData?._id || selectedDoctor,
          date: appointmentDate,  // YYYY-MM-DD format
          time: time24, // 24-hour format as required by the backend
          reason: appointmentPurpose ? purposeOptions.find(p => p.value === appointmentPurpose)?.label : `Appointment booked by ${firstName} ${lastName}`,
          doctorEmail: selectedDoctorData?.email || 'doctor@smartcare.com',
          doctorSpecialty: selectedDoctorData?.specialty || 'Specialist'
        };
          console.log('Submitting appointment data:', appointmentData);
        
        // Submit to API with complete error handling
        try {
          // Use the correct authorization header format for our backend
          const token = localStorage.getItem('token');
          console.log('Using auth token:', token ? 'Token found' : 'No token');
          
          // Make a direct fetch request to ensure correct headers and endpoint
          const response = await fetch(`${API_BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify(appointmentData)
          });
          
          console.log('API response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = 'Failed to create appointment';
            try {
              const errorData = await response.json();
              errorMessage = errorData.msg || errorMessage;
              console.error('Error response data:', errorData);
            } catch (jsonError) {
              console.error('Failed to parse error response:', jsonError);
            }
            throw new Error(errorMessage);
          }
          
          const data = await response.json();          console.log('Appointment created successfully:', data);          // Redirect to success page with appointment details
          navigate('/appointment/success',{ 
            state: { 
              appointment: data.appointment,
              message: data.msg,
              firstName,
              lastName,
              email,
              phone,
              appointmentDate,
              selectedTimeSlot,
              selectedDoctor,
              appointmentPurpose: appointmentPurpose ? purposeOptions.find(p => p.value === appointmentPurpose)?.label : null
            }
          });
        } catch (apiError) {
          console.error('API Error Details:', apiError);
          if (apiError.response?.status === 400) {
            customToast.error(apiError.response.data?.detail || 'Invalid appointment data');
          } else if (apiError.response?.status === 401) {
            customToast.error('Please log in again to continue');
            navigate('/login', { state: { returnPath: location.pathname } });
          } else if (apiError.response?.status === 404) {
            customToast.error('Appointment service unavailable. Please try again later.');
            console.error('API endpoint not found. Check server configuration.');
          } else if (apiError.response?.status === 500) {
            customToast.error('Server error. Please try again later.');
          } else {
            customToast.error('Failed to book appointment. Please try again.');
            console.error('Error details:', apiError.message);
          }
        }
      } catch (dateError) {
        console.error('Date formatting error:', dateError);
        customToast.error('Invalid date format');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      customToast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Format date to display as Monday, May 26, 2025
  const getFormattedDate = (dateString) => {
    if (!dateString) return 'No date selected';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Effect to select doctor based on purpose for non-premium users
  useEffect(() => {
    if (user?.role !== 'premium' && appointmentPurpose && doctors.length > 0) {
      const purposeLabel = purposeOptions.find(p => p.value === appointmentPurpose)?.label || '';
      let matchingSpecialty = 'Pulmonologist'; // Default specialty
      
      // Map purpose to specialties
      if (purposeLabel.includes('Pneumonia')) {
        matchingSpecialty = 'Pulmonologist';
      } else if (purposeLabel.includes('Scan')) {
        matchingSpecialty = 'Radiologist';
      } else if (purposeLabel.includes('Check-up')) {
        matchingSpecialty = 'General Practitioner';
      } else if (purposeLabel.includes('Follow-up')) {
        matchingSpecialty = 'Internal Medicine';
      }
      
      // Find doctors with matching specialty
      const matchingDoctors = doctors.filter(d => 
        d.specialty && d.specialty.toLowerCase().includes(matchingSpecialty.toLowerCase())
      );
      
      if (matchingDoctors.length > 0) {
        // Select random doctor from matching ones
        const randomDoctor = matchingDoctors[Math.floor(Math.random() * matchingDoctors.length)];
        setSelectedDoctor(randomDoctor._id);
      } else if (doctors.length > 0) {
        // Fallback to any doctor if no matching specialty
        setSelectedDoctor(doctors[0]._id);
      }
    }
  }, [appointmentPurpose, doctors, user?.role]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="background-pattern"></div>
      
      <main className="appointment-container">
        <div className="max-w-5xl mx-auto my-8">          <div className="appointment-wrapper">
            {/* Main form content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setErrors({...errors, firstName: ''});
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setErrors({...errors, lastName: ''});
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({...errors, email: ''});
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors({...errors, phone: ''});
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
              
              {/* Right column - Appointment Time */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Select Appointment Time</h2>
                
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    id="appointmentDate"
                    min={getTodayDate()}
                    className={`w-full p-3 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    value={appointmentDate}
                    onChange={handleDateSelection}
                    placeholder="jj/mm/aaaa"
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Time Slot</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={cn(
                          "relative p-3 rounded-lg text-sm border transition-all duration-300 font-medium",
                          isSlotAvailable(time) 
                            ? selectedTimeSlot === time 
                              ? "border-primary bg-primary text-white shadow-md" 
                              : "border-gray-200 hover:border-primary hover:shadow-sm"
                            : "border-red-300 bg-red-50 text-gray-600 cursor-not-allowed overflow-hidden"
                        )}
                        onClick={() => handleTimeSlotSelection(time)}
                        disabled={!isSlotAvailable(time)}
                      >
                        {time}
                        {!isSlotAvailable(time) && (
                          <>
                            <div className="absolute inset-0 bg-red-50/80 backdrop-blur-[1px] rounded-lg border border-red-300 flex items-center justify-center z-10">
                              <Lock className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-[120%] h-[2px] bg-red-400 absolute rotate-45"></div>
                            </div>
                          </>
                        )}
                        {selectedTimeSlot === time && (
                          <Check className="absolute top-1 right-1 h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
                  {/* Doctor Selection (only for premium users) */}
                {user?.role === 'premium' && (
                  <div>
                    <label htmlFor="doctor" className="block text-sm font-medium mb-1">Select Doctor</label>
                    <select
                      id="doctor"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.first_name} {doctor.last_name} ({doctor.specialty})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* For non-premium users, show the selected doctor info */}
                {user?.role !== 'premium' && doctors.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <p className="text-sm font-medium text-blue-800 mb-1">Your Assigned Doctor</p>
                    <p className="text-blue-700">
                      {selectedDoctor ? (
                        <>
                          {doctors.find(d => d._id === selectedDoctor)?.first_name || ''} {doctors.find(d => d._id === selectedDoctor)?.last_name || ''} 
                          <span className="text-blue-500 text-sm ml-1">
                            ({doctors.find(d => d._id === selectedDoctor)?.specialty || 'Specialist'})
                          </span>
                        </>
                      ) : 'A doctor will be assigned based on availability'}
                    </p>
                  </div>
                )}
                
                {/* Appointment Purpose for all users */}
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium mb-1">Appointment Purpose</label>
                  <select
                    id="purpose"
                    className={`w-full p-3 border ${errors.purpose ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    value={appointmentPurpose}
                    onChange={(e) => {
                      setAppointmentPurpose(e.target.value);
                      setErrors({...errors, purpose: ''});
                    }}
                  >
                    <option value="">Select a purpose</option>
                    {purposeOptions.map(purpose => (
                      <option key={purpose.id} value={purpose.value}>
                        {purpose.label}
                      </option>
                    ))}
                  </select>
                  {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
                </div>
              </div>
            </div>
            
            {/* Confirmation Section */}
            <div className="mt-10 border-t pt-8 border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Confirm Appointment</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center">
                      <User className="h-4 w-4 mr-2" />Patient Name
                    </p>
                    <p className="font-medium">{firstName || '—'} {lastName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />Email
                    </p>
                    <p className="font-medium">{email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />Phone
                    </p>
                    <p className="font-medium">{phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />Date
                    </p>
                    <p className="font-medium">{getFormattedDate(appointmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />Time
                    </p>
                    <p className="font-medium">{selectedTimeSlot || '—'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center">
                      <i className="fas fa-user-md h-4 w-4 mr-2"></i>Doctor
                    </p>
                    <p className="font-medium">{selectedDoctor || '—'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center">
                      <i className="fas fa-clipboard-list h-4 w-4 mr-2"></i>Purpose
                    </p>
                    <p className="font-medium">
                      {appointmentPurpose 
                        ? purposeOptions.find(p => p.value === appointmentPurpose)?.label 
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  size="lg"
                  className="px-8"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Information</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Please note that all appointments are subject to availability and confirmation.
            </p>
            <p className="text-gray-700">
              After booking, you'll receive a confirmation email with details about your appointment.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowInfoDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleStepAppointmentPage;
