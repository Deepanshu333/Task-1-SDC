import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Orders from './pages/Orders/Orders';
import SearchResults from './pages/SearchResults/SearchResults';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './styles/globals.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/account/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
