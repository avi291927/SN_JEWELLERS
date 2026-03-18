import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gem, Award, Users, Heart, ArrowRight } from 'lucide-react';

const About = () => {
    useEffect(() => {
        document.title = 'About Us — SN Jewellers';
    }, []);

    return (
        <>
            <div className="page-hero">
                <div className="container">
                    <span className="overline">Our Story</span>
                    <h1>About SN Jewellers</h1>
                    <p>A legacy of craftsmanship, trust, and timeless elegance in fine jewellery.</p>
                </div>
            </div>

            {/* Heritage */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3xl)', alignItems: 'center' }}>
                        <div>
                            <span className="overline">Our Heritage</span>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Crafting Beauty Since Generations</h2>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: 'var(--space-md)' }}>
                                SN Jewellers was founded with a singular vision — to create jewellery that celebrates life's most precious moments.
                                What began as a small family workshop has grown into a trusted name in fine jewellery, known for exceptional
                                craftsmanship and uncompromising quality.
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: 'var(--space-md)' }}>
                                Every piece that leaves our workshop carries with it the dedication of our master artisans, who combine
                                traditional techniques passed down through generations with contemporary design sensibilities. We believe
                                that jewellery is more than adornment — it is an expression of identity, love, and legacy.
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9 }}>
                                Our commitment to purity, transparency, and customer satisfaction has earned us the trust of thousands
                                of families who have made SN Jewellers their preferred destination for gold and silver jewellery.
                            </p>
                        </div>
                        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                            <img src="/images/site/hero.png" alt="SN Jewellers Heritage" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder */}
            <section className="section" style={{ background: 'var(--color-cream)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 'var(--space-3xl)', alignItems: 'center' }}>
                        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                            <img src="/images/site/founder.png" alt="Founder of SN Jewellers" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <span className="overline">Meet the Founder</span>
                            <h2 style={{ marginBottom: 'var(--space-sm)' }}>Neeraj Kumar Gupta</h2>
                            <p style={{ color: 'var(--color-gold)', fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--space-lg)' }}>Founder &amp; Owner, SN Jewellers</p>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: 'var(--space-md)' }}>
                                With a deep passion for jewellery and an unwavering commitment to quality, the founder of SN Jewellers
                                established this brand with the belief that every customer deserves access to authentic, beautifully
                                crafted jewellery at fair prices.
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: 'var(--space-md)' }}>
                                Under his leadership, SN Jewellers has grown from a single store to a trusted brand, known for its
                                extensive collection of gold and silver jewellery that blends traditional Indian aesthetics with
                                modern design sensibilities.
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9 }}>
                                His philosophy is simple: "Every piece of jewellery we create should be worthy of being passed down
                                through generations." This guiding principle continues to inspire every design, every gemstone selection,
                                and every customer interaction at SN Jewellers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="overline">What Defines Us</span>
                        <h2>Our Core Values</h2>
                        <div className="section-divider"></div>
                    </div>
                    <div className="values-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div className="value-card">
                            <div className="value-icon"><Gem size={24} /></div>
                            <h4>Purity</h4>
                            <p>BIS Hallmarked gold and certified silver. We guarantee the purity of every piece we sell.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><Award size={24} /></div>
                            <h4>Craftsmanship</h4>
                            <p>Master artisans with decades of experience, creating jewellery that stands the test of time.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><Users size={24} /></div>
                            <h4>Trust</h4>
                            <p>Transparent pricing, ethical sourcing, and honest dealings — the foundation of our business.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><Heart size={24} /></div>
                            <h4>Passion</h4>
                            <p>Every piece is created with love and dedication, reflecting our passion for fine jewellery.</p>
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
                    <h2 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>Experience Our Collection</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto var(--space-xl)', lineHeight: 1.8 }}>
                        Visit our store to explore our complete range of gold and silver jewellery.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
                        <Link to="/collections/gold" className="btn btn-primary btn-lg">
                            Browse Gold <ArrowRight size={16} />
                        </Link>
                        <Link to="/collections/silver" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                            Browse Silver <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
