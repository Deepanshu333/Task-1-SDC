import React from 'react';
import Hero from '../../components/Hero/Hero';
import CategoryTiles from '../../components/CategoryTiles/CategoryTiles';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Hero />
      <CategoryTiles />
      
      {/* New Arrivals Section */}
      <section className="new-arrivals section-padding">
        <div className="container">
          <div className="new-arrivals__header">
            <h2 className="heading-secondary text-center mb-md">
              New Arrivals
            </h2>
            <p className="text-center mb-xl">
              Discover our latest collection of handcrafted jewelry pieces, 
              each designed to capture the perfect balance of tradition and innovation.
            </p>
          </div>
          
          <div className="new-arrivals__grid">
            {/* Placeholder for product cards */}
            <div className="product-preview">
              <div className="product-preview__image">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Diamond Engagement Ring"
                />
              </div>
              <div className="product-preview__content">
                <h3 className="product-preview__title">Diamond Solitaire Ring</h3>
                <p className="product-preview__price">$2,890</p>
              </div>
            </div>
            
            <div className="product-preview">
              <div className="product-preview__image">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Pearl Necklace"
                />
              </div>
              <div className="product-preview__content">
                <h3 className="product-preview__title">Baroque Pearl Necklace</h3>
                <p className="product-preview__price">$1,650</p>
              </div>
            </div>
            
            <div className="product-preview">
              <div className="product-preview__image">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Gold Earrings"
                />
              </div>
              <div className="product-preview__content">
                <h3 className="product-preview__title">18k Gold Drop Earrings</h3>
                <p className="product-preview__price">$980</p>
              </div>
            </div>
            
            <div className="product-preview">
              <div className="product-preview__image">
                <img
                  src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Tennis Bracelet"
                />
              </div>
              <div className="product-preview__content">
                <h3 className="product-preview__title">Diamond Tennis Bracelet</h3>
                <p className="product-preview__price">$3,200</p>
              </div>
            </div>
          </div>
          
          <div className="new-arrivals__cta">
            <a href="/shop" className="btn btn-secondary">
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="brand-story section-padding" style={{backgroundColor: 'var(--color-beige)'}}>
        <div className="container">
          <div className="brand-story__content">
            <div className="brand-story__text">
              <h2 className="heading-secondary mb-md">
                Crafted with Passion, Worn with Pride
              </h2>
              <p className="mb-md">
                For over three decades, Solvera has been synonymous with exceptional craftsmanship 
                and timeless design. Each piece in our collection is meticulously handcrafted by 
                skilled artisans who share our commitment to excellence.
              </p>
              <p className="mb-lg">
                From the initial sketch to the final polish, every step of our process is guided 
                by our unwavering dedication to creating jewelry that transcends trends and 
                becomes treasured heirlooms.
              </p>
              <a href="/about" className="btn btn-primary">
                Our Story
              </a>
            </div>
            <div className="brand-story__image">
              <img
                src="https://images.unsplash.com/photo-1544376664-80b17f09d399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Jewelry craftsman at work"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;