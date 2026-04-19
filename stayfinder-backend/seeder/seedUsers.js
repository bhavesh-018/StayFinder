const bcrypt = require("bcryptjs");

const User = require("../models/User");

const seedUsers = async () => {
  const { faker } = await import('@faker-js/faker');
  try {
    console.log("🌱 Seeding users...");

    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [];

    // 1000 guests
    for (let i = 0; i < 1000; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      users.push({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}${i}@example.com`,
        password: hashedPassword,
        role: ["guest"],
      });
    }

    // 200 hosts
    for (let i = 1000; i < 1200; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      users.push({
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}${i}@example.com`,
        password: hashedPassword,
        role: ["host"],
      });
    }

    await User.insertMany(users);

    console.log("✅ 1000 guests + 200 hosts inserted");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

module.exports = seedUsers;