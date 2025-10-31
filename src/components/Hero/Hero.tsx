import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero__background">
        {/* Using a placeholder image - in production, this would be a high-quality lifestyle image */}
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury jewelry collection"
          className="hero__image"
        />
        <div className="hero__overlay"></div>
      </div>
      
      <div className="hero__content">
        <div className="container">
          <div className="hero__text">
            <h1 className="hero__title">
              Timeless
              <span className="hero__title-accent">Craftsmanship</span>
            </h1>
            <p className="hero__subtitle">
              Discover our exquisite collection of handcrafted luxury jewelry, 
              where every piece tells a story of elegance and sophistication.
            </p>
            <div className="hero__actions">
              <Link to="/collections" className="btn btn-outline hero__btn-primary">
                Explore The Collection
              </Link>
              <Link to="/about" className="hero__btn-secondary">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line"></div>
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;