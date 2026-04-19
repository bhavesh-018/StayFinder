const mongoose = require("mongoose");
require("dotenv").config();

const Listing = require("./models/Listing");
const User = require("./models/User");

const seedUsers = require("./seeder/seedUsers");
const seedListings = require("./seeder/listingSeeder");

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected for seeding");

    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();

    // ✅ If both exist → skip
    if (userCount > 0 && listingCount > 0) {
      console.log("⚡ Data already exists, skipping seeding");
      process.exit();
    }

    console.log("🌱 Seeding database...");

    // 🔥 IMPORTANT ORDER
    if (userCount === 0) {
      await seedUsers();
    }

    if (listingCount === 0) {
      await seedListings();
    }

    console.log("🎉 Seeding complete");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

runSeed();