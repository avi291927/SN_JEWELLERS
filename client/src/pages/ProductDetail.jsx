import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Gem, ChevronLeft, Send } from 'lucide-react';
import { productAPI, enquiryAPI } from '../services/api';
import { formatPrice, capitalize } from '../utils/helpers';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const { toasts, success, error } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productAPI.getOne(id);
                setProduct(data);
                document.title = `${data.name} — SN Jewellers`;
            } catch (err) {
                error('Product not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await enquiryAPI.create({
                ...enquiryForm,
                product_id: product.id,
                message: `Enquiry for ${product.name}: ${enquiryForm.message}`
            });
            success('Your enquiry has been submitted successfully. We will get back to you shortly.');
            setEnquiryForm({ name: '', email: '', phone: '', message: '' });
            setShowEnquiry(false);
        } catch (err) {
            error('Failed to submit enquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ marginTop: 'var(--header-height)' }}>
                <div className="loading-spinner"><div className="spinner"></div></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-hero">
                <div className="container">
                    <div className="empty-state">
                        <h3>Product Not Found</h3>
                        <p>The product you are looking for does not exist.</p>
                        <Link to="/collections/gold" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const hasImages = product.images && product.images.length > 0;

    return (
        <>
            <Toast toasts={toasts} />
            <div className="product-detail">
                <div className="container">
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to={`/collections/${product.category}`}>{capitalize(product.category)} Jewellery</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>{product.name}</span>
                    </div>

                    <div className="product-detail-grid">
                        <div className="product-gallery">
                            <div className="product-main-image">
                                {hasImages ? (
                                    <img src={product.images[selectedImage]} alt={product.name} />
                                ) : (
                                    <div className="product-placeholder">
                                        <Gem size={80} />
                                    </div>
                                )}
                            </div>
                            {hasImages && product.images.length > 1 && (
                                <div className="product-thumbnails">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            className={`product-thumbnail ${i === selectedImage ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(i)}
                                        >
                                            <img src={img} alt={`${product.name} ${i + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="product-info">
                            <div className="overline">{capitalize(product.category)} — {capitalize(product.subcategory)}</div>
                            <h1>{product.name}</h1>
                            <div className="product-price-tag">{formatPrice(product.price)}</div>

                            <div className="product-meta-grid">
                                {product.weight && (
                                    <div className="product-meta-item">
                                        <span className="product-meta-label">Weight</span>
                                        <span className="product-meta-value">{product.weight}</span>
                                    </div>
                                )}
                                {product.purity && (
                                    <div className="product-meta-item">
                                        <span className="product-meta-label">Purity</span>
                                        <span className="product-meta-value">{product.purity}</span>
                                    </div>
                                )}
                                <div className="product-meta-item">
                                    <span className="product-meta-label">Category</span>
                                    <span className="product-meta-value">{capitalize(product.category)}</span>
                                </div>
                                <div className="product-meta-item">
                                    <span className="product-meta-label">Availability</span>
                                    <span className="product-meta-value" style={{ color: product.in_stock ? 'var(--color-success)' : 'var(--color-error)' }}>
                                        {product.in_stock ? 'In Stock' : 'Made to Order'}
                                    </span>
                                </div>
                            </div>

                            <p className="product-description">{product.description}</p>

                            <div className="product-actions">
                                <button className="btn btn-primary btn-lg" onClick={() => setShowEnquiry(!showEnquiry)}>
                                    <Send size={16} />
                                    Enquire Now
                                </button>
                                <Link to={`/collections/${product.category}`} className="btn btn-outline btn-lg">
                                    <ChevronLeft size={16} />
                                    Back
                                </Link>
                            </div>

                            {showEnquiry && (
                                <div className="enquiry-form-section slide-up">
                                    <h3>Send Enquiry</h3>
                                    <form onSubmit={handleEnquirySubmit}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Your Name</label>
                                                <input type="text" className="form-input" required value={enquiryForm.name}
                                                    onChange={(e) => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Email</label>
                                                <input type="email" className="form-input" required value={enquiryForm.email}
                                                    onChange={(e) => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input type="tel" className="form-input" required value={enquiryForm.phone}
                                                onChange={(e) => setEnquiryForm(prev => ({ ...prev, phone: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Message</label>
                                            <textarea className="form-input" rows="4" required placeholder="Tell us about your requirements..."
                                                value={enquiryForm.message}
                                                onChange={(e) => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                                            {submitting ? 'Submitting...' : 'Submit Enquiry'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
