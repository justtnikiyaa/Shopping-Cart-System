import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./src/models/Category.js";
import Product from "./src/models/Product.js";

dotenv.config();

const seedData = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Please configure your .env file.");
  }

  await mongoose.connect(mongoUri);
  console.log("[Seeder] Connected to MongoDB");

  console.log("[Seeder] Clearing existing sample data...");
  await Product.deleteMany({});
  await Category.deleteMany({});

  const categories = await Category.insertMany([
    {
      name: "Electronics",
      description: "Latest smart devices, accessories, and productivity tech.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Fashion",
      description: "Everyday style essentials for modern wardrobes.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Home & Living",
      description: "Furniture, decor, and practical items for better living.",
      image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Beauty & Health",
      description: "Personal care products focused on wellness and self-care.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Sports & Outdoors",
      description: "Fitness gear and outdoor products for active lifestyles.",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
    }
  ]);

  const categoryMap = categories.reduce((map, category) => {
    map[category.name] = category._id;
    return map;
  }, {});

  const products = [
    {
      name: "Noise-Cancelling Bluetooth Headphones",
      description: "Wireless over-ear headphones with deep bass and 30-hour battery life.",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Electronics"],
      stock: 42
    },
    {
      name: "4K Smart TV 55-inch",
      description: "Ultra HD smart television with HDR support and built-in streaming apps.",
      price: 499.0,
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Electronics"],
      stock: 18
    },
    {
      name: "Mechanical Gaming Keyboard",
      description: "RGB mechanical keyboard with tactile switches and detachable wrist rest.",
      price: 79.5,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Electronics"],
      stock: 55
    },
    {
      name: "Classic Denim Jacket",
      description: "Mid-wash denim jacket with a slim fit and durable stitching.",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Fashion"],
      stock: 34
    },
    {
      name: "Premium Cotton T-Shirt",
      description: "Breathable 100% cotton t-shirt ideal for daily wear.",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Fashion"],
      stock: 120
    },
    {
      name: "Leather Crossbody Bag",
      description: "Minimal leather bag with adjustable strap and secure zipper pockets.",
      price: 89.0,
      image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Fashion"],
      stock: 26
    },
    {
      name: "Ergonomic Office Chair",
      description: "Adjustable lumbar support chair designed for long working hours.",
      price: 219.99,
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Home & Living"],
      stock: 15
    },
    {
      name: "Ceramic Dinner Set (16 pcs)",
      description: "Elegant ceramic plates and bowls for everyday dining and guests.",
      price: 74.5,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Home & Living"],
      stock: 40
    },
    {
      name: "Modern Table Lamp",
      description: "Soft warm-light lamp with minimalist design and touch control.",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Home & Living"],
      stock: 67
    },
    {
      name: "Hydrating Face Serum",
      description: "Lightweight serum with hyaluronic acid for daily hydration.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Beauty & Health"],
      stock: 83
    },
    {
      name: "SPF 50 Daily Sunscreen",
      description: "Non-greasy broad-spectrum sunscreen for face and body.",
      price: 17.49,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Beauty & Health"],
      stock: 95
    },
    {
      name: "Rechargeable Electric Toothbrush",
      description: "Smart timer toothbrush with multiple cleaning modes.",
      price: 49.0,
      image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Beauty & Health"],
      stock: 60
    },
    {
      name: "Adjustable Dumbbell Set",
      description: "Space-saving dumbbell pair with adjustable weight plates.",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Sports & Outdoors"],
      stock: 22
    },
    {
      name: "Yoga Mat Pro",
      description: "Non-slip high-density yoga mat for home and studio sessions.",
      price: 34.95,
      image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Sports & Outdoors"],
      stock: 70
    },
    {
      name: "Insulated Hiking Water Bottle",
      description: "Durable stainless steel bottle that keeps drinks cold for 24 hours.",
      price: 22.5,
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80",
      category: categoryMap["Sports & Outdoors"],
      stock: 88
    }
  ];

  await Product.insertMany(products);

  console.log(`[Seeder] Inserted ${categories.length} categories`);
  console.log(`[Seeder] Inserted ${products.length} products`);
  console.log("[Seeder] Seeding completed successfully");
};

const runSeeder = async () => {
  try {
    await seedData();
    await mongoose.disconnect();
    console.log("[Seeder] Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Seeding failed:", error.message);

    try {
      await mongoose.disconnect();
      console.log("[Seeder] Disconnected from MongoDB after failure");
    } catch {
      console.error("[Seeder] Failed to disconnect cleanly");
    }

    process.exit(1);
  }
};

runSeeder();
