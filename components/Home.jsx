'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Users, UtensilsCrossed, Zap } from 'lucide-react';

function useCountUp(target, duration, triggered) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let val = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      val += step;
      if (val >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(val));
    }, 16);
    return () => clearInterval(timer);
  }, [triggered, target, duration]);
  return count;
}

export default function Home() {
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const customers = useCountUp(500, 1800, inView);
  const menuItems = useCountUp(9, 1200, inView);

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Now Open &mdash; Fast Delivery Available
        </div>

        <h2 className="hero-title">
          Taste the Authentic<br />
          <span className="hero-title-highlight">Shawarma &amp; Grill &amp; African Soups </span> <br />
          Experience
        </h2>

        <p className="hero-desc">
          Fresh, flame-grilled meals made with premium ingredients — delivered
          straight to your door in Port Harcourt.
        </p>

        <div className="hero-buttons">
          <a href="#menu" className="btn btn-primary hero-btn-main">View Our Menu</a>
          <a href="#order" className="btn btn-secondary">Order Now</a>
        </div>

        <div className="hero-stats" ref={statsRef}>
          <div className="hero-stat">
            <Users size={22} className="hero-stat-icon" />
            <span className="hero-stat-num">
              {inView ? customers : 0}<span className="hero-stat-plus">+</span>
            </span>
            <span className="hero-stat-label">Happy Customers</span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat">
            <UtensilsCrossed size={22} className="hero-stat-icon" />
            <span className="hero-stat-num">
              {inView ? menuItems : 0}<span className="hero-stat-plus">+</span>
            </span>
            <span className="hero-stat-label">Menu Items</span>
          </div>

          <div className="hero-stat-divider" />

          <div className="hero-stat">
            <Zap size={22} className="hero-stat-icon" />
            <span className="hero-stat-num">Fast</span>
            <span className="hero-stat-label">Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
