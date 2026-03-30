import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, UserCheck, Smartphone, Landmark, Mail, Lock, Upload, MapPin, Hash, Briefcase } from 'lucide-react';
import { authService } from '../services/api';

import AuthLayout from '../components/auth/AuthLayout';
import SecureInputField from '../components/auth/SecureInputField';
import FileUploadSecure from '../components/auth/FileUploadSecure';
import AlertBanner from '../components/auth/AlertBanner';

const OfficerRegister = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [govId, setGovId] = useState(null);
  const [appointmentLetter, setAppointmentLetter] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleRegister = async (data) => {
    if (step < 3) {
       nextStep();
       return;
    }
    
    if (!govId || !appointmentLetter) {
       setErrorMessage("Mandatory: Official Government identification and Appointment Letter are required.");
       return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("employeeId", data.employeeId);
      formData.append("password", data.password);
      formData.append("department", data.department);
      formData.append("designation", data.designation);
      formData.append("state", data.state);
      formData.append("district", data.district);
      formData.append("govtIdFile", govId);
      formData.append("appointmentLetterFile", appointmentLetter);

      const response = await authService.registerOfficer(formData);
      
      if (response) {
        alert("Registration request submitted successfully. Please await administrative approval.");
        navigate('/officer-login');
      }
    } catch (err) {
      console.error("Registration Error:", err);
      const msg = err.response?.data?.message || "Registration failed. Verify all data and try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const stepsMetadata = [
    { title: "Personal Details", icon: UserCheck },
    { title: "Service Details", icon: Briefcase },
    { title: "Verification", icon: Landmark }
  ];

  return (
    <AuthLayout 
      title="Officer Registration" 
      subtitle="Restricted Government Access"
    >
      <AlertBanner 
        type="info"
        title="Admin Verification Active"
        message="All registration requests are scrutinized and manually approved by the State Administration Department."
      />

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
           <p className="text-red-700 text-sm font-bold uppercase tracking-tight flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2" />
              {errorMessage}
           </p>
        </div>
      )}

      {/* Simplified Stepper */}
      <div className="flex items-center justify-between mb-12 relative px-4 max-w-sm mx-auto">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[#1E3A8A] transition-all duration-500 -translate-y-1/2 -z-10" 
          style={{ width: `${(step - 1) * 50}%` }}
        ></div>

        {stepsMetadata.map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step > i + 1 ? 'bg-[#138808] border-[#138808] text-white' : 
                step === i + 1 ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-lg scale-110 ring-4 ring-blue-50' : 
                'bg-white border-slate-200 text-slate-300'
              }`}
            >
              {step > i + 1 ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleRegister)} className="space-y-6 min-h-[420px]">
        <AnimatePresence mode="wait">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <SecureInputField label="Full Name (Official)" name="fullName" icon="user" register={register} error={errors.fullName} required="Full name is mandatory" />
              <SecureInputField label="Official Email ID" name="email" type="email" icon="mail" register={register} error={errors.email} required="Official email required" />
              <SecureInputField label="Direct Mobile Number" name="mobile" icon="smartphone" placeholder="Enter 10-digit number" register={register} error={errors.mobile} required="Direct mobile number required" />
              <div className="grid grid-cols-2 gap-4">
                 <SecureInputField label="Password" name="password" type="password" icon="lock" register={register} required="Password mandatory" />
                 <SecureInputField label="Employee ID" name="employeeId" icon="hash" register={register} required="ID is required" />
              </div>
            </motion.div>
          )}

          {/* STEP 2: SERVICE DETAILS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                 <SecureInputField label="State" name="state" icon="mapPin" register={register} required="State mandatory" />
                 <SecureInputField label="District" name="district" icon="mapPin" register={register} required="District mandatory" />
              </div>
              <SecureInputField label="Department" name="department" icon="landmark" placeholder="e.g. Rural Development" register={register} required="Department mandatory" />
              <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Designation</label>
                  <select 
                    {...register("designation", { required: true })}
                    className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-[#1E3A8A] focus:ring-4 focus:ring-blue-100 font-bold uppercase tracking-widest text-xs transition-all"
                  >
                      <option value="Gram Pradhan">Gram Pradhan</option>
                      <option value="Panchayat Secretary">Panchayat Secretary</option>
                      <option value="Block Dev Officer">Block Dev Officer</option>
                      <option value="District Magistrate">District Magistrate</option>
                      <option value="Village Headman">Village Headman</option>
                  </select>
              </div>
            </motion.div>
          )}

          {/* STEP 3: VERIFICATION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <FileUploadSecure label="Official / Govt ID" value={govId} onChange={setGovId} helperText="Aadhaar / Dept ID / Voter ID" />
              <FileUploadSecure label="Appointment Letter" value={appointmentLetter} onChange={setAppointmentLetter} helperText="Verification Document (PDF preferred)" />
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                 <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                   By submitting this request, you declare that all documents provided are genuine. Provision of fraudulent data will lead to legal action under IC & IT Act.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-4 pt-10">
           {step > 1 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="px-8 py-4 border-2 border-slate-200 text-slate-500 font-extrabold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all text-xs"
              >
                Back
              </button>
           )}
           <button
             type="submit"
             disabled={isLoading}
             className="flex-grow py-4 bg-[#1E3A8A] text-white font-extrabold uppercase tracking-widest rounded-xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] hover:shadow-2xl transition-all text-xs active:scale-[0.98]"
           >
             {isLoading ? (
                <div className="flex items-center justify-center">
                   <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                   SUBMITTING...
                </div>
             ) : (step === 3 ? "SUBMIT REGISTRATION" : "NEXT STEP")}
           </button>
        </div>

        <div className="text-center pt-8">
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
               Registered already? {' '}
               <Link to="/officer-login" className="text-blue-700 hover:underline">Sign In to Dashboard</Link>
            </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OfficerRegister;
