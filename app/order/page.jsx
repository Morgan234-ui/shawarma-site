'use client';
// app/order/page.jsx
// Next.js App Router — Order Form Page

import { useState } from 'react';

const FOOD_OPTIONS = [
  { value: '', label: '— Select a meal —' },
  { value: 'Jollof Rice & Chicken', label: 'Jollof Rice & Chicken' },
  { value: 'Fried Rice & Turkey', label: 'Fried Rice & Turkey' },
  { value: 'Egusi Soup & Pounded Yam', label: 'Egusi Soup & Pounded Yam' },
  { value: 'Ofada Rice & Ayamase', label: 'Ofada Rice & Ayamase' },
  { value: 'Pepper Soup', label: 'Pepper Soup' },
  { value: 'Suya & Chips', label: 'Suya & Chips' },
];

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const initialForm = {
  name: '',
  phone: '',
  email: '',
  food: '',
  location: '',
  instructions: '',
};

export default function OrderPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [message, setMessage] = useState('');

  // Generic change handler for all inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(STATUS.LOADING);
    setMessage('⏳ Processing your order...');

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus(STATUS.SUCCESS);
        setMessage(`✓ ${data.message}`);
        setForm(initialForm); // reset form

        // Auto-clear success message after 7 seconds
        setTimeout(() => {
          setStatus(STATUS.IDLE);
          setMessage('');
        }, 7000);
      } else {
        setStatus(STATUS.ERROR);
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setStatus(STATUS.ERROR);
      setMessage('❌ Network error. Please check your connection and try again.');
    }
  }

  // Derive Tailwind colour classes from current status
  const messageClass = {
    [STATUS.IDLE]: 'hidden',
    [STATUS.LOADING]: 'bg-blue-50 border border-blue-300 text-blue-700',
    [STATUS.SUCCESS]: 'bg-green-50 border border-green-300 text-green-700',
    [STATUS.ERROR]: 'bg-red-50 border border-red-300 text-red-700',
  }[status];

  const isLoading = status === STATUS.LOADING;

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600">🍽 MimiRichies Bite</h1>
          <p className="text-gray-500 mt-1">Place your order and we'll deliver fresh!</p>
        </div>

        {/* Status message */}
        {status !== STATUS.IDLE && (
          <div className={`rounded-lg p-4 mb-6 text-sm font-medium ${messageClass}`}>
            {message}
          </div>
        )}

        {/* Order Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Amaka Johnson"
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 08012345678"
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. amaka@email.com"
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            />
          </div>

          {/* Food Select */}
          <div>
            <label htmlFor="food" className="block text-sm font-semibold text-gray-700 mb-1">
              Select Meal <span className="text-red-500">*</span>
            </label>
            <select
              id="food"
              name="food"
              value={form.food}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            >
              {FOOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
              Delivery Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. 12 Adeola Street, Yaba, Lagos"
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label htmlFor="instructions" className="block text-sm font-semibold text-gray-700 mb-1">
              Special Instructions <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. No pepper, extra sauce on the side..."
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none disabled:opacity-50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-base"
          >
            {isLoading ? '⏳ Placing Order...' : '🛒 Place Order'}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Call us on{' '}
          <a href="tel:+2348126201628" className="text-orange-500 hover:underline">
            +234 812 620 1628
          </a>
        </p>
      </div>
    </main>
  );
}
