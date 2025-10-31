import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, query, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import './Wishlist.css';

interface WishlistItem {
  id: string; // Firestore document ID
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'users', user.uid, 'wishlist'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: WishlistItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as WishlistItem);
        });
        setWishlistItems(items);
      });
      return () => unsubscribe();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const removeFromWishlist = async (wishlistItemId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'wishlist', wishlistItemId));
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'cart'), {
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: 1,
        createdAt: serverTimestamp(),
      });
      alert(`${item.name} has been added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart: ", error);
      alert('There was an error adding the item to your cart.');
    }
  };

  if (loading) {
    return <div className="wishlist"><div className="container">Loading...</div></div>;
  }

  return (
    <div className="wishlist">
      <div className="container">
        <div className="wishlist__header">
          <h1 className="heading-secondary">My Wishlist</h1>
          <p className="wishlist__subtitle">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {!user || wishlistItems.length === 0 ? (
          <div className="wishlist__empty">
            <div className="wishlist__empty-icon">
              <HeartIcon />
            </div>
            <h2 className="wishlist__empty-title">Your wishlist is empty</h2>
            <p className="wishlist__empty-text">
              {!user 
                ? 'Log in to see your wishlist or start shopping to save your favorite items.'
                : 'Save your favorite pieces to your wishlist so you can find them easily later.'
              }
            </p>
            <Link to={!user ? "/login" : "/shop/all"} className="btn btn-primary">
              {!user ? 'Log In' : 'Start Shopping'}
            </Link>
          </div>
        ) : (
          <div className="wishlist__grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist__item">
                <div className="wishlist__item-image">
                  <Link to={`/product/${item.productId}`}>
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <button 
                    className="wishlist__remove"
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="wishlist__item-content">
                  <h3 className="wishlist__item-title">
                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  </h3>
                  <p className="wishlist__item-price">${item.price.toLocaleString()}</p>
                  <div className="wishlist__item-actions">
                    <button 
                      className="btn btn-primary wishlist__add-to-cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <Link 
                      to={`/product/${item.productId}`} 
                      className="btn btn-secondary wishlist__view-details"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {user && wishlistItems.length > 0 && (
          <div className="wishlist__actions">
            <Link to="/shop/all" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const HeartIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Wishlist;
