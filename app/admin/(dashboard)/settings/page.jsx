'use client';
import { useState, useEffect } from 'react';
import {
  Store, Phone, MapPin, Mail, Lock, Send,
  ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, Save,
} from 'lucide-react';

function Toast({ toast }) {
  if (!toast.visible) return null;
  return (
    <div className={`settings-toast ${toast.type}`}>
      {toast.type === 'success'
        ? <CheckCircle2 size={15} />
        : <AlertCircle size={15} />}
      {toast.message}
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-icon"><Icon size={17} /></div>
        <h2 className="settings-section-title">{title}</h2>
      </div>
      <div className="settings-section-body">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const [storeOpen, setStoreOpen] = useState(true);
  const [info, setInfo] = useState({ businessName: '', phone: '', whatsapp: '', address: '', notificationEmail: '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [testEmail, setTestEmail] = useState('');

  function showToast(message, type = 'success') {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);
  }

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const s = d.settings;
          setStoreOpen(s.storeOpen ?? true);
          setInfo({
            businessName: s.businessName || '',
            phone: s.phone || '',
            whatsapp: s.whatsapp || '',
            address: s.address || '',
            notificationEmail: s.notificationEmail || '',
          });
        }
      })
      .catch(() => showToast('Failed to load settings.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  async function patch(action, body, key) {
    setSaving(key);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action ? { action, ...body } : body),
      });
      const d = await res.json();
      if (d.success) showToast(d.message || 'Saved successfully.');
      else showToast(d.message || 'Something went wrong.', 'error');
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSaving('');
    }
  }

  async function toggleStore() {
    const next = !storeOpen;
    setStoreOpen(next);
    await patch(null, { storeOpen: next }, 'store');
  }

  async function saveInfo(e) {
    e.preventDefault();
    await patch(null, info, 'info');
  }

  async function changePassword(e) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    await patch('changePassword', { currentPassword: passwords.current, newPassword: passwords.next }, 'password');
    setPasswords({ current: '', next: '', confirm: '' });
  }

  async function sendTest(e) {
    e.preventDefault();
    await patch('testEmail', { email: testEmail }, 'email');
  }

  if (loading) {
    return (
      <div className="orders-empty">
        <div className="orders-loading-spinner" />
        <p>Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Toast toast={toast} />

      <div className="settings-header">
        <h1 className="settings-heading">Settings</h1>
        <p className="settings-sub">Manage your restaurant and admin preferences</p>
      </div>

      {/* Store Status */}
      <Section icon={Store} title="Store Status">
        <div className="settings-toggle-row">
          <div>
            <div className="settings-toggle-label">Accepting Orders</div>
            <div className="settings-toggle-hint">
              {storeOpen ? 'Your store is online and accepting orders.' : 'Your store is closed — orders are paused.'}
            </div>
          </div>
          <button
            className={`settings-toggle-btn ${storeOpen ? 'active' : ''}`}
            onClick={toggleStore}
            disabled={saving === 'store'}
          >
            {storeOpen
              ? <ToggleRight size={36} color="#f97316" />
              : <ToggleLeft size={36} color="#94a3b8" />}
          </button>
        </div>
        <div className={`settings-status-pill ${storeOpen ? 'open' : 'closed'}`}>
          <span className="settings-status-dot" />
          {storeOpen ? 'Store is open' : 'Store is closed'}
        </div>
      </Section>

      {/* Business Info */}
      <Section icon={Phone} title="Business Info">
        <form onSubmit={saveInfo} className="settings-form">
          <div className="settings-field">
            <label className="settings-label">Business Name</label>
            <input
              className="settings-input"
              value={info.businessName}
              onChange={e => setInfo(p => ({ ...p, businessName: e.target.value }))}
              placeholder="MimiRichies Bite"
            />
          </div>
          <div className="settings-row-2">
            <div className="settings-field">
              <label className="settings-label">Phone Number</label>
              <input
                className="settings-input"
                value={info.phone}
                onChange={e => setInfo(p => ({ ...p, phone: e.target.value }))}
                placeholder="+234 814 580 1171"
                type="tel"
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">WhatsApp Number</label>
              <input
                className="settings-input"
                value={info.whatsapp}
                onChange={e => setInfo(p => ({ ...p, whatsapp: e.target.value }))}
                placeholder="+234 814 580 1171"
                type="tel"
              />
            </div>
          </div>
          <div className="settings-field">
            <label className="settings-label">
              <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
              Address
            </label>
            <input
              className="settings-input"
              value={info.address}
              onChange={e => setInfo(p => ({ ...p, address: e.target.value }))}
              placeholder="Pentagon Hotel & Suites, Choba, Port Harcourt"
            />
          </div>
          <div className="settings-field">
            <label className="settings-label">
              <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
              Order Notification Email
            </label>
            <input
              className="settings-input"
              value={info.notificationEmail}
              onChange={e => setInfo(p => ({ ...p, notificationEmail: e.target.value }))}
              placeholder="you@example.com"
              type="email"
            />
            <span className="settings-hint">New order alerts are sent to this address</span>
          </div>
          <button type="submit" className="settings-save-btn" disabled={saving === 'info'}>
            <Save size={15} />
            {saving === 'info' ? 'Saving…' : 'Save Info'}
          </button>
        </form>
      </Section>

      {/* Change Password */}
      <Section icon={Lock} title="Change Admin Password">
        <form onSubmit={changePassword} className="settings-form">
          <div className="settings-field">
            <label className="settings-label">Current Password</label>
            <input
              className="settings-input"
              type="password"
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              placeholder="Enter current password"
              required
            />
          </div>
          <div className="settings-row-2">
            <div className="settings-field">
              <label className="settings-label">New Password</label>
              <input
                className="settings-input"
                type="password"
                value={passwords.next}
                onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Confirm New Password</label>
              <input
                className="settings-input"
                type="password"
                value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password"
                required
              />
            </div>
          </div>
          <button type="submit" className="settings-save-btn" disabled={saving === 'password'}>
            <Lock size={15} />
            {saving === 'password' ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </Section>

      {/* Test Email */}
      <Section icon={Send} title="Email Notifications">
        <div className="settings-email-info">
          <div className="settings-email-row">
            <span className="settings-email-key">SMTP Host</span>
            <code className="settings-email-val">{process.env.NEXT_PUBLIC_SMTP_HOST || 'smtp.gmail.com'}</code>
          </div>
          <div className="settings-email-row">
            <span className="settings-email-key">Status</span>
            <span className="settings-status-pill open" style={{ display: 'inline-flex' }}>
              <span className="settings-status-dot" />Configured
            </span>
          </div>
        </div>
        <form onSubmit={sendTest} className="settings-form" style={{ marginTop: '1.25rem' }}>
          <div className="settings-field">
            <label className="settings-label">Send a test email to</label>
            <div className="settings-inline-row">
              <input
                className="settings-input"
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <button type="submit" className="settings-send-btn" disabled={saving === 'email'}>
                <Send size={14} />
                {saving === 'email' ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </Section>
    </div>
  );
}
