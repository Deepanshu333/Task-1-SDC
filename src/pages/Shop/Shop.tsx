import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../../firebase';
import './Shop.css';

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

const Shop: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState('');
  const auth = getAuth();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under1000':
          filtered = filtered.filter(product => product.price < 1000);
          break;
        case '1000-2000':
          filtered = filtered.filter(product => product.price >= 1000 && product.price <= 2000);
          break;
        case '2000-5000':
          filtered = filtered.filter(product => product.price >= 2000 && product.price <= 5000);
          break;
        case 'over5000':
          filtered = filtered.filter(product => product.price > 5000);
          break;
      }
    }

    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, category, sortBy, priceRange]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setNotification('Please log in to add items to your cart.');
      return;
    }

    if (product.category === 'rings') {
      navigate(`/product/${product.id}`);
      return;
    }

    try {
      const cartCollectionRef = collection(db, 'users', user.uid, 'cart');
      const q = query(cartCollectionRef, where('productId', '==', product.id), where('size', '==', null));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(cartCollectionRef, {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          size: null,
          createdAt: serverTimestamp(),
        });
      } else {
        const existingItemDoc = querySnapshot.docs[0];
        await updateDoc(existingItemDoc.ref, { quantity: increment(1) });
      }
      setNotification(`${product.name} has been added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart: ", error);
      setNotification('There was an error adding the item to your cart.');
    }
  };

  const handleAddToWishlist = async (product: Product) => {
    if (!user) {
      setNotification('Please log in to add items to your wishlist.');
      return;
    }
    try {
      const wishlistCollectionRef = collection(db, 'users', user.uid, 'wishlist');
      const q = query(wishlistCollectionRef, where('productId', '==', product.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(wishlistCollectionRef, {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          category: product.category,
          addedAt: serverTimestamp(),
        });
        setNotification(`${product.name} has been added to your wishlist.`);
      } else {
        setNotification(`${product.name} is already in your wishlist.`);
      }
    } catch (error) {
      console.error("Error adding to wishlist: ", error);
      setNotification('There was an error adding the item to your wishlist.');
    }
  };

  const getCategoryTitle = () => {
    if (!category || category === 'all') return 'All Jewelry';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="shop">
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000,
          textAlign: 'center',
        }}>
          {notification}
        </div>
      )}
      <div className="container">
        <div className="shop__header">
          <h1 className="heading-secondary">{getCategoryTitle()}</h1>
          <p className="shop__subtitle">
            Discover our exquisite collection of handcrafted jewelry pieces
          </p>
        </div>

        <div className="shop__filters">
          <div className="shop__filter-group">
            <label htmlFor="sort" className="shop__filter-label">Sort by:</label>
            <select 
              id="sort"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="shop__filter-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="shop__filter-group">
            <label htmlFor="price" className="shop__filter-label">Price Range:</label>
            <select 
              id="price"
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className="shop__filter-select"
            >
              <option value="all">All Prices</option>
              <option value="under1000">Under $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000-5000">$2,000 - $5,000</option>
              <option value="over5000">Over $5,000</option>
            </select>
          </div>

          <div className="shop__results-count">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </div>
        </div>

        <div className="shop__grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="shop__product-card">
              <div className="shop__product-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                {product.isNew && <span className="shop__badge shop__badge--new">New</span>}
                {product.isSale && <span className="shop__badge shop__badge--sale">Sale</span>}
                <div className="shop__product-overlay">
                  <button onClick={() => handleAddToWishlist(product)} className="shop__quick-action" aria-label="Add to wishlist">
                    <HeartIcon />
                  </button>
                  <button onClick={() => navigate(`/product/${product.id}`)} className="shop__quick-action" aria-label="Quick view">
                    <EyeIcon />
                  </button>
                  <button onClick={() => handleAddToCart(product)} className="shop__quick-action" aria-label="Add to cart">
                    <CartIcon />
                  </button>
                </div>
              </div>
              <div className="shop__product-info">
                <h3 className="shop__product-title">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="shop__product-description">{product.description}</p>
                <div className="shop__product-price">
                  {product.isSale && product.originalPrice && (
                    <span className="shop__product-original-price">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="shop__product-current-price">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="shop__empty">
            <h2>No products found</h2>
            <p>Try adjusting your filters or browse all products.</p>
            <Link to="/shop/all" className="btn btn-primary">View All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const HeartIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const CartIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
  </svg>
);

export default Shop;
