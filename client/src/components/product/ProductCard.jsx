import { Link } from 'react-router-dom';
import { Gem } from 'lucide-react';
import { formatPrice, capitalize } from '../../utils/helpers';

const ProductCard = ({ product }) => {
    const hasImage = product.images && product.images.length > 0;

    return (
        <div className="product-card" id={`product-${product.id}`}>
            <Link to={`/product/${product.id}`}>
                <div className="product-card-image">
                    {hasImage ? (
                        <img src={product.images[0]} alt={product.name} loading="lazy" />
                    ) : (
                        <div className="product-placeholder">
                            <Gem size={48} />
                        </div>
                    )}
                    <span className={`product-card-badge ${product.category === 'gold' ? 'badge-gold' : 'badge-silver'}`}>
                        {capitalize(product.category)}
                    </span>
                </div>
            </Link>
            <div className="product-card-body">
                <div className="product-card-category">{capitalize(product.subcategory)}</div>
                <h3 className="product-card-name">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <div className="product-card-meta">
                    <span className="product-card-price">{formatPrice(product.price)}</span>
                    {product.weight && <span className="product-card-weight">{product.weight}</span>}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
