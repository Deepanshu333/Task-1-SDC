import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../../firebase';
import './ProductDetail.css';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  isNew?: boolean;
  isSale?: boolean;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState<string | null>(null);
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
    const fetchProduct = async () => {
      if (id) {
        const productDoc = doc(db, 'products', id);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() } as Product);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (user && product) {
        const wishlistQuery = query(
          collection(db, 'users', user.uid, 'wishlist'),
          where('productId', '==', product.id)
        );
        const querySnapshot = await getDocs(wishlistQuery);
        if (!querySnapshot.empty) {
          setIsInWishlist(true);
          setWishlistDocId(querySnapshot.docs[0].id);
        } else {
          setIsInWishlist(false);
          setWishlistDocId(null);
        }
      }
    };

    checkWishlist();
  }, [user, product]);

  const handleAddToCart = async () => {
    if (!user) {
      setNotification('Please log in to add items to your cart.');
      return;
    }

    if (!product) return;

    if (product.category === 'rings' && !selectedSize) {
      setNotification('Please select a ring size.');
      return;
    }

    setLoading(true);
    try {
      const cartCollectionRef = collection(db, 'users', user.uid, 'cart');
      const q = query(
        cartCollectionRef,
        where('productId', '==', product.id),
        where('size', '==', selectedSize || null)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(cartCollectionRef, {
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          quantity: quantity,
          size: selectedSize || null,
          createdAt: serverTimestamp(),
        });
      } else {
        const existingItemDoc = querySnapshot.docs[0];
        await updateDoc(existingItemDoc.ref, { quantity: increment(quantity) });
      }

      setNotification(`${product.name} has been added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart: ", error);
      setNotification('There was an error adding the item to your cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      setNotification('Please log in to manage your wishlist.');
      return;
    }
    if (!product) return;

    if (isInWishlist && wishlistDocId) {
      await deleteDoc(doc(db, 'users', user.uid, 'wishlist', wishlistDocId));
      setNotification(`${product.name} removed from wishlist.`);
    } else {
      await addDoc(collection(db, 'users', user.uid, 'wishlist'), {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        category: product.category,
        addedAt: serverTimestamp(),
      });
      setNotification(`${product.name} added to wishlist.`);
    }
  };

  if (!product || !product.images || product.images.length === 0) {
    return <div className="product-detail">Loading...</div>;
  }

  const availableSizes = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'];

  return (
    <div className="product-detail">
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
        <div className="product-detail__breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/shop/${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail__content">
          <div className="product-detail__gallery">
            <div className="product-detail__main-image">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
              />
              {product.isNew && <span className="product-detail__badge">New</span>}
              {product.isSale && <span className="product-detail__badge product-detail__badge--sale">Sale</span>}
            </div>
            <div className="product-detail__thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`product-detail__thumbnail ${selectedImage === index ? 'product-detail__thumbnail--active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail__info">
            <h1 className="product-detail__title">{product.name}</h1>
            
            <div className="product-detail__price">
              {product.isSale && product.originalPrice && (
                <span className="product-detail__original-price">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="product-detail__current-price">
                ${product.price.toLocaleString()}
              </span>
            </div>

            <div className="product-detail__description">
              <p>{product.description}</p>
            </div>

            <div className="product-detail__options">
              {product.category === 'rings' && (
                <div className="product-detail__option-group">
                  <label className="product-detail__option-label">Ring Size:</label>
                  <select 
                    value={selectedSize} 
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="product-detail__select"
                    required
                  >
                    <option value="">Select Size</option>
                    {availableSizes.map(size => (
                      <option key={size} value={size}>Size {size}</option>
                    ))}
                  </select>
                  <Link to="/size-guide" className="product-detail__size-guide">
                    Size Guide
                  </Link>
                </div>
              )}

              <div className="product-detail__option-group">
                <label className="product-detail__option-label">Quantity:</label>
                <div className="product-detail__quantity">
                  <button 
                    className="product-detail__quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <MinusIcon />
                  </button>
                  <span className="product-detail__quantity-value">{quantity}</span>
                  <button 
                    className="product-detail__quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="product-detail__actions">
              <button 
                className="btn btn-primary product-detail__add-to-cart"
                onClick={handleAddToCart}
                disabled={loading || (product.category === 'rings' && !selectedSize)}
              >
                {loading ? 'Adding...' : `Add to Cart - $${(product.price * quantity).toLocaleString()}`}
              </button>
              <button 
                className="product-detail__wishlist-btn"
                onClick={handleAddToWishlist}
                aria-label="Add to wishlist"
              >
                <HeartIcon filled={isInWishlist} />
              </button>
            </div>

            <div className="product-detail__features">
              <h3>Key Features</h3>
              <ul>
                {product.features && product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="product-detail__specifications">
              <h3>Specifications</h3>
              <div className="product-detail__spec-grid">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="product-detail__spec-row">
                    <span className="product-detail__spec-label">{key}:</span>
                    <span className="product-detail__spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-detail__shipping">
              <div className="product-detail__shipping-info">
                <ShippingIcon />
                <div>
                  <strong>Free Shipping</strong>
                  <p>Free shipping on orders over $1,000</p>
                </div>
              </div>
              <div className="product-detail__shipping-info">
                <ReturnIcon />
                <div>
                  <strong>30-Day Returns</strong>
                  <p>Easy returns within 30 days</p>
                </div>
              </div>
              <div className="product-detail__shipping-info">
                <WarrantyIcon />
                <div>
                  <strong>Lifetime Warranty</strong>
                  <p>Craftsmanship guarantee included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons
const MinusIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ShippingIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const ReturnIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1,4 1,10 7,10"></polyline>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
  </svg>
);

const WarrantyIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export default ProductDetail;
