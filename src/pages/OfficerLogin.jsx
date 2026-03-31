import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, Mail, Lock } from 'lucide-react';
import { authService } from '../services/api';

import AuthLayout from '../components/auth/AuthLayout';
import SecureInputField from '../components/auth/SecureInputField';
import AlertBanner from '../components/auth/AlertBanner';

const OfficerLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Connect to the new /api/auth/login-officer endpoint
      const response = await authService.loginOfficer({
        email: data.email,
        password: data.password
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('officer', JSON.stringify(response));
        navigate('/governance/overview'); 
      }
    } catch (err) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.message || "Invalid email or password. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Governance Portal" 
      subtitle="Officer Secure Login"
    >
      <AlertBanner 
        type="warning" 
        title="Unauthorized Access Prohibited"
        message="This is a Restricted Access Government Portal. Access is only permitted for registered and approved officials." 
      />

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl animate-shake">
           <p className="text-red-700 text-sm font-bold uppercase tracking-tight flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2" />
              {errorMessage}
           </p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6 pt-4">
        <SecureInputField
          label="Official Email ID"
          name="email"
          type="email"
          icon="mail"
          placeholder="e.g. officer@nic.in"
          register={register}
          error={errors.email}
          required="Official email address is mandatory"
        />

        <SecureInputField
          label="Secret Password"
          name="password"
          type="password"
          icon="lock"
          placeholder="Enter secure password"
          register={register}
          error={errors.password}
          required="Password is required"
        />

        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest pt-2">
           <button type="button" className="text-blue-600 hover:text-blue-900 flex items-center">
              Recovery Option
           </button>
           <button type="button" className="text-slate-500 hover:text-slate-900 flex items-center">
              Helpdesk Support
           </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 bg-[#1E3A8A] text-white font-extrabold uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] hover:shadow-2xl active:scale-[0.98] transition-all relative overflow-hidden group ${isLoading ? 'opacity-90' : ''}`}
        >
          {isLoading ? (
             <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                VERIFYING...
             </div>
          ) : (
            <span className="flex items-center justify-center">
               SECURE LOGIN
               <LogIn className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>

        <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Account Administration</p>
            <Link to="/officer-register" className="inline-flex items-center px-10 py-3 border-2 border-[#138808] text-[#138808] rounded-full text-xs font-extrabold uppercase tracking-widest hover:bg-[#138808] hover:text-white transition-all shadow-sm">
               New Registration Request
            </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OfficerLogin;
