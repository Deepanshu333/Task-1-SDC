import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import SearchModal from '../SearchModal/SearchModal';
import './Header.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'users', user.uid, 'cart'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let totalCount = 0;
        querySnapshot.forEach((doc) => {
          totalCount += doc.data().quantity;
        });
        setCartCount(totalCount);
      });
      return () => unsubscribe();
    } else {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isShopDropdownOpen) setIsShopDropdownOpen(false);
      if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
    };

    if (isShopDropdownOpen || isProfileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isShopDropdownOpen, isProfileDropdownOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const toggleShopDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(false);
    setIsShopDropdownOpen(!isShopDropdownOpen);
  };

  const toggleProfileDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShopDropdownOpen(false);
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error('Logout Error:', error));
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container">
        <div className="header__content">
          <Link to="/" className="header__logo">
            <span className="header__logo-text">Solvera</span>
          </Link>

          <nav className="header__nav">
            <ul className="header__nav-list">
              <li><Link to="/" className="header__nav-link">Home</Link></li>
              <li><Link to="/shop" className="header__nav-link">Shop</Link></li>
              <li className="header__nav-item--dropdown">
                <button 
                  className="header__nav-link header__nav-link--dropdown"
                  onClick={toggleShopDropdown}
                  aria-expanded={isShopDropdownOpen}
                >
                  Collections
                  <DropdownIcon />
                </button>
                {isShopDropdownOpen && (
                  <div className="header__dropdown">
                    <Link to="/shop/rings" className="header__dropdown-link">Rings</Link>
                    <Link to="/shop/necklaces" className="header__dropdown-link">Necklaces</Link>
                    <Link to="/shop/earrings" className="header__dropdown-link">Earrings</Link>
                    <Link to="/shop/bracelets" className="header__dropdown-link">Bracelets</Link>
                  </div>
                )}
              </li>
              <li><Link to="/about" className="header__nav-link">About</Link></li>
            </ul>
          </nav>

          <div className="header__utilities">
            <button 
              className="header__utility-btn" 
              onClick={openSearchModal}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <Link to="/wishlist" className="header__utility-btn" aria-label="Wishlist">
              <HeartIcon />
            </Link>
            <Link to="/cart" className="header__utility-btn header__utility-btn--cart" aria-label="Shopping Cart">
              <CartIcon />
              {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
            </Link>
            
            {user && userProfile ? (
              <div className="header__profile-container">
                <button onClick={toggleProfileDropdown} className="header__profile-btn" aria-label="Account menu">
                  {userProfile.firstName.charAt(0)}
                </button>
                {isProfileDropdownOpen && (
                  <div className="header__profile-dropdown">
                    <div className="header__profile-info">
                      <p>Hi, {userProfile.firstName}</p>
                      <p className="header__profile-email">{userProfile.email}</p>
                    </div>
                    <Link to="/account/orders" className="header__dropdown-link">Orders</Link>
                    <Link to="/account/profile" className="header__dropdown-link">Profile</Link>
                    <button onClick={handleLogout} className="header__dropdown-link header__dropdown-link--logout">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="header__utility-btn" aria-label="Account">
                <UserIcon />
              </Link>
            )}
          </div>

          <button 
            className={`header__mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className={`header__mobile-nav ${isMobileMenuOpen ? 'header__mobile-nav--open' : ''}`}>
          <ul className="header__mobile-nav-list">
            <li><Link to="/" className="header__mobile-nav-link">Home</Link></li>
            <li><Link to="/shop/rings" className="header__mobile-nav-link">Rings</Link></li>
            <li><Link to="/shop/necklaces" className="header__mobile-nav-link">Necklaces</Link></li>
            <li><Link to="/shop/earrings" className="header__mobile-nav-link">Earrings</Link></li>
            <li><Link to="/shop/bracelets" className="header__mobile-nav-link">Bracelets</Link></li>
            <li><Link to="/collections" className="header__mobile-nav-link">Collections</Link></li>
            <li><Link to="/about" className="header__mobile-nav-link">About</Link></li>
          </ul>
        </nav>
      </div>
      
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
      />
    </header>
  );
};

// SVG Icons Components
const SearchIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CartIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
  </svg>
);

const UserIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const DropdownIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

export default Header;