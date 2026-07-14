import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Navigation, Trash2, AlertCircle } from 'lucide-react';
import { complaintService, geoService } from '../../services/api';
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
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
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
    setLocationSuccess(false);
    setLocationError('');
    setShowManualLocation(false);
    setManualAddress('');
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsFetchingLocation(true);
    setLocationError('');
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        try {
          const response = await geoService.reverseGeocode(latitude, longitude);
          if (response && response.displayName) {
            setFormData(prev => ({ ...prev, location: response.displayName }));
            setLocationSuccess(true);
          } else {
            const readableLocation = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
            setFormData(prev => ({ ...prev, location: readableLocation }));
            setLocationSuccess(true);
          }
        } catch (err) {
          console.error("Reverse geocoding failed, falling back to coordinates:", err);
          const readableLocation = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          setFormData(prev => ({ ...prev, location: readableLocation }));
          setLocationSuccess(true);
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        let msg = "Failed to retrieve location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location access or enter address manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location information unavailable. You can enter the address manually.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location retrieval timed out. You can enter the address manually.";
        }
        setLocationError(msg);
        setShowManualLocation(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) {
      setLocationError("Please enter a valid address.");
      return;
    }
    
    setIsGeocoding(true);
    setLocationError('');
    setLocationSuccess(false);
    
    try {
      const response = await geoService.geocodeAddress(manualAddress);
      if (response && response.latitude && response.longitude) {
        setCoordinates({ lat: response.latitude, lng: response.longitude });
        setFormData(prev => ({ ...prev, location: response.displayName || manualAddress }));
        setLocationSuccess(true);
      } else {
        setLocationError("Could not resolve address to coordinates. Please try another address.");
      }
    } catch (err) {
      console.error("Geocoding manual address failed:", err);
      setLocationError("Geocoding service unavailable. Please try again later.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coordinates.lat || !coordinates.lng) {
      setLocationError("Please capture your current location or enter an address before submitting.");
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('category', formData.category);
      payload.append('description', formData.description);
      payload.append('location', formData.location);
      payload.append('latitude', coordinates.lat);
      payload.append('longitude', coordinates.lng);

      if (images && images.length > 0) {
        images.forEach(img => {
          if (img.file) {
            payload.append('images', img.file);
          }
        });
        payload.append('image', images[0].file); // Backwards compatibility for single field
      }

      await complaintService.createComplaint(payload);

      setIsLoading(false);
      setSubmitted(true);
      
      setTimeout(() => {
        navigate('/dashboard/complaints');
      }, 2500);

    } catch (error) {
      console.error("Complaint Submission Failed: ", error);
      const status = error?.response?.status;
      const data = error?.response?.data;
      const serverMsg = data?.message || data || error?.message;
      let alertMsg = serverMsg ? `${serverMsg} ${status ? `(status ${status})` : ''}` : t('raiseComplaint.failedToSubmit');
      
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

  const isFormValid = formData.title.trim() && formData.category && formData.description.trim() && locationSuccess;

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
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Complaint Location (GPS or Address)
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <Button 
                type="button" 
                variant={locationSuccess && !showManualLocation ? "outline" : "primary"} 
                onClick={handleLocationClick} 
                disabled={isFetchingLocation || isLoading} 
                className={`flex-grow py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${locationSuccess && !showManualLocation ? 'border-green-500 text-green-700 bg-green-50' : ''}`}
              >
                <Navigation size={20} className={isFetchingLocation ? 'animate-pulse' : ''} />
                {isFetchingLocation ? 'Accessing GPS...' : locationSuccess && !showManualLocation ? 'Location Detected Successfully' : 'Capture My Current Location'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowManualLocation(!showManualLocation);
                  setLocationError('');
                }}
                className="py-3 px-4 rounded-xl text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                {showManualLocation ? "Use GPS Detection" : "Enter Address Manually"}
              </Button>
            </div>
            
            {showManualLocation && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs text-slate-500 font-semibold">Enter your location manually. We will convert it to GPS coordinates for routing.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="e.g. Village Pipri, District Sonebhadra, UP"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gov-blue"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    disabled={isGeocoding || !manualAddress.trim()}
                    onClick={handleManualAddressSubmit}
                    className="px-4 py-2 text-sm"
                  >
                    {isGeocoding ? "Converting..." : "Verify Address"}
                  </Button>
                </div>
              </div>
            )}
            
            {locationSuccess && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold tracking-tight">Verified Location: {formData.location}</span>
              </div>
            )}

            {locationError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 shadow-sm">
                <AlertCircle size={16} />
                <p className="text-xs font-medium">{locationError}</p>
              </div>
            )}
          </div>
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
          disabled={!isFormValid || isLoading}
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
