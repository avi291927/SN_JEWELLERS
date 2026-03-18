require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        const admin = await User.create({
            name: 'SN Admin',
            email: 'admin@snjewellers.com',
            password: 'admin123456',
            role: 'admin',
            phone: '+91 98765 43210'
        });
        console.log('Admin user created:', admin.email);

        // Create sample products
        const products = [
            {
                name: 'Royal Heritage Gold Necklace',
                description: 'An exquisite handcrafted gold necklace featuring intricate floral motifs and traditional temple designs. This masterpiece is perfect for bridal ceremonies and special occasions. Each detail has been meticulously crafted by our expert artisans.',
                price: 185000,
                category: 'gold',
                subcategory: 'necklace',
                weight: '45g',
                purity: '22K',
                inStock: true,
                featured: true,
                images: []
            },
            {
                name: 'Maharani Diamond Ring',
                description: 'A stunning gold ring adorned with carefully selected diamonds in a vintage-inspired setting. The intricate detailing around the band adds a touch of royal elegance that is both timeless and contemporary.',
                price: 78000,
                category: 'gold',
                subcategory: 'ring',
                weight: '8g',
                purity: '18K',
                inStock: true,
                featured: true,
                images: []
            },
            {
                name: 'Celestial Gold Earrings',
                description: 'Graceful drop earrings inspired by celestial motifs, featuring delicate gold work and subtle diamond accents. These earrings effortlessly transition from day wear to evening elegance.',
                price: 42000,
                category: 'gold',
                subcategory: 'earring',
                weight: '12g',
                purity: '22K',
                inStock: true,
                featured: true,
                images: []
            },
            {
                name: 'Imperial Gold Bangle Set',
                description: 'A set of four intricately designed gold bangles featuring traditional motifs with a modern twist. Each bangle is crafted to perfection, making it an ideal addition to any jewellery collection.',
                price: 220000,
                category: 'gold',
                subcategory: 'bangle',
                weight: '60g',
                purity: '22K',
                inStock: true,
                featured: true,
                images: []
            },
            {
                name: 'Vintage Gold Chain',
                description: 'A classic gold chain with a distinctive vintage pattern. This versatile piece can be worn alone or paired with pendants for a personalized look. Crafted with the finest quality gold.',
                price: 95000,
                category: 'gold',
                subcategory: 'chain',
                weight: '25g',
                purity: '22K',
                inStock: true,
                featured: false,
                images: []
            },
            {
                name: 'Royal Gold Pendant',
                description: 'An elegant gold pendant featuring a floral design with intricate filigree work. This pendant is a testament to traditional craftsmanship and modern design sensibility.',
                price: 35000,
                category: 'gold',
                subcategory: 'pendant',
                weight: '6g',
                purity: '22K',
                inStock: true,
                featured: false,
                images: []
            },
            {
                name: 'Sterling Silver Statement Necklace',
                description: 'A bold sterling silver necklace featuring contemporary geometric designs. This statement piece combines modern aesthetics with traditional silver craftsmanship for a truly unique accessory.',
                price: 15000,
                category: 'silver',
                subcategory: 'necklace',
                weight: '35g',
                purity: '92.5%',
                inStock: true,
                featured: true,
                images: []
            },
            {
                name: 'Silver Elegance Ring',
                description: 'A beautifully crafted silver ring with an oxidized finish and intricate detailing. This ring is perfect for those who appreciate understated elegance and fine craftsmanship.',
                price: 4500,
                category: 'silver',
                subcategory: 'ring',
                weight: '5g',
                purity: '92.5%',
                inStock: true,
                featured: true,
                images: []
            },
            {
                name: 'Silver Cascade Earrings',
                description: 'Delicate silver earrings with a cascading design that catches the light beautifully. These earrings add a touch of sophistication to any ensemble.',
                price: 3800,
                category: 'silver',
                subcategory: 'earring',
                weight: '8g',
                purity: '92.5%',
                inStock: true,
                featured: false,
                images: []
            },
            {
                name: 'Silver Heritage Bracelet',
                description: 'A traditional silver bracelet featuring hand-engraved patterns inspired by ancient Indian art forms. This bracelet is both a fashion statement and a cultural treasure.',
                price: 8500,
                category: 'silver',
                subcategory: 'bracelet',
                weight: '18g',
                purity: '92.5%',
                inStock: true,
                featured: true,
                images: []
            },
            {
                name: 'Silver Anklet Pair',
                description: 'A pair of intricately designed silver anklets featuring tiny bells and traditional patterns. These anklets produce a delightful sound with every step.',
                price: 6000,
                category: 'silver',
                subcategory: 'anklet',
                weight: '20g',
                purity: '92.5%',
                inStock: true,
                featured: false,
                images: []
            },
            {
                name: 'Empress Gold Bracelet',
                description: 'A luxurious gold bracelet with woven link pattern and polished finish. This bracelet exudes sophistication and is perfect for both formal and casual occasions.',
                price: 125000,
                category: 'gold',
                subcategory: 'bracelet',
                weight: '30g',
                purity: '18K',
                inStock: true,
                featured: false,
                images: []
            }
        ];

        await Product.insertMany(products);
        console.log(`${products.length} products created`);

        console.log('\\nSeed completed successfully!');
        console.log('Admin login: admin@snjewellers.com / admin123456');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
