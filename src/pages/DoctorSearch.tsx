import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { supabase, getDoctors } from '../lib/supabase';
import { getDoctorRecommendations } from '../lib/gemini';
import { Search, Loader2, UserRound, MapPin, Phone, Mail, Star, Filter, Calendar } from 'lucide-react';

type SearchFormData = {
  symptoms: string;
  location?: string;
  therapy_type?: string;
  specialization?: string;
};

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  therapy_type: string;
  experience_years: number;
  location: string;
  address: string;
  contact_number: string;
  email: string;
  rating: number;
  overview?: string;
  profile_link?: string;
};

function DoctorSearch() {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [therapyTypes, setTherapyTypes] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  
  const { register, handleSubmit, watch, setValue } = useForm<SearchFormData>();
  const watchedValues = watch();

  useEffect(() => {
    fetchUserProfile();
    fetchFilterOptions();
    // Initial doctor load
    fetchDoctors({});
  }, []);

  async function fetchUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          // Pre-fill location and therapy preference from user profile
          setValue('location', profile.location);
          setValue('therapy_type', profile.therapy_preference);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async function fetchFilterOptions() {
    try {
      // Get unique locations
      const { data: locationData } = await supabase
        .from('doctors')
        .select('location')
        .order('location');
      
      if (locationData) {
        const uniqueLocations = [...new Set(locationData.map(item => item.location))];
        setLocations(uniqueLocations);
      }
      
      // Get unique therapy types
      const { data: therapyData } = await supabase
        .from('doctors')
        .select('therapy_type')
        .order('therapy_type');
      
      if (therapyData) {
        const uniqueTherapies = [...new Set(therapyData.map(item => item.therapy_type))];
        setTherapyTypes(uniqueTherapies);
      }
      
      // Get unique specializations
      const { data: specializationData } = await supabase
        .from('doctors')
        .select('specialization');
      
      if (specializationData) {
        const allSpecializations = specializationData.map(item => 
          item.specialization.split(',').map((s: string) => s.trim())
        ).flat();
        const uniqueSpecializations = [...new Set(allSpecializations)];
        setSpecializations(uniqueSpecializations.sort());
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  }

  async function fetchDoctors(filters: any) {
    try {
      setLoading(true);
      const doctorsData = await getDoctors(filters);
      setDoctors(doctorsData || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: SearchFormData) => {
    try {
      setLoading(true);
      
      // Get AI recommendations if symptoms are provided
      if (data.symptoms) {
        const recommendation = await getDoctorRecommendations(
          data.symptoms, 
          userProfile || { 
            location: data.location || 'Unknown', 
            age: 30, 
            gender: 'Unknown',
            therapyType: data.therapy_type || 'allopathy'
          }
        );
        setAiRecommendation(recommendation);
      }

      // Build filters
      const filters: any = {};
      if (data.location) filters.location = data.location;
      if (data.therapy_type) filters.therapy_type = data.therapy_type;
      
      // For specialization, we need a more complex query
      // This is handled in the fetchDoctors function
      
      // Fetch doctors based on filters
      await fetchDoctors(filters);
    } catch (error) {
      console.error('Error searching doctors:', error);
      alert('Error searching for doctors!');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Search Form */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Search className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
            </div>
            <button
              onClick={toggleFilters}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your symptoms
              </label>
              <textarea
                {...register('symptoms')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Please describe your symptoms in detail..."
              />
            </div>

            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    {...register('location')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Any Location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Therapy Type
                  </label>
                  <select
                    {...register('therapy_type')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Any Therapy</option>
                    {therapyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    {...register('specialization')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Any Specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{loading ? 'Searching...' : 'Search Doctors'}</span>
            </motion.button>
          </form>
        </motion.div>

        {/* AI Recommendation */}
        {aiRecommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-indigo-900 mb-4">AI Recommendation</h2>
            <p className="text-gray-700 whitespace-pre-line">{aiRecommendation}</p>
          </motion.div>
        )}

        {/* Doctors List */}
        {doctors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Available Doctors</h2>
              <p className="text-gray-600">{doctors.length} doctors found</p>
            </div>
            
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <UserRound className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-indigo-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray-700 font-medium">{doctor.rating.toFixed(1)}</span>
                  </div>
                </div>

                {doctor.overview && (
                  <p className="mt-4 text-gray-600">{doctor.overview}</p>
                )}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{doctor.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span>{doctor.contact_number}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Star className="w-5 h-5" />
                    <span>{doctor.experience_years} years of experience</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Book Appointment</span>
                  </motion.button>
                  
                  {doctor.profile_link && (
                    <motion.a
                      href={doctor.profile_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-100 transition-colors text-center font-medium"
                    >
                      View Full Profile
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}

export default DoctorSearch;