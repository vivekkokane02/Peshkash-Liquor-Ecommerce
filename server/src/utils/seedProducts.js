// Seeds the existing static catalog (frontend src/data/products.js) into MongoDB.
// Run with: npm run seed
import { connectDB, disconnectDB } from '../config/db.js';
import { Product } from '../models/Product.js';

const seedData = [
  { name: 'Crown Lager Reserve', batch: 'No. 008', category: 'Beer', price: 349, volume: '650ml', abv: '5%', color: '#C9822B', image: 'https://static.livcheers.com/static/content/images/liquor/LCIN00361.webp', description: 'A crisp, golden lager with soft malt, delicate bitterness, and a clean finish.' },
  { name: 'Highland Amber 12yo', batch: 'No. 014', category: 'Single Malt Whisky', price: 4599, volume: '750ml', abv: '43%', color: '#C9822B', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1000&q=85', description: 'Aged twelve years in ex-sherry oak. Notes of dried fig, orange peel, and toasted honeycomb.' },
  { name: 'Meridian Silver Vodka', batch: 'No. 027', category: 'Vodka', price: 2199, volume: '750ml', abv: '40%', color: '#D8DBE0', image: 'https://static.livcheers.com/static/content/images/liquor/LCIN05372.webp', description: 'Quadruple-distilled winter wheat vodka. Clean, mineral, faintly sweet on the finish.' },
  { name: 'Coastal Reserve Gin', batch: 'No. 003', category: 'Gin', price: 2899, volume: '700ml', abv: '44%', color: '#9FB8A8', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1000&q=85', description: 'Juniper, sea buckthorn, and kaffir lime, distilled in small copper pots by the coast.' },
  { name: 'Ember & Oak Rum', batch: 'No. 041', category: 'Dark Rum', price: 3299, volume: '750ml', abv: '42%', color: '#7A3B1E', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1000&q=85', description: 'Molasses-forward dark rum rested in charred American oak. Smoke, caramel, dark cherry.' },
  { name: 'Vellon Blanc Tequila', batch: 'No. 019', category: 'Tequila', price: 3799, volume: '750ml', abv: '38%', color: '#E7E2C9', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1000&q=85', description: 'Blue weber agave, cooked slow in brick ovens. Bright citrus, cracked pepper, agave heart.' },
  { name: "Founder's Cognac XO", batch: 'No. 052', category: 'Cognac', price: 8999, volume: '700ml', abv: '40%', color: '#8B4A2B', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1000&q=85', description: 'A decades-spanning blend. Dried apricot, leather, and a long cedar-spiced finish.' },
  { name: 'Maison Amber Brandy', batch: 'No. 061', category: 'Brandy', price: 2699, volume: '750ml', abv: '40%', color: '#8B4A2B', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85', description: 'Copper-hued grape brandy with baked pear, vanilla oak, and a warm finish.' },
];

async function seed() {
  await connectDB();
  const existing = await Product.countDocuments();
  if (existing > 0) {
    console.log(`[seed] ${existing} products already exist. Skipping (drop the collection first if you want to reseed).`);
  } else {
    await Product.insertMany(seedData);
    console.log(`[seed] Inserted ${seedData.length} products.`);
  }
  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
