'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ImageOff } from 'lucide-react';

function handleSelect(value) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mimi:selectMeal', { detail: { food: value } }));
    const orderSection = document.getElementById('order');
    if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function formatPrice(price) {
  return `₦${Number(price).toLocaleString('en-NG')}`;
}

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="menu">
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
        >
          Our Menu
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Every dish made fresh — pick your favourite and we'll bring it to you
        </motion.p>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <div className="orders-loading-spinner" style={{ margin: '0 auto 1rem' }} />
            <p>Loading menu…</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <p>Menu coming soon. Check back shortly!</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <motion.div
            className="menu-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map(product => (
              <motion.div className="menu-card" variants={cardVariants} key={product._id}>
                <div className="menu-card-image">
                  {product.image
                    ? <img src={product.image} alt={product.name} loading="lazy" />
                    : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                        <ImageOff size={36} strokeWidth={1} color="#cbd5e1" />
                      </div>
                    )}
                  {product.badge && <div className="menu-card-badge">{product.badge}</div>}
                </div>
                <div className="menu-card-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="menu-card-footer">
                    <span className="price">{formatPrice(product.price)}</span>
                    <button
                      className="btn-icon"
                      title={`Order ${product.name}`}
                      onClick={() => handleSelect(`${product.name} — ${formatPrice(product.price)}`)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
