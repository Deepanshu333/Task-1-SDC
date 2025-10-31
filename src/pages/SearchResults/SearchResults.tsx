import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './SearchResults.css';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  isNew?: boolean;
  isSale?: boolean;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Get query parameter from URL
  const getQueryFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  };

  const query = getQueryFromURL();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const filtered = products.filter(product => {
      const searchableText = [
        product.name,
        product.category,
        product.description,
        ...(product.description ? [product.description] : [])
      ].join(' ').toLowerCase();

      // Check if all search terms appear in the searchable text
      return searchTerms.every(term => searchableText.includes(term));
    });

    setFilteredProducts(filtered);
  }, [location.search, products, query]);

  if (loading) {
    return (
      <div className="search-results">
        <div className="container">
          <div className="search-results__loading">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="container">
        <div className="search-results__header">
          <h1 className="heading-secondary">
            {query 
              ? `Search Results for "${query}"` 
              : 'Search Results'
            }
          </h1>
          <p className="search-results__count">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {!query && (
          <div className="search-results__empty">
            <h2>No search query provided</h2>
            <p>Please enter a search term to find products.</p>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>
              Browse All Products
            </button>
          </div>
        )}

        {query && filteredProducts.length === 0 && (
          <div className="search-results__empty">
            <h2>No products found</h2>
            <p>We couldn't find any products matching "{query}". Try adjusting your search terms.</p>
            <div className="search-results__suggestions">
              <p><strong>Suggestions:</strong></p>
              <ul>
                <li>Check your spelling</li>
                <li>Try more general terms</li>
                <li>Browse by category instead</li>
              </ul>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>
              Browse All Products
            </button>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="search-results__grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="search-results__product-card">
                <div className="search-results__product-image">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  {product.isNew && <span className="search-results__badge search-results__badge--new">New</span>}
                  {product.isSale && <span className="search-results__badge search-results__badge--sale">Sale</span>}
                </div>
                <div className="search-results__product-info">
                  <h3 className="search-results__product-title">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="search-results__product-category">{product.category}</p>
                  <p className="search-results__product-description">{product.description}</p>
                  <div className="search-results__product-price">
                    {product.isSale && product.originalPrice && (
                      <span className="search-results__product-original-price">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="search-results__product-current-price">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <button 
                    className="btn btn-primary search-results__view-btn"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

