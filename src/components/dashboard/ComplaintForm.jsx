import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Trash2, CheckCircle2 } from 'lucide-react';
import { complaintService } from '../../services/api';
import InputField from '../ui/InputField';
import TextArea from '../ui/TextArea';
import SelectDropdown from '../ui/SelectDropdown';
import ImageUploader from '../ui/ImageUploader';
import Button from '../Button';
import AlertBox from '../ui/AlertBox';

const ComplaintForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const navigate = useNavigate();

  const categories = [
    { label: t('raiseComplaint.categories.water'), value: 'water' },
    { label: t('raiseComplaint.categories.electricity'), value: 'electricity' },
    { label: t('raiseComplaint.categories.roads'), value: 'roads' },
    { label: t('raiseComplaint.categories.sanitation'), value: 'sanitation' },
    { label: t('raiseComplaint.categories.others'), value: 'others' },
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const clearForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      location: '',
    });
    setImages([]);
    setCoordinates({ lat: null, lng: null });
    setLocationError('');
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setLocationError(t('raiseComplaint.locationNotSupported'));
      return;
    }

    setIsFetchingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        try {
          // Reverse geocoding using OpenStreetMap Nominatim API
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
             setFormData(prev => ({ ...prev, location: data.display_name }));
          } else {
             setFormData(prev => ({ ...prev, location: `Lat: ${latitude}, Lng: ${longitude}` }));
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setFormData(prev => ({ ...prev, location: `Lat: ${latitude}, Lng: ${longitude}` }));
        }
        setIsFetchingLocation(false);
      },
      (error) => {
        setIsFetchingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(t('raiseComplaint.locationPermissionDenied'));
        } else {
          setLocationError(t('raiseComplaint.locationFetchFailed'));
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
  const payload = new FormData();
  payload.append('title', formData.title);
  payload.append('category', formData.category);
  payload.append('description', formData.description);
  // Backend requires location; if user didn't provide, send a default value
  const locationToSend = formData.location && formData.location.trim() ? formData.location.trim() : 'Not specified';
  payload.append('location', locationToSend);
      if (coordinates.lat) payload.append('latitude', coordinates.lat);
      if (coordinates.lng) payload.append('longitude', coordinates.lng);

      if (images && images.length > 0 && images[0].file) {
        // Just upload the first image as backend accepts single MultipartFile
        payload.append('image', images[0].file);
      }

      await complaintService.createComplaint(payload);

      setIsLoading(false);
      setSubmitted(true);
      
      setTimeout(() => {
        navigate('/my-complaints');
      }, 2500);

    } catch (error) {
      console.error("Complaint Submission Failed: ", error);
      // Provide clearer error messages for debugging (status + server message + field errors)
      const status = error?.response?.status;
      const data = error?.response?.data;
      const serverMsg = data?.message || data || error?.message;
      let alertMsg = serverMsg ? `${serverMsg} ${status ? `(status ${status})` : ''}` : t('raiseComplaint.failedToSubmit');
      // If validation errors provided, append them
      if (data && data.errors && typeof data.errors === 'object') {
        const fieldMsgs = Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`);
        alertMsg += '\n' + fieldMsgs.join('\n');
      }
      alert(alertMsg);
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
        <CheckCircle2 size={64} className="text-green-500 mb-2" />
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{t('raiseComplaint.submittedTitle')}</h3>
        <p className="text-slate-600 max-w-sm mb-6">
          {t('raiseComplaint.submittedDesc')}
        </p>
        <Button onClick={() => { setSubmitted(false); clearForm(); }} variant="outline">
          {t('raiseComplaint.raiseAnother')}
        </Button>
      </div>
    );
  }

  const isFormValid = formData.title.trim() && formData.category && formData.description.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      <AlertBox type="secure" className="mb-2">
        <span className="font-semibold text-slate-800 block mb-1">{t('raiseComplaint.anonymityTitle')}</span>
        {t('raiseComplaint.anonymityNotice')}
      </AlertBox>

      <div className="space-y-6">
        <InputField 
          id="title" 
          label={t('raiseComplaint.complaintTitle')} 
          required 
          placeholder={t('raiseComplaint.complaintTitlePlaceholder')} 
          value={formData.title}
          onChange={handleInputChange}
        />

        <SelectDropdown 
          id="category"
          label={t('raiseComplaint.category')}
          required
          placeholder={t('raiseComplaint.categoryPlaceholder')}
          options={categories}
          value={formData.category}
          onChange={handleInputChange}
        />

        <TextArea 
          id="description"
          label={t('raiseComplaint.description')}
          required
          rows={4}
          placeholder={t('raiseComplaint.descriptionPlaceholder')}
          value={formData.description}
          onChange={handleInputChange}
        />

        <div className="w-full">
          <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
            {t('raiseComplaint.location')}
          </label>
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                id="location"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue outline-none transition-all placeholder:text-slate-400 bg-white shadow-sm"
                placeholder={t('raiseComplaint.locationPlaceholder')}
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleLocationClick} disabled={isFetchingLocation} className="flex-shrink-0 px-4 whitespace-nowrap hidden sm:flex">
              <Navigation size={18} className={`mr-2 ${isFetchingLocation ? 'animate-pulse text-gov-blue' : ''}`} />
              {isFetchingLocation ? t('raiseComplaint.fetchingLocation') : t('raiseComplaint.useCurrentLocation')}
            </Button>
            <Button type="button" variant="outline" onClick={handleLocationClick} disabled={isFetchingLocation} className="flex-shrink-0 px-4 sm:hidden">
              <Navigation size={18} className={isFetchingLocation ? 'animate-pulse text-gov-blue' : ''} />
            </Button>
          </div>
          {locationError && (
            <p className="text-red-500 text-xs font-medium mt-1">{locationError}</p>
          )}
        </div>

        <div className="pt-2">
          <ImageUploader onChange={setImages} maxImages={3} />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6 flex flex-col-reverse sm:flex-row gap-4 sm:justify-end">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={clearForm}
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        >
          <Trash2 size={18} className="mr-2" />
          {t('raiseComplaint.clearForm')}
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={!isFormValid}
          isLoading={isLoading}
          className="w-full sm:w-auto px-8"
        >
          {t('raiseComplaint.submitComplaint')}
        </Button>
      </div>
    </form>
  );
};

export default ComplaintForm;
