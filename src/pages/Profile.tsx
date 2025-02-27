import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { supabase, getUser } from '../lib/supabase';
import { User, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

type ProfileFormData = {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  location: string;
  therapy_preference: string;
  email: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
};

function Profile() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          Object.entries(profile).forEach(([key, value]) => {
            setValue(key as keyof ProfileFormData, value);
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setNotification(null);
      
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user?.id,
          ...data,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      
      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        type: 'error',
        message: 'Error updating profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-4 mb-8">
          <User className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Health Profile</h1>
        </div>
        
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              notification.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                {...register('age', { required: 'Age is required', min: 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('weight', { min: 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('height', { min: 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                {...register('location', { required: 'Location is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Therapy Type
              </label>
              <select
                {...register('therapy_preference', { required: 'Therapy preference is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select therapy type</option>
                <option value="allopathy">Allopathy</option>
                <option value="ayurvedic">Ayurvedic</option>
                <option value="homeopathy">Homeopathy</option>
                <option value="regenerative">Regenerative</option>
              </select>
              {errors.therapy_preference && (
                <p className="mt-1 text-sm text-red-600">{errors.therapy_preference.message}</p>
              )}
            </div>
          </div>
          
          {/* Medical History Section */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History
                </label>
                <textarea
                  {...register('medical_history')}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="List any significant medical conditions or past surgeries..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <textarea
                  {...register('allergies')}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="List any allergies to medications, foods, or other substances..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <textarea
                  {...register('current_medications')}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="List any medications you are currently taking..."
                />
              </div>
            </div>
          </div>

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
              <Save className="w-5 h-5" />
            )}
            <span>{loading ? 'Saving...' : 'Save Profile'}</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default Profile;