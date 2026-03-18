import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Features from '../components/Features';
import Portals from '../components/Portals';
import DashboardPreview from '../components/DashboardPreview';
import HowItWorks from '../components/HowItWorks';
import Initiatives from '../components/Initiatives';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <About />
        <Features />
        <Portals />
        <DashboardPreview />
        <HowItWorks />
        <Initiatives />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
