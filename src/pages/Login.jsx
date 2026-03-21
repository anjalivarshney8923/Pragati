import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Lock, User } from 'lucide-react';

import InputField from '../components/InputField';
import Button from '../components/Button';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Mock API call
  const loginUser = async (data) => {
    setIsLoading(true);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login Payload:', data);
      navigate('/dashboard'); // Mock redirect
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Branding / Illustration */}
        <div className="md:w-5/12 bg-[#1E3A8A] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Background circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -ml-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF9933] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4"
            >
              <Building2 className="w-12 h-12 text-[#138808]" />
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-4">
                PRAGATI
                <span className="block text-xl font-normal mt-2 text-blue-200">
                  Villager Portal (GramSetu)
                </span>
              </h1>
              <p className="text-blue-100 max-w-sm mx-auto leading-relaxed">
                Empowering rural citizens through digital governance. Access government services, schemes, and panchayat updates directly.
              </p>
            </div>
            
            <div className="mt-8">
              <div className="w-20 h-1 bg-[#FF9933] rounded-full mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-7/12 p-8 md:p-12 sm:px-16 lg:px-20 bg-white relative flex flex-col justify-center">
          
          <div className="md:hidden flex items-center justify-center mb-8">
            <Building2 className="w-10 h-10 text-[#1E3A8A] mr-3" />
            <h2 className="text-2xl font-bold text-[#1E3A8A]">PRAGATI</h2>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to access your digital GramSetu services.</p>
          </div>

          <motion.form
            key="password-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit(loginUser)}
            className="space-y-6"
          >
            <InputField
              label="Mobile Number"
              name="mobile"
              icon={User}
              placeholder="Enter your registered mobile number"
              {...register('mobile', { required: 'Mobile is required' })}
              error={errors.mobile}
            />
            
            <InputField
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="Enter your secure password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#1E3A8A] focus:ring-[#1E3A8A] border-gray-300 rounded"
                  {...register('remember')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-slate-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-medium text-[#1E3A8A] hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full text-lg py-3 shadow-md mt-6">
              Login
            </Button>
          </motion.form>

          <div className="mt-10 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              New user?{' '}
              <Link to="/register" className="font-semibold text-[#138808] hover:underline transition-colors">
                Register here
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
