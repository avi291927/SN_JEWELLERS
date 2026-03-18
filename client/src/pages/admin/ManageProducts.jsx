import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/ui/Toast';
import { formatPrice, capitalize, subcategories } from '../../utils/helpers';
import {
    LayoutDashboard, Package, MessageSquare, LogOut,
    PlusCircle, Pencil, Trash2, Upload, X, Gem, Star
} from 'lucide-react';

const ManageProducts = () => {
    const { user, isAdminLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: 'gold',
        subcategory: 'necklace', weight: '', purity: '', in_stock: true, featured: false
    });
    const [files, setFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const { toasts, success, error } = useToast();

    useEffect(() => {
        document.title = 'Manage Products — SN Jewellers';
        if (!isAdminLoggedIn) {
            navigate('/admin/login');
            return;
        }
        fetchProducts();
        if (searchParams.get('action') === 'add') openAddModal();
    }, [isAdminLoggedIn]);

    const fetchProducts = async () => {
        try {
            const result = await productAPI.getAll({ limit: 100 });
            setProducts(result.products);
        } catch (err) {
            error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditProduct(null);
        setFormData({ name: '', description: '', price: '', category: 'gold', subcategory: 'necklace', weight: '', purity: '', in_stock: true, featured: false });
        setFiles([]);
        setExistingImages([]);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditProduct(product);
        setFormData({
            name: product.name, description: product.description, price: product.price,
            category: product.category, subcategory: product.subcategory,
            weight: product.weight || '', purity: product.purity || '',
            in_stock: product.in_stock, featured: product.featured
        });
        setExistingImages(product.images || []);
        setFiles([]);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Upload new images
            const uploadedUrls = [];
            for (const file of files) {
                const url = await productAPI.uploadImage(file);
                uploadedUrls.push(url);
            }
            const allImages = [...existingImages, ...uploadedUrls];

            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                subcategory: formData.subcategory,
                weight: formData.weight,
                purity: formData.purity,
                in_stock: formData.in_stock,
                featured: formData.featured,
                images: allImages
            };

            if (editProduct) {
                await productAPI.update(editProduct.id, productData);
                success('Product updated successfully');
            } else {
                await productAPI.create(productData);
                success('Product created successfully');
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            error(err.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await productAPI.delete(id);
            success('Product deleted successfully');
            fetchProducts();
        } catch (err) {
            error('Failed to delete product');
        }
    };

    const handleFileChange = (e) => {
        setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    };

    const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));
    const removeExistingImage = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));
    const handleLogout = async () => { await logout(); navigate('/'); };

    if (!isAdminLoggedIn) return null;

    return (
        <div className="admin-layout">
            <Toast toasts={toasts} />
            <aside className="admin-sidebar">
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <Link to="/" className="logo footer-logo">
                        <div className="logo-mark" style={{ width: '36px', height: '36px', fontSize: '13px' }}>SN</div>
                        <div className="logo-text">
                            <span className="logo-name" style={{ fontSize: '0.9rem' }}>SN Jewellers</span>
                            <span className="logo-tagline" style={{ fontSize: '0.6rem' }}>Admin Panel</span>
                        </div>
                    </Link>
                </div>
                <nav>
                    <Link to="/admin" className="admin-sidebar-link"><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link to="/admin/products" className="admin-sidebar-link active"><Package size={18} /> Products</Link>
                    <Link to="/admin/enquiries" className="admin-sidebar-link"><MessageSquare size={18} /> Enquiries</Link>
                    <Link to="/admin/feedback" className="admin-sidebar-link"><Star size={18} /> Feedback</Link>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2xl)' }}>
                    <button onClick={handleLogout} className="admin-sidebar-link" style={{ width: '100%' }}><LogOut size={18} /> Logout</button>
                </div>
            </aside>

            <main className="admin-content">
                <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div><h2>Products</h2><p>Manage your jewellery products</p></div>
                    <button className="btn btn-primary" onClick={openAddModal}><PlusCircle size={16} /> Add Product</button>
                </div>

                {loading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                ) : products.length > 0 ? (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr><th>Product</th><th>Category</th><th>Price</th><th>Weight</th><th>Status</th><th>Featured</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="table-product-cell">
                                                <div className="table-product-thumb">
                                                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <div className="product-placeholder" style={{ width: '100%', height: '100%' }}><Gem size={16} /></div>}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{product.name}</span>
                                            </div>
                                        </td>
                                        <td><span className={`product-card-badge ${product.category === 'gold' ? 'badge-gold' : 'badge-silver'}`}>{capitalize(product.category)}</span></td>
                                        <td>{formatPrice(product.price)}</td>
                                        <td>{product.weight || '—'}</td>
                                        <td><span className={`status-badge ${product.in_stock ? 'status-in-stock' : 'status-out-of-stock'}`}>{product.in_stock ? 'In Stock' : 'Out of Stock'}</span></td>
                                        <td>{product.featured ? 'Yes' : 'No'}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn" onClick={() => openEditModal(product)} title="Edit"><Pencil size={15} /></button>
                                                <button className="action-btn delete" onClick={() => handleDelete(product.id)} title="Delete"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <Package size={48} /><h3>No Products Yet</h3><p>Start building your collection by adding your first product.</p>
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={openAddModal}><PlusCircle size={16} /> Add First Product</button>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                            <div className="modal-header">
                                <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button className="action-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Product Name</label>
                                        <input type="text" className="form-input" required placeholder="e.g., Royal Heritage Gold Necklace"
                                            value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-input" rows="3" required placeholder="Describe the product..."
                                            value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}></textarea>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Price (INR)</label>
                                            <input type="number" className="form-input" required min="0" placeholder="e.g., 50000"
                                                value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select className="form-input" value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}>
                                                <option value="gold">Gold</option><option value="silver">Silver</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Subcategory</label>
                                            <select className="form-input" value={formData.subcategory} onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}>
                                                {subcategories.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Weight</label>
                                            <input type="text" className="form-input" placeholder="e.g., 25g"
                                                value={formData.weight} onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Purity</label>
                                            <input type="text" className="form-input" placeholder="e.g., 22K or 92.5%"
                                                value={formData.purity} onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Options</label>
                                            <div style={{ display: 'flex', gap: 'var(--space-lg)', paddingTop: '10px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={formData.in_stock} onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))} /> In Stock
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} /> Featured
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Product Images</label>
                                        <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                                            <Upload size={28} /><p>Click to upload images (max 5MB each)</p>
                                        </div>
                                        <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleFileChange} />
                                        {(existingImages.length > 0 || files.length > 0) && (
                                            <div className="image-preview-grid">
                                                {existingImages.map((img, i) => (
                                                    <div key={'ex-' + i} className="image-preview-item">
                                                        <img src={img} alt={`existing ${i}`} />
                                                        <button type="button" className="image-preview-remove" onClick={() => removeExistingImage(i)}>x</button>
                                                    </div>
                                                ))}
                                                {files.map((file, i) => (
                                                    <div key={'new-' + i} className="image-preview-item">
                                                        <img src={URL.createObjectURL(file)} alt={`new ${i}`} />
                                                        <button type="button" className="image-preview-remove" onClick={() => removeFile(i)}>x</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageProducts;
