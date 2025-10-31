import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* Company Info */}
          <div className="footer__column">
            <h3 className="footer__title">Solvera</h3>
            <p className="footer__text">
              Crafting timeless luxury jewelry with unparalleled attention to detail and elegance. Every piece tells a story of sophistication and refined taste.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="#" className="footer__social-link" aria-label="Pinterest">
                <PinterestIcon />
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__column">
            <h4 className="footer__subtitle">Shop</h4>
            <ul className="footer__links">
              <li><Link to="/shop/rings" className="footer__link">Rings</Link></li>
              <li><Link to="/shop/necklaces" className="footer__link">Necklaces</Link></li>
              <li><Link to="/shop/earrings" className="footer__link">Earrings</Link></li>
              <li><Link to="/shop/bracelets" className="footer__link">Bracelets</Link></li>
              <li><Link to="/collections" className="footer__link">Collections</Link></li>
              <li><Link to="/sale" className="footer__link">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer__column">
            <h4 className="footer__subtitle">Customer Care</h4>
            <ul className="footer__links">
              <li><Link to="/contact" className="footer__link">Contact Us</Link></li>
              <li><Link to="/size-guide" className="footer__link">Size Guide</Link></li>
              <li><Link to="/shipping" className="footer__link">Shipping & Returns</Link></li>
              <li><Link to="/care-guide" className="footer__link">Jewelry Care</Link></li>
              <li><Link to="/warranty" className="footer__link">Warranty</Link></li>
              <li><Link to="/faq" className="footer__link">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__column">
            <h4 className="footer__subtitle">Stay Connected</h4>
            <p className="footer__newsletter-text">
              Subscribe to receive exclusive offers, new arrivals, and jewelry care tips.
            </p>
            <form className="footer__newsletter">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer__newsletter-input"
                required
              />
              <button type="submit" className="footer__newsletter-btn">
                Subscribe
              </button>
            </form>
            <div className="footer__contact">
              <p className="footer__contact-item">
                <PhoneIcon />
                +1 (555) 123-4567
              </p>
              <p className="footer__contact-item">
                <EmailIcon />
                hello@solvera.com
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © 2024 Solvera. All rights reserved.
            </p>
            <div className="footer__legal">
              <Link to="/privacy" className="footer__legal-link">Privacy Policy</Link>
              <Link to="/terms" className="footer__legal-link">Terms of Service</Link>
              <Link to="/cookies" className="footer__legal-link">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// SVG Icons
const InstagramIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const PinterestIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.853 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.176-4.068-2.845 0-4.516 2.135-4.516 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const EmailIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export default Footer;