'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, ImagePlus, X, Tag, ToggleLeft, ToggleRight, Package } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'Main',
  badge: '',
  available: true,
  image: '',
  imagePublicId: '',
};

const CATEGORIES = ['Main', 'Sides', 'Drinks', 'Desserts', 'Specials'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setPreviewUrl('');
    setError('');
    setPanelOpen(true);
  }

  function openEdit(product) {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category || 'Main',
      badge: product.badge || '',
      available: product.available,
      image: product.image || '',
      imagePublicId: product.imagePublicId || '',
    });
    setPreviewUrl(product.image || '');
    setError('');
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setPreviewUrl('');
    setError('');
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, image: data.url, imagePublicId: data.publicId }));
      } else {
        setError('Image upload failed. Check Cloudinary config.');
        setPreviewUrl('');
      }
    } catch {
      setError('Image upload failed.');
      setPreviewUrl('');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.description.trim() || !form.price) {
      setError('Name, description and price are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      const url = editing ? `/api/admin/products/${editing}` : '/api/admin/products';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        closePanel();
        fetchProducts();
      } else {
        setError(data.message || 'Save failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id) {
    setConfirmId(id);
  }

  async function executeDelete() {
    const id = confirmId;
    setConfirmId(null);
    setDeleting(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } finally {
      setDeleting(null);
    }
  }

  async function toggleAvailable(product) {
    await fetch(`/api/admin/products/${product._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !product.available }),
    });
    fetchProducts();
  }

  return (
    <div className="products-page">
      {/* Delete confirm dialog */}
      {confirmId && (
        <div className="prod-confirm-overlay" onClick={() => setConfirmId(null)}>
          <div className="prod-confirm-box" onClick={e => e.stopPropagation()}>
            <div className="prod-confirm-icon">
              <Trash2 size={22} color="#dc2626" />
            </div>
            <p className="prod-confirm-title">Delete this product?</p>
            <p className="prod-confirm-sub">This action cannot be undone.</p>
            <div className="prod-confirm-actions">
              <button className="prod-confirm-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="prod-confirm-delete" onClick={executeDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in panel backdrop */}
      {panelOpen && <div className="prod-panel-backdrop" onClick={closePanel} />}

      {/* Slide-in form panel */}
      <div className={`prod-panel ${panelOpen ? 'prod-panel-open' : ''}`}>
        <div className="prod-panel-header">
          <h2 className="prod-panel-title">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <button className="prod-panel-close" onClick={closePanel}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="prod-form">
          {/* Image upload */}
          <div className="prod-field">
            <label className="prod-label">Product Image</label>
            <div
              className="prod-img-upload"
              onClick={() => fileRef.current?.click()}
              style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : 'none' }}
            >
              {!previewUrl && (
                <div className="prod-img-placeholder">
                  <ImagePlus size={28} strokeWidth={1.5} />
                  <span>Click to upload image</span>
                  <span className="prod-img-hint">JPG, PNG or WEBP · max 5 MB</span>
                </div>
              )}
              {uploadingImage && (
                <div className="prod-img-uploading">
                  <span className="prod-spinner" />
                  Uploading...
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {previewUrl && !uploadingImage && (
              <button type="button" className="prod-img-remove" onClick={() => { setPreviewUrl(''); setForm(p => ({ ...p, image: '', imagePublicId: '' })); }}>
                Remove image
              </button>
            )}
          </div>

          <div className="prod-field">
            <label className="prod-label">Product Name <span className="prod-required">*</span></label>
            <input className="prod-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chicken Shawarma" required />
          </div>

          <div className="prod-field">
            <label className="prod-label">Description <span className="prod-required">*</span></label>
            <textarea className="prod-input prod-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Short description of the item…" required />
          </div>

          <div className="prod-row-2">
            <div className="prod-field">
              <label className="prod-label">Price (₦) <span className="prod-required">*</span></label>
              <input className="prod-input" name="price" type="number" min="0" step="50" value={form.price} onChange={handleChange} placeholder="3000" required />
            </div>
            <div className="prod-field">
              <label className="prod-label">Category</label>
              <select className="prod-input" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="prod-field">
            <label className="prod-label">
              <Tag size={13} style={{ display: 'inline', marginRight: 4 }} />
              Badge <span className="prod-optional">(optional)</span>
            </label>
            <input className="prod-input" name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. Best Seller, New, Featured" />
          </div>

          <div className="prod-toggle-row">
            <div>
              <div className="prod-label">Available on menu</div>
              <div className="prod-toggle-hint">Customers can see and order this item</div>
            </div>
            <button type="button" className="prod-toggle-btn" onClick={() => setForm(p => ({ ...p, available: !p.available }))}>
              {form.available
                ? <ToggleRight size={32} color="#f97316" />
                : <ToggleLeft size={32} color="#94a3b8" />}
            </button>
          </div>

          {error && <div className="prod-error">{error}</div>}

          <div className="prod-form-actions">
            <button type="button" className="prod-btn-cancel" onClick={closePanel}>Cancel</button>
            <button type="submit" className="prod-btn-save" disabled={saving || uploadingImage}>
              {saving ? <><span className="prod-spinner" /> Saving…</> : editing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Page header */}
      <div className="products-header">
        <div>
          <h1 className="products-heading">Products</h1>
          <p className="products-sub">{products.length} item{products.length !== 1 ? 's' : ''} on your menu</p>
        </div>
        <button className="prod-add-btn" onClick={openAdd}>
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="orders-empty"><div className="orders-loading-spinner" /><p>Loading products…</p></div>
      ) : products.length === 0 ? (
        <div className="orders-empty">
          <Package size={48} strokeWidth={1} color="#cbd5e1" />
          <p style={{ marginTop: 16 }}>No products yet. Add your first menu item.</p>
          <button className="prod-add-btn" style={{ marginTop: 12 }} onClick={openAdd}><Plus size={16} /> Add Product</button>
        </div>
      ) : (
        <div className="prod-grid">
          {products.map(product => (
            <div key={product._id} className={`prod-card ${!product.available ? 'prod-card-unavailable' : ''}`}>
              <div className="prod-card-img">
                {product.image
                  ? <img src={product.image} alt={product.name} />
                  : <div className="prod-card-no-img"><Package size={32} strokeWidth={1} color="#cbd5e1" /></div>}
                {product.badge && <span className="prod-card-badge">{product.badge}</span>}
                {!product.available && <span className="prod-card-hidden-badge">Hidden</span>}
              </div>

              <div className="prod-card-body">
                <div className="prod-card-meta">
                  <span className="prod-card-category">{product.category}</span>
                </div>
                <h3 className="prod-card-name">{product.name}</h3>
                <p className="prod-card-desc">{product.description}</p>
                <div className="prod-card-footer">
                  <span className="prod-card-price">₦{Number(product.price).toLocaleString()}</span>
                  <div className="prod-card-actions">
                    <button
                      className="prod-icon-btn prod-toggle-visible"
                      onClick={() => toggleAvailable(product)}
                      title={product.available ? 'Hide from menu' : 'Show on menu'}
                    >
                      {product.available ? <ToggleRight size={18} color="#f97316" /> : <ToggleLeft size={18} color="#94a3b8" />}
                    </button>
                    <button className="prod-icon-btn" onClick={() => openEdit(product)} title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button
                      className="prod-icon-btn prod-icon-btn-danger"
                      onClick={() => handleDelete(product._id)}
                      disabled={deleting === product._id}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
