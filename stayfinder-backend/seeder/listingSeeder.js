const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Listing = require("../models/Listing");
const User = require("../models/User");

const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

mongoose.connect("mongodb://127.0.0.1:27017/stayfinder");

const IMAGE_POOL = [
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774597804/stayfinder/listings/d5tq3s9pyf5ti0egutzh.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774597803/stayfinder/listings/lxqfkzl0oftuozufdb1z.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774597803/stayfinder/listings/ibyurieyosxapy08xrn9.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774597109/stayfinder/listings/ltdgy8hk9okmramqq89g.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774597803/stayfinder/listings/zcuglte2oqgnqy4hek9x.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774597108/stayfinder/listings/h6dmxyf4kc5mj2oluttp.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774597108/stayfinder/listings/wfab5vn4h9x8lbt0be10.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774456679/img7_lrzymd.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774456678/img6_cgsvel.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774456677/img5_we3y28.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1774456675/img3_c8xf56.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1770971642/img4_nkvzbj.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1770971634/img2_uiqbtv.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1770971634/img2_uiqbtv.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1750336032/hosteller3_s5izil.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1750335783/oberoi4_gitxvz.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1750335780/oberoi1_stil9w.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1750335781/oberoi2_dq8bsv.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1750335784/oberoi5_izslug.jpg",
  "https://res.cloudinary.com/dyyhyjxkz/image/upload/v1750336033/hosteller4_fq5n1i.jpg"
];

const LOCATIONS = [
  "Mumbai","Delhi","Bangalore","Pune","Goa",
  "Hyderabad","Chennai","Jaipur","Kolkata","Ahmedabad"
];

const AMENITIES = [
  "Free Wi-Fi","Air Conditioning","Parking","Swimming Pool",
  "Gym","Kitchen","TV","Security","Balcony","Workspace"
];

// 🔥 better titles
const TITLE_PREFIX = [
  "Luxury","Cozy","Modern","Spacious","Elegant",
  "Budget","Premium","Comfortable","Stylish","Peaceful"
];

const PROPERTY_TYPE = [
  "Apartment","Villa","Studio","Loft","Suite","Homestay"
];

const locationCache = {};

const getCoordinates = async (location) => {
  if (locationCache[location]) return locationCache[location];

  try {
    const geo = await geocoder.geocode(location);

    if (geo.length > 0) {
      const coords = {
        lat: geo[0].latitude,
        lng: geo[0].longitude,
      };

      locationCache[location] = coords;
      return coords;
    }
  } catch (err) {
    console.log("Geocode error:", location);
  }

  return null;
};

async function seedListings() {
  try {
    console.log("Seeding listings...");

    await Listing.deleteMany();

    const hosts = await User.find({ role: "host" });
    const guests = await User.find({ role: "guest" });

    if (hosts.length === 0 || guests.length === 0) {
      throw new Error("Seed users first (hosts + guests required)");
    }

    const getRandomHost = () =>
      hosts[Math.floor(Math.random() * hosts.length)]._id;

    const getRandomGuest = () =>
      guests[Math.floor(Math.random() * guests.length)]._id;

    const getRandomImages = () =>
      IMAGE_POOL.sort(() => 0.5 - Math.random()).slice(0, 3);

    const listings = [];

    for (const location of LOCATIONS) {
      const baseCoords = await getCoordinates(location);

      for (let i = 0; i < 20; i++) {

        const title = `${faker.helpers.arrayElement(TITLE_PREFIX)} ${faker.helpers.arrayElement(PROPERTY_TYPE)} in ${location}`;

        const reviewCount = faker.number.int({ min: 1, max: 5 });
        const reviews = [];

        let totalRating = 0;

        for (let r = 0; r < reviewCount; r++) {
          const rating = faker.number.int({ min: 3, max: 5 });

          reviews.push({
            user: getRandomGuest(),
            rating,
            comment: faker.lorem.sentence()
          });

          totalRating += rating;
        }

        const averageRating = Math.round(totalRating / reviewCount);

        // 🔥 ADD THIS PART
        let coordinates = null;

        if (baseCoords) {
          coordinates = {
            lat: baseCoords.lat + (Math.random() - 0.5) * 0.1,
            lng: baseCoords.lng + (Math.random() - 0.5) * 0.1,
          };
        }

        listings.push({
          title,
          description: faker.lorem.sentences(2),
          location,
          price: faker.number.int({ min: 1000, max: 8000 }),
          images: getRandomImages(),
          owner: getRandomHost(),
          totalRooms: faker.number.int({ min: 1, max: 20 }),
          amenities: faker.helpers.arrayElements(AMENITIES, 4),
          averageRating,
          reviews,
          isAvailableForUpdate: true,
          coordinates, // ✅ ADD THIS
        });
      }
    }

    await Listing.insertMany(listings);

    console.log("✅ 200 listings with reviews inserted");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedListings();