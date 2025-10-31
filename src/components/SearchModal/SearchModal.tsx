import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page with the search term
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal" onClick={handleOverlayClick}>
      <div className="search-modal__content">
        <div className="search-modal__header">
          <h2 className="search-modal__title">Search Products</h2>
          <button 
            className="search-modal__close"
            onClick={onClose}
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </div>
        
        <form className="search-modal__form" onSubmit={handleSubmit}>
          <div className="search-modal__input-group">
            <input
              ref={inputRef}
              type="text"
              className="search-modal__input"
              placeholder="Search for rings, necklaces, earrings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="search-modal__submit"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        <div className="search-modal__suggestions">
          <h3 className="search-modal__suggestions-title">Popular Searches</h3>
          <div className="search-modal__suggestions-list">
            <button 
              className="search-modal__suggestion" 
              onClick={() => handleSuggestionClick('engagement rings')}
            >
              Engagement Rings
            </button>
            <button 
              className="search-modal__suggestion" 
              onClick={() => handleSuggestionClick('diamond necklace')}
            >
              Diamond Necklaces
            </button>
            <button 
              className="search-modal__suggestion" 
              onClick={() => handleSuggestionClick('gold earrings')}
            >
              Gold Earrings
            </button>
            <button 
              className="search-modal__suggestion" 
              onClick={() => handleSuggestionClick('wedding bands')}
            >
              Wedding Bands
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons
const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

export default SearchModal;