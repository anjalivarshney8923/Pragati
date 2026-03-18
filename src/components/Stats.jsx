import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const Counter = ({ from, to, duration = 2, prefix = "", suffix = "" }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = prefix + Math.floor(value).toLocaleString('en-IN') + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView, prefix, suffix]);
  
  return <span ref={nodeRef} className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] min-w-[120px] inline-block" />;
};

const Stats = () => {
  const stats = [
    { id: 1, label: 'Villages Connected', to: 500, suffix: '+', prefix: '' },
    { id: 2, label: 'Citizens Registered', to: 10000, suffix: '+', prefix: '' },
    { id: 3, label: 'Govt Funds Tracked', to: 50, suffix: 'M', prefix: '₹' },
    { id: 4, label: 'Issues Resolved', to: 200, suffix: '+', prefix: '' },
  ];

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="bg-gradient-to-r from-blue-50 via-white to-orange-50 rounded-3xl shadow-lg border border-gray-100 p-10 md:p-14 -mt-24 relative z-20 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col items-center justify-center text-center ${index !== 0 ? 'pt-8 sm:pt-0' : ''}`}
              >
                <Counter from={0} to={stat.to} suffix={stat.suffix} prefix={stat.prefix} />
                <p className="mt-3 text-sm md:text-base font-medium text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
