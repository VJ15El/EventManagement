import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Award, Heart, Target, Sparkles, Trophy, Rocket, MapPin, Clock, Phone, Mail, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "Event Excellence",
      description: "Creating memorable experiences through meticulous planning and execution"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Community First",
      description: "Building strong connections through shared experiences"
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Innovation Driven",
      description: "Leveraging technology to enhance event experiences"
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      title: "Passionate Team",
      description: "Dedicated professionals committed to your event success"
    }
  ];

  const stats = [
    { value: "500+", label: "Events Hosted" },
    { value: "50K+", label: "Happy Attendees" },
    { value: "100+", label: "Event Partners" },
    { value: "15+", label: "Cities Covered" }
  ];

  const services = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Corporate Events",
      description: "Conferences, seminars, and team building activities"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Cultural Events",
      description: "Music festivals, art exhibitions, and cultural celebrations"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Tech Events",
      description: "Hackathons, workshops, and tech conferences"
    }
  ];

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Call Us",
      value: "+91 80 4123 4567",
      subValue: "+91 98765 43210"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Us",
      value: "support@eventhub.com",
      subValue: "business@eventhub.com"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Visit Us",
      value: "123 Tech Park, Whitefield",
      subValue: "Bangalore, Karnataka 560066"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Event venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-6">Crafting Unforgettable Event Experiences</h1>
            <p className="text-xl text-gray-200">
              EventHub is India's premier event management platform, connecting organizers with attendees to create memorable moments that last a lifetime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To revolutionize the event management landscape by providing cutting-edge technology solutions that empower organizers and enhance attendee experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive event management solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.label}</h3>
                  <p className="text-gray-600">{info.value}</p>
                  <p className="text-gray-600">{info.subValue}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


