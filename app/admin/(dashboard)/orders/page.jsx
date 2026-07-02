'use client';
import { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Package, Clock3, CheckCircle2, RefreshCw } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  preparing: { label: 'Preparing', color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe' },
  completed: { label: 'Completed', color: '#059669', bg: '#d1fae5', border: '#a7f3d0' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
};

const NEXT_STATUS = {
  pending: 'preparing',
  preparing: 'completed',
};

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-NG', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Lagos',
  });
}

function isToday(iso) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setLastRefresh(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function updateStatus(id, status) {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) await fetchOrders();
    } finally {
      setUpdating(null);
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    today: orders.filter(o => isToday(o.createdAt)).length,
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const filterTabs = [
    { key: 'all',       label: 'All',       count: stats.total },
    { key: 'pending',   label: 'Pending',   count: stats.pending },
    { key: 'preparing', label: 'Preparing', count: stats.preparing },
    { key: 'completed', label: 'Completed', count: stats.completed },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <div className="orders-page">
      {/* Stats Grid */}
      <div className="orders-stats">
        {[
          { label: "Today's Orders", value: stats.today,     Icon: CalendarDays, color: '#f97316', bg: '#fff7ed' },
          { label: 'Total Orders',   value: stats.total,     Icon: Package,      color: '#6366f1', bg: '#eef2ff' },
          { label: 'Pending',        value: stats.pending,   Icon: Clock3,       color: '#d97706', bg: '#fefce8' },
          { label: 'Completed',      value: stats.completed, Icon: CheckCircle2, color: '#059669', bg: '#f0fdf4' },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="stat-card" style={{ '--stat-color': color }}>
            <div className="stat-icon-wrap" style={{ background: bg }}>
              <Icon size={22} color={color} strokeWidth={1.8} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Header bar */}
      <div className="orders-header">
        <h2 className="orders-heading">Orders</h2>
        <div className="orders-header-right">
          {lastRefresh && (
            <span className="orders-refresh-time">
              Updated {lastRefresh.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button className="orders-refresh-btn" onClick={fetchOrders} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'ofv2-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${filter === tab.key ? 'filter-tab-active' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className="filter-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="orders-empty">
          <div className="orders-loading-spinner" />
          <p>Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">📭</div>
          <p>No {filter !== 'all' ? filter : ''} orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const isExpanded = expanded === order._id;
            const isUpdating = updating === order._id;

            return (
              <div key={order._id} className="order-card">
                <div
                  className="order-card-header"
                  onClick={() => setExpanded(isExpanded ? null : order._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setExpanded(isExpanded ? null : order._id)}
                >
                  <div className="order-card-left">
                    <div className="order-id">#{order._id?.toString().slice(-6).toUpperCase()}</div>
                    <div className="order-customer">
                      <span className="order-name">{order.name}</span>
                      <span className="order-food">{order.food}</span>
                    </div>
                  </div>
                  <div className="order-card-right">
                    <span
                      className="order-status-badge"
                      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </span>
                    <span className="order-toggle">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="order-card-body">
                    <div className="order-details-grid">
                      <div className="order-detail">
                        <span className="order-detail-label">Phone</span>
                        <a href={`tel:${order.phone}`} className="order-detail-value order-link">{order.phone}</a>
                      </div>
                      <div className="order-detail">
                        <span className="order-detail-label">Email</span>
                        <a href={`mailto:${order.email}`} className="order-detail-value order-link">{order.email}</a>
                      </div>
                      <div className="order-detail">
                        <span className="order-detail-label">Delivery Location</span>
                        <span className="order-detail-value">{order.location}</span>
                      </div>
                      <div className="order-detail">
                        <span className="order-detail-label">Ordered At</span>
                        <span className="order-detail-value">{formatDate(order.createdAt)}</span>
                      </div>
                      {order.instructions && (
                        <div className="order-detail order-detail-full">
                          <span className="order-detail-label">Special Instructions</span>
                          <span className="order-detail-value">{order.instructions}</span>
                        </div>
                      )}
                    </div>

                    <div className="order-actions">
                      {NEXT_STATUS[order.status] && (
                        <button
                          className="order-action-btn order-action-primary"
                          onClick={() => updateStatus(order._id, NEXT_STATUS[order.status])}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Updating...' : `Mark as ${STATUS_CONFIG[NEXT_STATUS[order.status]].label}`}
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                          className="order-action-btn order-action-danger"
                          onClick={() => updateStatus(order._id, 'cancelled')}
                          disabled={isUpdating}
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.status === 'cancelled' && (
                        <button
                          className="order-action-btn order-action-secondary"
                          onClick={() => updateStatus(order._id, 'pending')}
                          disabled={isUpdating}
                        >
                          Restore to Pending
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
