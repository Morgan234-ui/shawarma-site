'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/orders');
      } else {
        setError(data.message || 'Incorrect password.');
        setPassword('');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="al-page">
      <div className="al-card">
        <div className="al-brand">
          <div className="al-brand-icon">🍢</div>
          <div>
            <h1 className="al-brand-name">MimiRichies Bite</h1>
            <p className="al-brand-sub">Admin Panel</p>
          </div>
        </div>

        <h2 className="al-title">Sign in</h2>
        <p className="al-desc">Enter your admin password to continue</p>

        <form onSubmit={handleSubmit} className="al-form">
          <div className="al-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          {error && <div className="al-error">{error}</div>}

          <button type="submit" disabled={loading} className="al-btn">
            {loading ? (
              <span className="al-spinner-wrap">
                <span className="al-spinner" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="al-footer">MimiRichies Bite &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
