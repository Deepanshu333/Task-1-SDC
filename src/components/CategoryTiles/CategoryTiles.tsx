import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryTiles.css';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

const CategoryTiles: React.FC = () => {
  const categories: Category[] = [
    {
      id: '1',
      name: 'Elegant Rings',
      slug: 'rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Discover our stunning collection of engagement and wedding rings'
    },
    {
      id: '2',
      name: 'Luxury Necklaces',
      slug: 'necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Exquisite necklaces that make a statement of sophistication'
    },
    {
      id: '3',
      name: 'Designer Earrings',
      slug: 'earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Artfully crafted earrings for every occasion'
    }
  ];

  return (
    <section className="category-tiles section-padding">
      <div className="container">
        <div className="category-tiles__header">
          <h2 className="heading-secondary text-center mb-md">
            Shop by Category
          </h2>
          <p className="text-center mb-xl">
            Explore our carefully curated collections, each piece designed to capture 
            the essence of timeless elegance and modern sophistication.
          </p>
        </div>
        
        <div className="category-tiles__grid">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop/${category.slug}`}
              className="category-tile"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="category-tile__image-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-tile__image"
                />
                <div className="category-tile__overlay"></div>
              </div>
              
              <div className="category-tile__content">
                <h3 className="category-tile__title">
                  {category.name}
                </h3>
                <p className="category-tile__description">
                  {category.description}
                </p>
                <span className="category-tile__cta">
                  Shop Now
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Arrow Icon Component
const ArrowIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7,7 17,7 17,17"></polyline>
  </svg>
);

export default CategoryTiles;