const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const User = require("../models/User");

mongoose.connect("mongodb://127.0.0.1:27017/stayfinder");

async function seedUsers() {
  try {
    console.log("Seeding users...");

    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [];

    // 🔹 1000 guests
    for (let i = 0; i < 1000; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = `${firstName} ${lastName}`;

      users.push({
        name: name,
        email: `${firstName.toLowerCase()}${i}@example.com`,
        password: hashedPassword,
        role: ["guest"]
      });
    }

    // 🔹 200 hosts
    for (let i = 1000; i < 1200; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = `${firstName} ${lastName}`;

      users.push({
        name: name,
        email: `${firstName.toLowerCase()}${i}@example.com`,
        password: hashedPassword,
        role: ["host"]
      });
    }

    await User.insertMany(users);

    console.log("✅ 1000 guest + 200 host users inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedUsers();