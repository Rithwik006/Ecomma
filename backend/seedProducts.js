const { sequelize } = require('./config/database');
const Product = require('./models/Product');

const products = [
  {
    name: 'Sony Alpha a7 IV Mirrorless Camera',
    price: 2498.00,
    description: 'A hybrid camera with a 33MP full-frame sensor, 4K 60p video, and real-time Eye AF. Perfect for professional photography and videography.',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    price: 3499.00,
    description: 'The most powerful MacBook Pro ever. Powered by the M3 Max chip with a stunning Liquid Retina XDR display.',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 398.00,
    description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: 'Minimalist Mechanical Keyboard',
    price: 129.99,
    description: 'Custom-built mechanical keyboard with hot-swappable switches, RGB lighting, and an aluminum frame.',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: 'Premium Leather Briefcase',
    price: 245.00,
    description: 'Handcrafted genuine leather briefcase designed for the modern professional. Fits a 15-inch laptop.',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000'
  },
  {
    name: 'Apple Watch Ultra 2',
    price: 799.00,
    description: 'Rugged and capable, featuring a titanium case, precision dual-frequency GPS, and up to 36 hours of battery life.',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1434493789847-2902a52dda8c?auto=format&fit=crop&q=80&w=1000'
  }
];

(async () => {
  try {
    await sequelize.sync();
    
    // Check if products already exist to avoid duplicating
    const count = await Product.count();
    if (count > 0) {
      console.log('Database already has products. Skipping seed.');
      process.exit(0);
    }

    await Product.bulkCreate(products);
    console.log('Successfully seeded database with realistic products!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
})();
