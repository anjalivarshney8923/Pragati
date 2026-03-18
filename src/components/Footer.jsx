import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#0f1d45] pt-20 pb-10 text-gray-300">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-gray-700 pb-12">
          
          {/* Brand & Mission */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FF9933] flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-full z-10 invert brightness-0" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">PRAGATI</h1>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Pragati is a state-of-the-art digital infrastructure empowering rural India through seamless fund observation and localized grievance administration.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-900/50 flex flex-col items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <FaFacebookF size={12}/>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-900/50 flex flex-col items-center justify-center text-white hover:bg-blue-400 transition-colors">
                <FaTwitter size={12}/>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-900/50 flex flex-col items-center justify-center text-white hover:bg-blue-800 transition-colors">
                <FaLinkedinIn size={12}/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Features', 'Transparency Dashboard', 'How It Works', 'Portals'].map((item, id) => (
                <li key={id}>
                  <a href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm hover:text-[#FF9933] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">Legal & Policies</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Use', 'Grievance Policy', 'RTI Info', 'Government Guidelines', 'Cyber Security Tips'].map((item, id) => (
                <li key={id}>
                  <a href="#" className="text-sm hover:text-[#FF9933] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">Contact Administration</h4>
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <span className="mt-1 text-[#FF9933]"><FaPhoneAlt size={14}/></span>
                  <div>
                    <a href="tel:1800111xxx" className="text-sm font-semibold hover:text-white transition-colors">1800-111-XXXX</a>
                    <p className="text-xs text-gray-500 mt-1">Toll Free, Mon-Sat 10am-6pm</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <span className="mt-1 text-[#FF9933]"><FaEnvelope size={14}/></span>
                  <div>
                    <a href="mailto:support@pragati.gov.in" className="text-sm font-semibold hover:text-white transition-colors">support@pragati.gov.in</a>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="text-center text-xs text-gray-500">
          <p className="mb-2 uppercase tracking-widest text-[#138808] font-bold">Government Digital Governance Initiative</p>
          <p className="mb-4 text-gray-400">
            For further information and official records, please refer to the official Block Development portals. Data privacy is strictly protected under National IT Policies.
          </p>
          <p>&copy; {new Date().getFullYear()} Pragati - Smart Village Governance Platform. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
