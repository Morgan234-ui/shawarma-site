'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, CheckCircle2, MapPin, MessageSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EMPTY = { name: '', phone: '', email: '', food: '', location: '', instructions: '' };

export default function Order() {
  const [form, setForm] = useState(EMPTY);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onSelectMeal(e) {
      setForm(prev => ({ ...prev, food: e.detail.food }));
    }
    window.addEventListener('mimi:selectMeal', onSelectMeal);
    return () => window.removeEventListener('mimi:selectMeal', onSelectMeal);
  }, []);

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  function showToast(message, type = 'success', timeout = 4500) {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), timeout);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.food || !form.location) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (res.ok) {
        showToast(payload.message || 'Order placed successfully!', 'success', 5500);
        setForm(EMPTY);
      } else {
        showToast(payload.message || 'Something went wrong.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const foodOptions = products.length > 0
    ? products.map(p => ({
        value: `${p.name} — ₦${Number(p.price).toLocaleString()}`,
        label: `${p.name} — ₦${Number(p.price).toLocaleString()}`,
      }))
    : [
        { value: 'Chicken Shawarma — ₦3,000',              label: 'Chicken Shawarma — ₦3,000' },
        { value: 'Turkey Shawarma — ₦10,000',              label: 'Turkey Shawarma — ₦10,000' },
        { value: 'Beef Shawarma — ₦4,500',                  label: 'Beef Shawarma — ₦4,500' },
        { value: 'Chicken & Sausage Shawarma — ₦3,500',    label: 'Chicken & Sausage Shawarma — ₦3,500' },
        { value: 'Mouth Watering Noodles — ₦3,500',        label: 'Mouth Watering Noodles — ₦3,500' },
      ];

  return (
    <section id="order">
      <div className="section-container">
        <h2 className="section-title">Place Your Order</h2>
        <p className="section-subtitle">Fill in your details and we'll handle the rest</p>

        <div className="order-card-wrap">
          <form onSubmit={handleSubmit} noValidate className="order-form-shadcn">

            {/* Name + Phone row */}
            <div className="ofs-row-2">
              <div className="ofs-field">
                <Label htmlFor="name">Full Name <span className="ofs-req">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={set('name')}
                  disabled={loading}
                  required
                />
              </div>
              <div className="ofs-field">
                <Label htmlFor="phone">Phone Number <span className="ofs-req">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 or 080…"
                  value={form.phone}
                  onChange={set('phone')}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="ofs-field">
              <Label htmlFor="email">Email Address <span className="ofs-req">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                disabled={loading}
                required
              />
              <p className="ofs-hint">Your order confirmation will be sent here</p>
            </div>

            {/* Meal select (Radix) */}
            <div className="ofs-field">
              <Label htmlFor="food-trigger">Select Your Meal <span className="ofs-req">*</span></Label>
              <Select
                value={form.food}
                onValueChange={val => setForm(prev => ({ ...prev, food: val }))}
                disabled={loading}
              >
                <SelectTrigger id="food-trigger" className="ofs-select-trigger">
                  <SelectValue placeholder="Choose a meal…" />
                </SelectTrigger>
                <SelectContent>
                  {foodOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Delivery location */}
            <div className="ofs-field">
              <Label htmlFor="location">
                <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                Delivery Address <span className="ofs-req">*</span>
              </Label>
              <Textarea
                id="location"
                placeholder="Your full delivery address"
                value={form.location}
                onChange={set('location')}
                disabled={loading}
                required
                className="ofs-textarea"
              />
            </div>

            {/* Special instructions */}
            <div className="ofs-field">
              <Label htmlFor="instructions">
                <MessageSquare size={13} style={{ display: 'inline', marginRight: 4 }} />
                Special Instructions{' '}
                <span className="ofs-optional">(indicate the number of items, or liter of soup ordered)</span>
              </Label>
              <Textarea
                id="instructions"
                placeholder="No pepper, extra sauce, anything specific…"
                value={form.instructions}
                onChange={set('instructions')}
                disabled={loading}
                className="ofs-textarea"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="ofs-submit"
            >
              {loading
                ? <><Loader2 size={18} className="ofv2-spin" /> Placing order…</>
                : <><ShoppingBag size={18} /> Place Order</>}
            </Button>
          </form>
        </div>

        {/* Toast */}
        <div
          role="status"
          aria-live="polite"
          className={`toast ${toast.visible ? 'show' : ''} ${toast.type}`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          )}
          {toast.message}
        </div>
      </div>
    </section>
  );
}
