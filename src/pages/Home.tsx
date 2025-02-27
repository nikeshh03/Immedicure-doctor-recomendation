import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Heart, CheckCircle, ArrowRight } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="w-6 h-6 text-indigo-600" />,
      title: "AI-Powered Doctor Search",
      description: "Find the perfect doctor based on your symptoms and preferences using our advanced AI technology."
    },
    {
      icon: <UserPlus className="w-6 h-6 text-indigo-600" />,
      title: "Personalized Health Profile",
      description: "Create your health profile for tailored recommendations and better healthcare outcomes."
    },
    {
      icon: <Heart className="w-6 h-6 text-indigo-600" />,
      title: "Comprehensive Health Tracking",
      description: "Monitor your health journey and medical history all in one secure place."
    }
  ];

  const testimonials = [
    {
      quote: "Immedicure helped me find the perfect specialist for my condition when I was struggling to get proper care.",
      author: "Sarah J.",
      role: "Patient"
    },
    {
      quote: "The AI recommendations were spot on. I found a doctor who specialized in exactly what I needed.",
      author: "Michael T.",
      role: "Patient"
    },
    {
      quote: "As a healthcare provider, I appreciate how Immedicure connects me with patients who truly need my expertise.",
      author: "Dr. Lisa R.",
      role: "Cardiologist"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6"
            >
              Your AI-Powered <br />
              Healthcare Companion
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 mb-8"
            >
              Find the right doctor for your needs with personalized AI recommendations based on your symptoms and preferences.
            </motion.p>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Find Doctors</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Create Profile
              </motion.button>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
              alt="Healthcare professionals"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">How Immedicure Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform uses advanced AI to connect you with the right healthcare providers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.img
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
              alt="Doctor with patient"
              className="rounded-2xl shadow-xl w-full"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">
              Why Choose Immedicure?
            </h2>
            <div className="space-y-4">
              {[
                "AI-powered doctor recommendations based on your symptoms",
                "Find specialists that match your therapy preferences",
                "Secure storage of your medical history and preferences",
                "Easy appointment booking with top-rated doctors",
                "Personalized health insights and recommendations"
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
              className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index }}
                className="bg-indigo-800 p-6 rounded-xl"
              >
                <p className="text-lg mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-indigo-300">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">
          Ready to find your perfect doctor?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of patients who have found the right healthcare provider through Immedicure.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/search')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Start Your Search Now
        </motion.button>
      </section>
    </motion.div>
  );
}

export default Home;