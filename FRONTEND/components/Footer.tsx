import React from 'react';
import { Shield, Phone, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="support" className="bg-zinc-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-display font-bold">PARASHIELD</span>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed">
              The revolutionary insurance provider for independent delivery professionals. Protecting your livelihood with AI/ML.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-yellow-400 uppercase tracking-wider">Emergency Support</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:1800RIDER" className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group">
                  <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-red-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <span className="font-bold">1-800-2424-600</span>
                </a>
              </li>
              <li>
                <a href="mailto:claims@riderguard.com" className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group">
                  <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-yellow-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="font-bold">claims@parashield.com</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-4 text-zinc-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coverage Disclosure</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" }
              ].map(({ Icon, label }, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label={`Follow us on ${label}`}
                >
                  <Icon size={24} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-sm font-bold">
          <p>© 2026 ParaShield Insurance Services. All rights reserved.</p>
          <div className="flex gap-8">
            <span>WCAG 2.1 Level AA Compliant</span>
            <span>Licensed in all 28 States</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
