import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="logo footer-logo">
                            <div className="logo-mark">SN</div>
                            <div className="logo-text">
                                <span className="logo-name">SN Jewellers</span>
                                <span className="logo-tagline">Fine Jewellery</span>
                            </div>
                        </Link>
                        <p>
                            Crafting timeless jewellery since generations. Every piece tells a story of heritage,
                            artistry, and uncompromising quality.
                        </p>
                    </div>

                    <div>
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/collections/gold">Gold Collection</Link>
                            <Link to="/collections/silver">Silver Collection</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h4>Categories</h4>
                        <div className="footer-links">
                            <Link to="/collections/gold?sub=necklace">Necklaces</Link>
                            <Link to="/collections/gold?sub=ring">Rings</Link>
                            <Link to="/collections/gold?sub=earring">Earrings</Link>
                            <Link to="/collections/gold?sub=bangle">Bangles</Link>
                            <Link to="/collections/silver?sub=bracelet">Bracelets</Link>
                        </div>
                    </div>

                    <div>
                        <h4>Get in Touch</h4>
                        <div className="footer-contact-item">
                            <MapPin size={16} />
                            <span>Porsa Road, Ambah — 476111<br />Morena, Madhya Pradesh</span>
                        </div>
                        <div className="footer-contact-item">
                            <Phone size={16} />
                            <a href="tel:+919584708876" style={{ color: 'inherit', textDecoration: 'none' }}>+91 95847 08876</a>
                        </div>
                        <div className="footer-contact-item">
                            <Mail size={16} />
                            <a href="mailto:aviralgupta.2919@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>aviralgupta.2919@gmail.com</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>&copy; {new Date().getFullYear()} SN Jewellers. All rights reserved.</span>
                    <span>Crafted with care in India</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
