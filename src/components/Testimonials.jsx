import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Ramesh Singh',
    role: 'Villager, Sonapur',
    content: '"Pragati helps us track how government funds are used in our village. Now, I know exactly when the new road will be completed without having to ask the Sarpanch multiple times."',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&auto=format&fit=crop'
  },
  {
    name: 'Sunita Devi',
    role: 'Self-Help Group Leader',
    content: '"Filing a complaint about the water supply took only five minutes on the portal. The issue was resolved in two days, and I received an SMS update on my phone. Transparent and fast!"',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1531123414780-305f8841da92?q=80&w=200&auto=format&fit=crop'
  },
  {
    name: 'Rajeev Sharma',
    role: 'Gram Panchayat Member',
    content: '"As an administrator, the governance portal makes tracking funds and updating villagers incredibly simple. It builds trust within the community and reduces miscommunication."',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=200&auto=format&fit=crop'
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#1E3A8A] text-white relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent blur-xl"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            Voice of the Citizens
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-blue-200"
          >
            Real stories from villagers and administrators experiencing digital governance.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-white/20 relative"
            >
              <FaQuoteLeft className="text-4xl text-[#FF9933]/50 absolute top-8 right-8 z-0" />
              
              <div className="flex text-[#FF9933] mb-6 relative z-10">
                {[...Array(test.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              
              <p className="text-gray-100 text-lg leading-relaxed mb-8 italic relative z-10">
                {test.content}
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/20 pt-6 mt-auto">
                <img src={test.avatar} alt={test.name} className="w-14 h-14 rounded-full border-2 border-[#138808] object-cover" />
                <div>
                  <h4 className="font-bold text-white text-lg">{test.name}</h4>
                  <p className="text-sm text-blue-300">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
