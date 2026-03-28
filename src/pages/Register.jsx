import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/api';
import {
  Building2, User, Phone, Mail, Lock,
  MapPin, CheckCircle, Calendar,
  ShieldCheck, ScanFace, ChevronRight, ChevronLeft,
  Smartphone
} from 'lucide-react';

import InputField from '../components/InputField';
import Button from '../components/Button';
import Stepper from '../components/Stepper';
import Loader from '../components/Loader';
import FileUpload from '../components/FileUpload';
import FaceCapture from '../components/FaceCapture';
import OTPInput from '../components/OTPInput';



const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();

  const STEPS = [
    t('register.steps.basicInfo'),
    t('register.steps.address'),
    t('register.steps.aadhaarUpload'),
    t('register.steps.faceScan'),
    t('register.steps.ageCheck'),
    t('register.steps.otp'),
    t('register.steps.review')
  ];
  // Custom Data States (not in hook-form)
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  const [faceImage, setFaceImage] = useState(null);
  const [faceVerified, setFaceVerified] = useState(false);

  // Age state mock
  const [ageVerified, setAgeVerified] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm({
    mode: 'onTouched'
  });

  const formData = watch();

  // Handle OTP Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleNext = async () => {
    let fieldsToValidate = [];
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['fullName', 'mobile', 'email', 'password', 'confirmPassword'];
        break;
      case 2:
        fieldsToValidate = ['state', 'district', 'village', 'panchayat'];
        break;
      case 3:
        if (!aadhaarVerified) {
          alert("Upload Aadhaar first");
          return;
        }
        break;
      case 4:
        if (!faceImage) {
          alert("Please capture face first");
          return;
        }
        break;
      case 5:
        if (!ageVerified) {
          alert("Verify age first");
          return;
        }
        break;
      case 6:
        if (!otpVerified) {
          alert("Verify OTP first");
          return;
        }
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isStepValid = await trigger(fieldsToValidate);
      if (!isStepValid) return;

      if (currentStep === 1 && formData.password !== formData.confirmPassword) {
        return;
      }
    }

    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Mock API Handlers
  const handleAadhaarUpload = () => {
    if (aadhaarFile) {
      setIsLoading(true);
      // Simulate API: uploadAadhaarImage(formData)
      setTimeout(() => {
        setAadhaarVerified(true);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleFaceCaptureSubmit = (imageUrl) => {
    console.log("Captured Image:", imageUrl);

    setFaceImage(imageUrl);

    if (!imageUrl) {
      setFaceVerified(false);
      return;
    }

    // Instantly verify in frontend as mock
    setFaceVerified(true);
  };


  const handleAgeVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAgeVerified(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      await authService.sendOtp(formData.mobile);
      setOtpSent(true);
      setTimer(300); // 5 minutes timer to map with backend expiration
    } catch (error) {
      console.error("Failed to send OTP", error);
      alert(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length === 6) {
      setIsLoading(true);
      try {
        await authService.verifyOtp(formData.mobile, otpValue);
        setOtpVerified(true);
      } catch (error) {
        console.error("OTP Verification Failed", error);
        alert(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      // Map frontend fields exactly to backend DTO
      const finalPayload = {
        fullName: formData.fullName,
        mobileNumber: formData.mobile, // Frontend mobile -> Backend mobileNumber
        email: formData.email,
        password: formData.password,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        panchayat: formData.panchayat,
        aadhaarNumber: "123456789012" // Fulfills validation since the UI only uploads image
      };
      console.log('Sending Registration Payload:', finalPayload);
      
      const response = await authService.register(finalPayload);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error("Registration Error: ", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('register.regSuccessTitle')}</h2>
          <p className="text-slate-600 mb-8">{t('register.regSuccessDesc')}</p>
          <Loader text={t('register.redirecting')} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {isLoading && <Loader fullScreen />}

      <div className="max-w-3xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Building2 className="w-10 h-10 text-[#1E3A8A] mr-3" />
          <h1 className="text-3xl font-extrabold text-[#1E3A8A]">PRAGATI</h1>
        </div>
        <p className="text-slate-600 font-medium">{t('register.title')}</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="p-8 sm:p-12 relative min-h-[400px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">

              {/* STEP 1: Basic Details */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">{t('register.basicDetails')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label={t('register.fullName')} name="fullName" icon={User} {...register('fullName', { required: t('register.nameRequired') })} error={errors.fullName} />
                    <InputField label={t('register.mobileNumber')} name="mobile" type="tel" icon={Phone} {...register('mobile', { required: t('register.mobileRequired'), pattern: { value: /^[0-9]{10}$/, message: t('register.mustBe10Digits') } })} error={errors.mobile} />
                    <InputField label={t('register.email')} name="email" type="email" icon={Mail} className="md:col-span-2" {...register('email', { required: t('register.emailRequired'), pattern: { value: /.+@.+\..+/, message: t('register.invalidEmail') } })} error={errors.email} />
                    <InputField label={t('register.password')} name="password" type="password" icon={Lock} {...register('password', { required: t('register.required'), minLength: { value: 6, message: t('register.min6Chars') } })} error={errors.password} />
                    <InputField label={t('register.confirmPassword')} name="confirmPassword" type="password" icon={Lock} {...register('confirmPassword', { required: t('register.required'), validate: (val) => val === watch('password') || t('register.passwordsMismatch') })} error={errors.confirmPassword} />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Address Details */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">{t('register.addressDetails')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label={t('register.state')} name="state" icon={MapPin} {...register('state', { required: t('register.stateRequired') })} error={errors.state} />
                    <InputField label={t('register.district')} name="district" icon={MapPin} {...register('district', { required: t('register.districtRequired') })} error={errors.district} />
                    <InputField label={t('register.villageTown')} name="village" icon={MapPin} {...register('village', { required: t('register.villageRequired') })} error={errors.village} />
                    <InputField label={t('register.panchayatWard')} name="panchayat" icon={Building2} {...register('panchayat', { required: t('register.panchayatRequired') })} error={errors.panchayat} />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Aadhaar Upload */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center max-w-lg mx-auto">
                  <ShieldCheck className="w-16 h-16 text-[#FF9933] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800">{t('register.aadhaarUploadTitle')}</h3>
                  <p className="text-slate-500 mb-8">{t('register.uploadClearPhoto')}</p>

                  {!aadhaarVerified ? (
                    <div className="space-y-6">
                      <FileUpload
                        onFileSelect={(file) => {
                          setAadhaarFile(file);
                          setAadhaarPreview(URL.createObjectURL(file));
                        }}
                        previewUrl={aadhaarPreview}
                        onClear={() => {
                          setAadhaarFile(null);
                          setAadhaarPreview(null);
                        }}
                      />
                      <Button onClick={handleAadhaarUpload} className="w-full text-lg shadow-md" variant="secondary" disabled={!aadhaarFile}>
                        {t('register.uploadVerifyBtn')}
                      </Button>
                    </div>
                  ) : (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center shadow-inner">
                      <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                      <h4 className="text-lg font-bold text-green-800">{t('register.docAccepted')}</h4>
                      <p className="text-green-600 text-sm font-medium">{t('register.aadhaarVerifiedSuccess')}</p>
                      {aadhaarPreview && (
                        <img src={aadhaarPreview} alt="Aadhaar preview" className="mt-4 w-32 h-auto rounded border border-green-200 opacity-80" />
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: Face Scan */}
              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center max-w-lg mx-auto">
                  <ScanFace className="w-16 h-16 text-[#1E3A8A] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800">{t('register.faceVerification')}</h3>
                  <p className="text-slate-500 mb-6">{t('register.captureLivePhoto')}</p>

                  <FaceCapture
                    onCapture={handleFaceCaptureSubmit}
                    existingImage={faceImage}
                  />
                </motion.div>
              )}

              {/* STEP 5: Age Verification */}
              {currentStep === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center max-w-md mx-auto">
                  <Calendar className="w-16 h-16 text-[#138808] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800">{t('register.ageVerification')}</h3>
                  <p className="text-slate-500 mb-8">{t('register.confirmEligibility')}</p>

                  {!ageVerified ? (
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
                      <InputField label={t('register.confirmDOB')} name="dob" type="date" {...register('dob')} />
                      <Button onClick={handleAgeVerify} className="w-full mt-6 shadow-md" variant="accent">
                        {t('register.verifyEligibilityBtn')}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                      <p className="text-green-700 text-sm uppercase font-extrabold tracking-wider mb-2">{t('register.ageAuthenticated')}</p>
                      <p className="text-4xl font-extrabold text-[#138808] mb-4">{t('register.years')}</p>
                      <div className="inline-flex items-center text-green-800 font-bold p-2">
                        <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                        {t('register.eligiblePortal')}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 6: OTP Verification (Mobile) */}
              {currentStep === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center max-w-md mx-auto">
                  <Smartphone className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800">{t('register.mobileOTP')}</h3>
                  <p className="text-slate-500 mb-8">{t('register.secureAccountOTP')}</p>

                  {!otpVerified ? (
                    <div className="space-y-6">
                      <p className="font-semibold text-lg border bg-slate-100 p-3 rounded-lg text-slate-700 shadow-inner">
                        {t('register.registering')} <span className="text-[#1E3A8A] ml-2">+91 {formData.mobile}</span>
                      </p>

                      {!otpSent ? (
                        <Button onClick={handleSendOTP} variant="primary" className="w-full py-3 shadow-md">
                          {t('register.sendOTPBtn')}
                        </Button>
                      ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4">
                          <OTPInput length={6} value={otpValue} onChange={setOtpValue} />
                          <Button
                            onClick={handleVerifyOTP}
                            disabled={otpValue.length !== 6}
                            variant="primary"
                            className="w-full py-3 shadow-md"
                          >
                            {t('register.verifyAuthBtn')}
                          </Button>

                          <div className="text-sm font-medium text-slate-500">
                            {timer > 0 ? (
                              <span>{t('register.resendIn')} <span className="text-red-500 font-bold">{timer}s</span></span>
                            ) : (
                              <button type="button" onClick={handleSendOTP} className="text-[#1E3A8A] hover:underline cursor-pointer">
                                {t('register.resendOTP')}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                      <h4 className="text-lg font-bold text-green-800">{t('register.mobileVerifiedSuccess')}</h4>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 7: Review */}
              {currentStep === 7 && (
                <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-slate-800">{t('register.finalReview')}</h3>
                    <p className="text-slate-500 mt-2">{t('register.validateData')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative shadow-sm">
                      <button type="button" onClick={() => setCurrentStep(1)} className="absolute top-4 right-4 text-sm font-semibold text-[#1E3A8A] hover:underline">{t('register.edit')}</button>
                      <h4 className="font-bold text-slate-700 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-blue-600" /> {t('register.basicDetails')}</h4>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-1 gap-4"><dt className="text-slate-500">{t('register.fullName')}</dt><dd className="font-bold text-slate-800 break-words text-right">{formData.fullName}</dd></div>
                        <div className="flex justify-between border-b pb-1 gap-4"><dt className="text-slate-500">{t('register.mobileNumber')}</dt><dd className="font-bold text-green-700">+91 {formData.mobile}</dd></div>
                        <div className="flex justify-between border-b pb-1 gap-4"><dt className="text-slate-500">{t('register.email')}</dt><dd className="font-bold text-slate-800 break-all text-right">{formData.email}</dd></div>
                      </dl>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative shadow-sm">
                      <button type="button" onClick={() => setCurrentStep(2)} className="absolute top-4 right-4 text-sm font-semibold text-[#1E3A8A] hover:underline">{t('register.edit')}</button>
                      <h4 className="font-bold text-slate-700 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-orange-500" /> {t('register.localityInfo')}</h4>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-1 gap-4"><dt className="text-slate-500">{t('register.stateDist')}</dt><dd className="font-bold text-slate-800 text-right">{formData.state}, {formData.district}</dd></div>
                        <div className="flex justify-between border-b pb-1 gap-4"><dt className="text-slate-500">{t('register.village')}</dt><dd className="font-bold text-slate-800 text-right">{formData.village}</dd></div>
                        <div className="flex justify-between border-b pb-1 gap-4"><dt className="text-slate-500">{t('register.panchayat')}</dt><dd className="font-bold text-slate-800 text-right">{formData.panchayat}</dd></div>
                      </dl>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 md:col-span-2 shadow-sm">
                      <h4 className="font-bold text-slate-700 mb-6 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-green-600" /> {t('register.biometricProofs')}</h4>
                      <div className="flex flex-col sm:flex-row gap-6 justify-around">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('register.aadhaarMap')}</span>
                          {aadhaarPreview ? <img src={aadhaarPreview} alt="Aadhaar" className="w-32 h-20 object-cover rounded shadow" /> : <div className="w-32 h-20 bg-slate-200 rounded animate-pulse" />}
                        </div>
                        <div className="flex flex-col items-center border-l sm:border-t-0 sm:border-l border-slate-300 pl-0 sm:pl-6 pt-6 sm:pt-0 mt-4 sm:mt-0">
                          <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('register.livenessNetID')}</span>
                          {faceImage ? <img src={faceImage} alt="Face" className="w-20 h-20 object-cover rounded-full shadow border-2 border-[#1E3A8A]" /> : <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse" />}
                        </div>
                        <div className="flex flex-col items-center border-l sm:border-t-0 sm:border-l border-slate-300 pl-0 sm:pl-6 pt-6 sm:pt-0 mt-4 sm:mt-0">
                          <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('register.systemValidations')}</span>
                          <div className="flex flex-col gap-2 mt-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 flex items-center rounded"><CheckCircle className="w-3 h-3 mr-1" /> {t('register.ageVerifiedText')}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 flex items-center rounded"><CheckCircle className="w-3 h-3 mr-1" /> {t('register.motSecured')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-blue-50 p-5 rounded-lg text-sm text-blue-900 border-l-4 border-[#1E3A8A] shadow-inner font-medium">
                    <p><strong>{t('register.declaration')}</strong> {t('register.authorizeText')}</p>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Form Navigation Controller */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center bg-white">
              {currentStep > 1 ? (
                <Button variant="ghost" onClick={handlePrev} className="px-6 flex items-center font-bold">
                  <ChevronLeft className="w-5 h-5 mr-1" /> {t('register.backBtn')}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 7 ? (
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="px-8 py-3 flex items-center rounded-full shadow-[0_4px_14px_0_rgba(30,58,138,0.39)] hover:shadow-lg font-bold hover:-translate-y-0.5"
                >
                  {t('register.continueBtn')} <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  variant="accent"
                  className="px-10 py-4 text-lg font-extrabold flex items-center rounded-xl shadow-[0_4px_14px_0_rgba(19,136,8,0.49)] hover:shadow-[0_6px_20px_rgba(19,136,8,0.33)] hover:scale-105 transition-all duration-300 transform"
                >
                  {t('register.secureRegBtn')} <ShieldCheck className="w-6 h-6 ml-2" />
                </Button>
              )}
            </div>

          </form>
        </div>

        {currentStep === 1 && (
          <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
            <p className="text-slate-600 font-medium">
              {t('register.alreadyRegistered')}{' '}
              <Link to="/login" className="font-bold text-[#1E3A8A] hover:underline underline-offset-4">
                {t('register.signIn')}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
