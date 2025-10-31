import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '../../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './Cart.css';

interface CartItem {
  id: string; // Firestore document ID
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
      const q = query(collection(db, 'users', user.uid, 'cart'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: CartItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as CartItem);
        });
        setCartItems(items);
      });
      return () => unsubscribe();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (!user) return;
    const cartItemRef = doc(db, 'users', user.uid, 'cart', cartItemId);
    if (newQuantity > 0) {
      await updateDoc(cartItemRef, { quantity: newQuantity });
    } else {
      await deleteDoc(cartItemRef);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;
    const cartItemRef = doc(db, 'users', user.uid, 'cart', cartItemId);
    await deleteDoc(cartItemRef);
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (loading) {
    return <div className="cart"><div className="container">Loading...</div></div>;
  }

  return (
    <div className="cart">
      <div className="container">
        <div className="cart__header">
          <h1 className="heading-secondary">Shopping Cart</h1>
          <p className="cart__subtitle">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {!user || cartItems.length === 0 ? (
          <div className="cart__empty">
            <div className="cart__empty-icon">
              <CartIcon />
            </div>
            <h2 className="cart__empty-title">Your cart is empty</h2>
            <p className="cart__empty-text">
              {!user 
                ? 'Log in to see your cart or start shopping to add items.'
                : 'Discover our exquisite collection of handcrafted jewelry and add your favorite pieces.'
              }
            </p>
            <Link to={!user ? "/login" : "/shop/all"} className="btn btn-primary">
              {!user ? 'Log In' : 'Start Shopping'}
            </Link>
          </div>
        ) : (
          <div className="cart__content">
            <div className="cart__items">
              {cartItems.map(item => (
                <div key={item.id} className="cart__item">
                  <div className="cart__item-image">
                    <Link to={`/product/${item.productId}`}>
                      <img src={item.image} alt={item.name} />
                    </Link>
                  </div>
                  <div className="cart__item-details">
                    <h3 className="cart__item-title">
                      <Link to={`/product/${item.productId}`}>{item.name}</Link>
                    </h3>
                    {item.size && <p className="cart__item-size">{item.size}</p>}
                    <p className="cart__item-price">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="cart__item-quantity">
                    <button 
                      className="cart__quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <MinusIcon />
                    </button>
                    <span className="cart__quantity-value">{item.quantity}</span>
                    <button 
                      className="cart__quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <div className="cart__item-total">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button 
                    className="cart__item-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart__summary">
              <h2 className="cart__summary-title">Order Summary</h2>
              <div className="cart__summary-line">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="cart__summary-line">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="cart__summary-line">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="cart__summary-line cart__summary-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="btn btn-primary cart__checkout-btn">
                Proceed to Checkout
              </button>
              <p className="cart__shipping-note">
                {shipping === 0 
                  ? '🎉 You qualify for free shipping!' 
                  : `💎 Free shipping on orders over $1,000`
                }
              </p>
            </div>
          </div>
        )}

        {user && cartItems.length > 0 && (
          <div className="cart__actions">
            <Link to="/shop/all" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const CartIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
  </svg>
);

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

const TrashIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
  </svg>
);

export default Cart;
