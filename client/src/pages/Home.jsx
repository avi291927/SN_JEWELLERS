import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Gem, Sparkles } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'SN Jewellers — Exquisite Gold & Silver Jewellery';
        const fetchFeatured = async () => {
            try {
                const result = await productAPI.getAll({ featured: true, limit: 8 });
                setFeatured(result.products);
            } catch (err) {
                console.error('Error fetching featured products');
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <main>
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg-pattern"></div>
                <div className="hero-content">
                    <div className="hero-text slide-up">
                        <span className="hero-label">Timeless Elegance</span>
                        <h1>Jewellery That Tells <em>Your Story</em></h1>
                        <p className="hero-description">
                            Discover our exquisite collection of handcrafted gold and silver jewellery.
                            Each piece is a testament to generations of artistry and uncompromising quality.
                        </p>
                        <div className="hero-actions">
                            <Link to="/collections/gold" className="btn btn-primary btn-lg">
                                Explore Collection
                                <ArrowRight size={16} />
                            </Link>
                            <Link to="/about" className="btn btn-ghost btn-lg">
                                Our Story
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image fade-in">
                        <div className="hero-image-frame">
                            <img src="/images/site/hero.png" alt="SN Jewellers — Luxury Gold Jewellery Collection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="hero-accent-line top"></div>
                        <div className="hero-accent-line bottom"></div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="overline">Our Collections</span>
                        <h2>Explore by Category</h2>
                        <div className="section-divider"></div>
                        <p>From the warmth of gold to the cool elegance of silver, find the perfect piece for every occasion.</p>
                    </div>
                    <div className="category-grid">
                        <Link to="/collections/gold" className="category-card" id="category-gold">
                            <img src="/images/site/gold-category.png" alt="Gold Jewellery Collection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div className="category-card-overlay">
                                <h3 className="category-card-title">Gold Jewellery</h3>
                                <span className="category-card-info">Explore the Collection</span>
                            </div>
                        </Link>
                        <Link to="/collections/silver" className="category-card" id="category-silver">
                            <img src="/images/site/silver-category.png" alt="Silver Jewellery Collection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div className="category-card-overlay">
                                <h3 className="category-card-title">Silver Jewellery</h3>
                                <span className="category-card-info">Explore the Collection</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section" style={{ background: 'var(--color-cream)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="overline">Curated for You</span>
                        <h2>Featured Pieces</h2>
                        <div className="section-divider"></div>
                        <p>Handpicked selections from our finest collections, each crafted with extraordinary attention to detail.</p>
                    </div>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner"></div></div>
                    ) : (
                        <div className="products-grid">
                            {featured.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    {!loading && featured.length > 0 && (
                        <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                            <Link to="/collections/gold" className="btn btn-outline">
                                View All Products
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Values */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="overline">Why Choose Us</span>
                        <h2>The SN Promise</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon"><Shield size={24} /></div>
                            <h4>Certified Purity</h4>
                            <p>Every piece comes with a hallmark certification, guaranteeing the purity and quality of precious metals.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><Award size={24} /></div>
                            <h4>Master Craftsmanship</h4>
                            <p>Our skilled artisans bring decades of experience to create jewellery that stands the test of time.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><Gem size={24} /></div>
                            <h4>Timeless Design</h4>
                            <p>We blend traditional artistry with contemporary aesthetics to create pieces that transcend trends.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                background: 'var(--color-charcoal)',
                padding: 'var(--space-4xl) 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>Visit Our Store</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto var(--space-xl)', lineHeight: 1.8 }}>
                        Experience our collection in person. Our jewellery consultants are ready to help you find the perfect piece.
                    </p>
                    <Link to="/contact" className="btn btn-primary btn-lg">
                        Get in Touch
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default Home;
