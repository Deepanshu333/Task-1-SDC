import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import './Orders.css';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  createdAt: any;
  total: number;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
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
      const ordersQuery = query(
        collection(db, 'users', user.uid, 'orders'),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
        const userOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          userOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(userOrders);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return <div className="orders"><div className="container">Loading...</div></div>;
  }

  if (!user) {
    return (
      <div className="orders">
        <div className="container">
          <p>Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="container">
        <div className="orders__header">
          <h1 className="heading-secondary">My Orders</h1>
        </div>
        {orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <div className="orders__list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card__header">
                  <div className="order-card__header-info">
                    <div className="order-card__header-item">
                      <p className="order-card__header-label">Order Placed</p>
                      <p className="order-card__header-value">
                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-card__header-item">
                      <p className="order-card__header-label">Total</p>
                      <p className="order-card__header-value">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="order-card__header-item">
                    <p className="order-card__header-label">Order #</p>
                    <p className="order-card__header-value">{order.id}</p>
                  </div>
                </div>
                <div className="order-card__body">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-card__item">
                      <div className="order-card__item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="order-card__item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="order-card__item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
