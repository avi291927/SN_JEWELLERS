import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { capitalize, subcategories } from '../utils/helpers';

const Products = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [filters, setFilters] = useState({
        subcategory: searchParams.get('sub') || '',
        sort: 'newest',
        minPrice: '',
        maxPrice: '',
        search: ''
    });

    const catLabel = category === 'gold' ? 'Gold Jewellery' : category === 'silver' ? 'Silver Jewellery' : 'All Jewellery';

    useEffect(() => {
        document.title = `${catLabel} — SN Jewellers`;
    }, [catLabel]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = { page, limit: 12 };
                if (category) params.category = category;
                if (filters.subcategory) params.subcategory = filters.subcategory;
                if (filters.sort === 'price_asc') params.sort = 'price_asc';
                else if (filters.sort === 'price_desc') params.sort = 'price_desc';
                if (filters.minPrice) params.minPrice = filters.minPrice;
                if (filters.maxPrice) params.maxPrice = filters.maxPrice;
                if (filters.search) params.search = filters.search;

                const result = await productAPI.getAll(params);
                setProducts(result.products);
                setTotal(result.total);
                setPages(result.pages);
            } catch (err) {
                console.error('Error fetching products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category, page, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    return (
        <>
            <div className="page-hero">
                <div className="container">
                    <div className="breadcrumb" style={{ justifyContent: 'center' }}>
                        <Link to="/">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>{catLabel}</span>
                    </div>
                    <h1>{catLabel}</h1>
                    <p>
                        {category === 'gold'
                            ? 'Discover our exquisite range of gold jewellery, crafted with precision and passion.'
                            : category === 'silver'
                                ? 'Explore our elegant silver collection, where tradition meets contemporary design.'
                                : 'Browse our complete collection of fine jewellery.'}
                    </p>
                </div>
            </div>

            <section className="section-sm">
                <div className="container">
                    <div className="filter-bar">
                        <div className="filter-group">
                            <SlidersHorizontal size={16} color="var(--color-text-muted)" />
                            <select
                                className="filter-select"
                                value={filters.subcategory}
                                onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                            >
                                <option value="">All Types</option>
                                {subcategories.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                className="filter-select"
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <input
                                type="number"
                                className="filter-select"
                                placeholder="Min Price"
                                style={{ width: '110px' }}
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />
                            <span style={{ color: 'var(--color-text-light)' }}>—</span>
                            <input
                                type="number"
                                className="filter-select"
                                placeholder="Max Price"
                                style={{ width: '110px' }}
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />
                        </div>

                        <span className="results-count">{total} {total === 1 ? 'product' : 'products'}</span>
                    </div>

                    {loading ? (
                        <div className="loading-spinner"><div className="spinner"></div></div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            {pages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        disabled={page <= 1}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        &laquo;
                                    </button>
                                    {Array.from({ length: pages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="pagination-btn"
                                        disabled={page >= pages}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        &raquo;
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <Search size={48} />
                            <h3>No Products Found</h3>
                            <p>Try adjusting your filters to find what you are looking for.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Products;
