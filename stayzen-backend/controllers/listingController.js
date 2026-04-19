const Listing = require('../models/Listing');
const { client } = require("../config/redis");
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

exports.createListing = async (req, res) => {
  try {
    const { title, description, location, price, images, totalRooms } = req.body;

    if (!title || !description || !location || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    let coordinates = null;

    try {
      const geoData = await geocoder.geocode(location);

      if (geoData.length > 0) {
        coordinates = {
          lat: geoData[0].latitude,
          lng: geoData[0].longitude,
        };
      }
    } catch (geoErr) {
      console.log("Geocoding failed:", geoErr.message);
    }

    const listing = new Listing({
      title,
      description,
      location,
      price,
      images,
      totalRooms: totalRooms || 1,
      owner: req.user._id,
      coordinates,
    });

    await listing.save();
    await client.del("listings:all");
    res.status(201).json(listing);

  } catch (err) {
    console.error('Create Listing Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const cacheKey = "listings:all";

    // Check Redis
    const cached = await client.get(cacheKey);

    if (cached) {
      console.log("⚡ Redis HIT - all listings");
      return res.json(JSON.parse(cached));
    }

    const listings = await Listing.find().populate('owner', 'name email');

    await client.setEx(cacheKey, 300, JSON.stringify(listings));

    console.log("🐢 Mongo HIT - cached");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getListingById = async (req, res) => {
  try {
    const cacheKey = `listing:${req.params.id}`;

    const cached = await client.get(cacheKey);

    if (cached) {
      console.log("⚡ Redis HIT - single listing");
      return res.json(JSON.parse(cached));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const { checkIn, checkOut } = req.query;

    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('reviews.user', 'name');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    let availableRooms = listing.totalRooms;

    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      const activeBookings = await Booking.find({
        listing: listing._id,
        status: { $in: ['PENDING', 'CONFIRMED'] },
        checkIn: { $lt: endDate },
        checkOut: { $gt: startDate }
      });

      const roomsHeld = activeBookings.reduce(
        (sum, b) => sum + (b.roomsBooked || 1),
        0
      );

      availableRooms = listing.totalRooms - roomsHeld;
    }

    const totalReviews = listing.reviews.length;

    const start = (page - 1) * limit;
    const end = start + limit;

    const sortedReviews = [...listing.reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const paginatedReviews = sortedReviews.slice(start, end);

    const responseData = {
      ...listing.toObject(),
      availableRooms,
      reviews: paginatedReviews,
      totalReviews,
      totalPages: Math.max(1, Math.ceil(totalReviews / limit)),
      currentPage: page
    };

    await client.setEx(cacheKey, 60, JSON.stringify(responseData));

    res.json(responseData);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getListingsByOwner = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateListing = async (req, res) => {
  try {

    const { title, description, location, price, totalRooms, amenities} = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Ensure the user is the owner
    if (listing.owner.toString() !== req.user._id.toString()) {
      console.log(listing.owner.toString());
      console.log(req.user.toString());
      console.log(listing.owner.toString() === req.user.toString());
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (location && location !== listing.location) {
      listing.location = location;

      try {
        const geoData = await geocoder.geocode(location);

        if (geoData.length > 0) {
          listing.coordinates = {
            lat: geoData[0].latitude,
            lng: geoData[0].longitude,
          };
        }
      } catch (err) {
        console.log("Geocode update failed");
      }
    }

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (location) listing.location = location;
    if (price) listing.price = price;
    if (typeof totalRooms !== 'undefined') {listing.totalRooms = Number(totalRooms);}
    if (amenities) listing.amenities = amenities;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path); // Cloudinary image URLs
      listing.images.push(...imageUrls); // Append new images
    }

    await listing.save();
    await client.del("listings:all");
    await client.del(`listing:${req.params.id}`);
    res.json(listing);
  } catch (err) {
    console.error('❌ Error updating listing:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Optional: Check if current user is the owner
    if (listing.owner.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await listing.deleteOne();
    await client.del("listings:all");
    await client.del(`listing:${req.params.id}`);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email').populate('reviews.user', 'name');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const alreadyReviewed = listing.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this listing' });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    listing.reviews.push(review);

    // ✅ Calculate average properly
    const total = listing.reviews.reduce((acc, item) => acc + item.rating, 0);

    listing.averageRating = Number(
      (total / listing.reviews.length).toFixed(1)
    );

    await listing.save();

    res.status(201).json({ message: 'Review added', listing });

  } catch (err) {
    console.error('Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};