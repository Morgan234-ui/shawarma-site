'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

const NAV_LINKS = [
  { href: '#home',    label: 'Home',    id: 'home' },
  { href: '#about',   label: 'About',   id: 'about' },
  { href: '#menu',    label: 'Menu',    id: 'menu' },
  { href: '#order',   label: 'Order',   id: 'order' },
  { href: '#contact', label: 'Contact', id: 'contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  function closeMenu() { setMenuOpen(false); }

  return (
    <>
      <motion.header
        className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="hdr-inner">
          <a href="#home" className="hdr-logo" onClick={closeMenu}>
            <div className="hdr-logo-icon">
              <Flame size={22} color="#fff" strokeWidth={1.8} />
            </div>
            <div className="hdr-logo-text">
              <span className="hdr-logo-name">MimiRichies Bite</span>
              <span className="hdr-logo-tag">Premium Shawarma &amp; Grill</span>
            </div>
          </a>

          <nav className="hdr-nav" aria-label="Primary navigation">
            <ul>
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`hdr-nav-link ${activeId === link.id ? 'hdr-nav-link-active' : ''}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hdr-actions">
            <a href="#order" className="hdr-cta-btn">Order Now</a>
            <button
              className="hdr-hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={menuOpen ? 'hdr-ham-open' : ''} />
              <span className={menuOpen ? 'hdr-ham-open' : ''} />
              <span className={menuOpen ? 'hdr-ham-open' : ''} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="mobile-drawer"
        initial={false}
        animate={{ x: menuOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-header">
          <div className="hdr-logo">
            <div className="hdr-logo-icon">
              <Flame size={20} color="#fff" strokeWidth={1.8} />
            </div>
            <div className="hdr-logo-text">
              <span className="hdr-logo-name">MimiRichies Bite</span>
            </div>
          </div>
          <button className="mobile-drawer-close" onClick={closeMenu} aria-label="Close menu">✕</button>
        </div>

        <nav>
          <ul className="mobile-nav-list">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href} className="mobile-nav-link" onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-drawer-cta">
          <a href="#order" className="hdr-cta-btn mobile-cta-full" onClick={closeMenu}>
            Order Now
          </a>
        </div>

        <div className="mobile-drawer-contact">
          <a href="tel:+234 814 580 1171">📞 +234 814 580 1171</a>
          <a href="https://wa.me/234 814 580 1171" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp Us
          </a>
        </div>
      </motion.div>
    </>
  );
}
