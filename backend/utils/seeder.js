// Populates (or clears) sample data in your MongoDB database — useful for
// checking the models work and for having something real to look at before
// the admin dashboard can add products by hand.
//
// Usage:
//   node utils/seeder.js        → import sample categories, products, admin user
//   node utils/seeder.js -d     → destroy all of the above

import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();
await connectDB();

const categories = [
  // Clothes
  { name: 'T-shirts', parentType: 'clothes' },
  { name: 'Shirts', parentType: 'clothes' },
  { name: 'Trousers', parentType: 'clothes' },
  { name: 'Jeans', parentType: 'clothes' },
  { name: 'Dresses', parentType: 'clothes' },
  { name: 'Shorts', parentType: 'clothes' },
  { name: 'Hoodies', parentType: 'clothes' },
  { name: 'Jackets', parentType: 'clothes' },
  // Shoes
  { name: 'Sneakers', parentType: 'shoes' },
  { name: 'Casual shoes', parentType: 'shoes' },
  { name: 'Sports shoes', parentType: 'shoes' },
  { name: 'Formal shoes', parentType: 'shoes' },
  { name: 'Sandals', parentType: 'shoes' },
  // Slippers
  { name: 'Casual slippers', parentType: 'slippers' },
  { name: 'Slides', parentType: 'slippers' },
  { name: 'Fashion slippers', parentType: 'slippers' },
  { name: "Men's slippers", parentType: 'slippers' },
  { name: "Women's slippers", parentType: 'slippers' },
];

function placeholder(label) {
  return `https://placehold.co/600x800?text=${encodeURIComponent(label)}`;
}

function makeVariants(sizes, colors, stock = 15) {
  const variants = [];
  sizes.forEach((size) => {
    colors.forEach((color) => variants.push({ size, color, stock }));
  });
  return variants;
}

function buildProducts(adminId) {
  return [
    {
      name: 'Classic Oxford Shirt',
      description: 'A tailored cotton Oxford shirt for the office or a smart-casual day out.',
      category: 'clothes',
      subcategory: 'Shirts',
      price: 180,
      images: [{ url: placeholder('Classic Oxford Shirt') }],
      variants: makeVariants(['S', 'M', 'L', 'XL'], ['White', 'Blue'], 12),
      isBestSeller: true,
      createdBy: adminId,
    },
    {
      name: 'Graphic Print T-Shirt',
      description: 'Soft cotton tee with a bold graphic print, cut for an easy everyday fit.',
      category: 'clothes',
      subcategory: 'T-shirts',
      price: 95,
      images: [{ url: placeholder('Graphic Print T-Shirt') }],
      variants: makeVariants(['S', 'M', 'L'], ['Black', 'White', 'Grey'], 20),
      isNewArrival: true,
      createdBy: adminId,
    },
    {
      name: 'Tailored Wool Trousers',
      description: 'Smart wool-blend trousers with a tapered leg and clean finish.',
      category: 'clothes',
      subcategory: 'Trousers',
      price: 320,
      images: [{ url: placeholder('Tailored Wool Trousers') }],
      variants: makeVariants(['30', '32', '34', '36'], ['Charcoal', 'Navy'], 10),
      createdBy: adminId,
    },
    {
      name: 'Slim Fit Jeans',
      description: 'Everyday stretch denim with a slim, modern cut.',
      category: 'clothes',
      subcategory: 'Jeans',
      price: 250,
      images: [{ url: placeholder('Slim Fit Jeans') }],
      variants: [
        { size: '30', color: 'Indigo', stock: 14 },
        { size: '32', color: 'Indigo', stock: 18 },
        { size: '34', color: 'Indigo', stock: 0 },
        { size: '32', color: 'Black', stock: 9 },
      ],
      isBestSeller: true,
      isFeatured: true,
      createdBy: adminId,
    },
    {
      name: 'Pleated Midi Dress',
      description: 'A flowing pleated midi dress that moves easily from day to evening.',
      category: 'clothes',
      subcategory: 'Dresses',
      price: 290,
      images: [{ url: placeholder('Pleated Midi Dress') }],
      variants: makeVariants(['S', 'M', 'L'], ['Terracotta', 'Black'], 8),
      isNewArrival: true,
      isFeatured: true,
      createdBy: adminId,
    },
    {
      name: 'Relaxed Denim Jacket',
      description: 'A relaxed-fit denim jacket with a lightly worn wash.',
      category: 'clothes',
      subcategory: 'Jackets',
      price: 380,
      images: [{ url: placeholder('Relaxed Denim Jacket') }],
      variants: makeVariants(['M', 'L', 'XL'], ['Indigo'], 7),
      isFeatured: true,
      createdBy: adminId,
    },
    {
      name: 'Everyday Canvas Sneakers',
      description: 'Lightweight canvas sneakers built for all-day wear.',
      category: 'shoes',
      subcategory: 'Sneakers',
      price: 250,
      images: [{ url: placeholder('Everyday Canvas Sneakers') }],
      variants: makeVariants(['40', '41', '42', '43'], ['Off-White', 'Black'], 16),
      isNewArrival: true,
      isFeatured: true,
      createdBy: adminId,
    },
    {
      name: 'Leather Formal Shoes',
      description: 'Polished leather formal shoes with a comfortable cushioned sole.',
      category: 'shoes',
      subcategory: 'Formal shoes',
      price: 380,
      images: [{ url: placeholder('Leather Formal Shoes') }],
      variants: makeVariants(['40', '41', '42', '43'], ['Black', 'Brown'], 9),
      createdBy: adminId,
    },
    {
      name: 'Leather Slides',
      description: 'Minimal leather slides for around the house or a quick errand.',
      category: 'slippers',
      subcategory: 'Slides',
      price: 120,
      images: [{ url: placeholder('Leather Slides') }],
      variants: makeVariants(['40', '41', '42'], ['Tan', 'Black'], 20),
      isBestSeller: true,
      createdBy: adminId,
    },
    {
      name: 'Woven Fashion Slippers',
      description: 'Handwoven fashion slippers with a soft footbed.',
      category: 'slippers',
      subcategory: 'Fashion slippers',
      price: 95,
      images: [{ url: placeholder('Woven Fashion Slippers') }],
      variants: makeVariants(['39', '40', '41'], ['Black', 'Beige'], 18),
      isNewArrival: true,
      createdBy: adminId,
    },
  ];
}

const importData = async () => {
  try {
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany({ role: 'admin' });

    const admin = await User.create({
      name: 'LUXE CART Admin',
      email: 'admin@luxecart.com',
      password: 'admin123',
      role: 'admin',
    });

    await Category.insertMany(categories);
    await Product.insertMany(buildProducts(admin._id));

    console.log('✅ Sample data imported');
    console.log(`   ${categories.length} categories, ${buildProducts(admin._id).length} products`);
    console.log('   Admin login → email: admin@luxecart.com | password: admin123');
    console.log('   (Change this password once the auth phase is built.)');
    process.exit();
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Sample data removed');
    process.exit();
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}