import React from 'react';
import ComplaintForm from '../../components/dashboard/ComplaintForm';

const RaiseComplaint = () => {
  return (
    <div className="min-h-full py-8 px-4 sm:px-6 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 sm:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight text-center">
            Raise a Complaint
          </h1>
          <p className="text-slate-500 text-sm sm:text-base text-center mt-2 font-medium">
            Submit issues anonymously to improve your village services.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <ComplaintForm />
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;
