// Run: node scripts/seed-products.cjs
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/sharwarma';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: 'Main', trim: true },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    badge: { type: String, default: '' },
    available: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
  {
    name: 'Chicken Shawarma',
    description: 'Juicy grilled Chicken patty with crispy fries and special sauce',
    price: 3000,
    category: 'Shawarma',
    image: '/images/images11.jpg',
    badge: 'Popular',
    sortOrder: 1,
  },
  {
    name: 'Beef Shawarma',
    description: 'Aromatic Beef tossed with fresh vegetables and protein',
    price: 4500,
    category: 'Shawarma',
    image: '/images/images14.jpg',
    badge: '',
    sortOrder: 2,
  },
  {
    name: 'Turkey Shawarma',
    description: 'Spiced grilled Turkey served with fresh garden salad',
    price: 10000,
    category: 'Shawarma',
    image: '/images/images12.jpg',
    badge: 'Premium',
    sortOrder: 3,
  },
  {
    name: 'Chicken & Sausage Shawarma',
    description: 'Perfectly grilled chicken paired with savory sausage and sides',
    price: 3500,
    category: 'Shawarma',
    image: '/images/images13.jpg',
    badge: '',
    sortOrder: 4,
  },
  {
    name: 'Mouth Watering Noodles',
    description: 'Delicious Noodles with creamy garlic sauce, lettuce, and tomato',
    price: 3500,
    category: 'Noodles',
    image: '/images/food2.jpg',
    badge: '',
    sortOrder: 5,
  },
  {
    name: 'Grilled Plantain',
    description: 'Premium grilled plantain cuts grilled to perfection with herb seasoning',
    price: 7500,
    category: 'Sides',
    image: '/images/download4.jpg',
    badge: '',
    sortOrder: 6,
  },
  {
    name: 'Vegetable Soup',
    description: 'Premium Taste at your platter, making you to feel home away from home',
    price: 7500,
    category: 'Nigerian',
    image: '/images/ibo3.jpg',
    badge: '',
    sortOrder: 7,
  },
  {
    name: 'Native Ugba and Cocoyam',
    description: 'Taste the feeling like you are part of something big',
    price: 7500,
    category: 'Nigerian',
    image: '/images/ibo4.jpg',
    badge: '',
    sortOrder: 8,
  },
  {
    name: 'Delicious Okpa',
    description: 'Taste the feeling',
    price: 2000,
    category: 'Nigerian',
    image: '/images/ibo5.jpg',
    badge: '',
    sortOrder: 9,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  console.log('Cleared existing products');

  const inserted = await Product.insertMany(products);
  console.log(`Inserted ${inserted.length} products:`);
  inserted.forEach(p => console.log(`  • ${p.name} — ₦${p.price.toLocaleString()}`));

  await mongoose.disconnect();
  console.log('\nDone! Products are live on the menu.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
