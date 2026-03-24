import React, { useState } from 'react';
import { MapPin, Navigation, Trash2, CheckCircle2 } from 'lucide-react';
import InputField from '../ui/InputField';
import TextArea from '../ui/TextArea';
import SelectDropdown from '../ui/SelectDropdown';
import ImageUploader from '../ui/ImageUploader';
import Button from '../Button';
import AlertBox from '../ui/AlertBox';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { label: 'Water', value: 'water' },
    { label: 'Electricity', value: 'electricity' },
    { label: 'Roads', value: 'roads' },
    { label: 'Sanitation', value: 'sanitation' },
    { label: 'Others', value: 'others' },
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
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      // Just simulate for UI
      setFormData(prev => ({ ...prev, location: 'Lat: 28.6139, Lng: 77.2090 (Simulated)' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Log form data to console
    const submittedData = {
      ...formData,
      images: images.map(img => img.file.name)
    };
    console.log("Complaint Submitted: ", submittedData);
    
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
        <CheckCircle2 size={64} className="text-green-500 mb-2" />
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Complaint Submitted</h3>
        <p className="text-slate-600 max-w-sm mb-6">
          Your complaint has been successfully registered on the portal. An assigned officer will review it shortly.
        </p>
        <Button onClick={() => { setSubmitted(false); clearForm(); }} variant="outline">
          Raise Another Complaint
        </Button>
      </div>
    );
  }

  const isFormValid = formData.title.trim() && formData.category && formData.description.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      <AlertBox type="secure" className="mb-2">
        <span className="font-semibold text-slate-800 block mb-1">Anonymity Notice</span>
        This complaint is completely anonymous. Your identity will not be shared with anyone.
      </AlertBox>

      <div className="space-y-6">
        <InputField 
          id="title" 
          label="Complaint Title" 
          required 
          placeholder="E.g., Broken water pipe near main square" 
          value={formData.title}
          onChange={handleInputChange}
        />

        <SelectDropdown 
          id="category"
          label="Category"
          required
          placeholder="Select a category"
          options={categories}
          value={formData.category}
          onChange={handleInputChange}
        />

        <TextArea 
          id="description"
          label="Description"
          required
          rows={4}
          placeholder="Please provide specific details about the issue..."
          value={formData.description}
          onChange={handleInputChange}
        />

        <div className="w-full">
          <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
            Location (Optional)
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
                placeholder="Enter landmark or location area"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleLocationClick} className="flex-shrink-0 px-4 whitespace-nowrap hidden sm:flex">
              <Navigation size={18} className="mr-2" />
              Use Current Location
            </Button>
            <Button type="button" variant="outline" onClick={handleLocationClick} className="flex-shrink-0 px-4 sm:hidden">
              <Navigation size={18} />
            </Button>
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
          Clear Form
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={!isFormValid}
          isLoading={isLoading}
          className="w-full sm:w-auto px-8"
        >
          Submit Complaint
        </Button>
      </div>
    </form>
  );
};

export default ComplaintForm;
