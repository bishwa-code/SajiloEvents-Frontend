import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-blue-400 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="hover:text-blue-400 transition-colors"
                >
                  Posts
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/birendraitclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Contact Info</h3>
            <p className="mb-0.5">Email: contact@sajiloevents.com</p>
            <p className="mb-0.5">Phone: +977-9876543210</p>
            <p>Tel: 051-529494</p>
          </div>

          {/* Campus Info */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Campus Info</h3>
            <p className="mb-0.5">Birendra Multiple Campus</p>
            <p className="mb-0.5">Bharatpur, Chitwan, Nepal</p>
            <p>Tel: 056-520253</p>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Follow Us</h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500 transition-colors duration-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-sky-400 transition-colors duration-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-500 transition-colors duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors duration-300"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        <p className="text-sm border-t border-gray-700 pt-4">
          Built with ❤️ by BBB, 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
