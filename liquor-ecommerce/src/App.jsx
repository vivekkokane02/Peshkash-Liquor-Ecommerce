import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AgeGateModal from './components/AgeGateModal.jsx';
import DigiLockerAuth from './components/DigiLockerAuth.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import CreateProduct from './pages/CreateProduct.jsx';

export default function App() {
  const [gatePassed, setGatePassed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('rsv_theme');
    return saved ? saved === 'dark' : !window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  useEffect(() => {
    const seen = sessionStorage.getItem('rsv_age_gate');
    if (seen === '1') setGatePassed(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', !darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    localStorage.setItem('rsv_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleGateConfirm = () => {
    sessionStorage.setItem('rsv_age_gate', '1');
    setGatePassed(true);
  };

  if (!gatePassed) {
    return (
      <AgeGateModal
        onConfirm={handleGateConfirm}
        onDecline={() => {
          window.location.href = 'https://www.google.com';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((current) => !current)}
        onOpenCart={() => setShowCart(true)}
        onOpenAuth={() => setShowAuth(true)}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail onRequireAuth={() => setShowAuth(true)} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/products/new" element={<CreateProduct />} />
        </Routes>
      </main>

      <Footer />

      <CartDrawer open={showCart} onClose={() => setShowCart(false)} />
      {showAuth && <DigiLockerAuth onClose={() => setShowAuth(false)} />}
    </div>
  );
}
