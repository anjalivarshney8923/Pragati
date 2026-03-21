import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full pb-8 pt-4 overflow-x-auto custom-scrollbar">
      <div className="flex justify-between items-center min-w-[max-content] md:min-w-0 px-4 max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isActive = currentStep === index + 1;
          
          return (
            <div key={index} className="flex relative items-center gap-2">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive || isCompleted ? 1.1 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors 
                    ${isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isActive 
                        ? 'bg-[#1E3A8A] text-white ring-4 ring-blue-100' 
                        : 'bg-gray-200 text-gray-500'}`}
                >
                  {isCompleted ? <Check className="w-5 h-5 text-white" /> : index + 1}
                </motion.div>
                <div className={`mt-2 text-xs hidden md:block w-max text-center font-medium
                  ${isActive ? 'text-[#1E3A8A] font-bold' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {step}
                </div>
              </div>
              
              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div className="w-8 md:w-16 h-1 bg-gray-200 -mt-6">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-green-500" 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
