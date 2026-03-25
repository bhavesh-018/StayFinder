const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
  try {
    const { title, description, location, price, images, totalRooms } = req.body;

    if (!title || !description || !location || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    if (totalRooms && totalRooms < 1) {
      return res.status(400).json({ message: 'totalRooms must be at least 1' });
    }
    const listing = new Listing({
      title,
      description,
      location,
      price,
      images,
      totalRooms: totalRooms || 1,
      owner: req.user._id,
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error('Create Listing Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', 'name email');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getListingById = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('reviews.user', 'name');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const totalReviews = listing.reviews.length;

    const start = (page - 1) * limit;
    const end = start + limit;

    const sortedReviews = [...listing.reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const paginatedReviews = sortedReviews.slice(start, end);

    res.json({
      ...listing.toObject(),
      reviews: paginatedReviews,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getListingsByOwner = async (req, res) => {
  try {
    const userId = req.params.userId;
    const listings = await Listing.find({ owner: userId });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateListing = async (req, res) => {
  try {
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

    // Update fields from req.body
    const { title, description, location, price } = req.body;
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (location) listing.location = location;
    if (price) listing.price = price;
    if (typeof totalRooms !== 'undefined') {
  listing.totalRooms = Number(totalRooms);
}

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path); // Cloudinary image URLs
      listing.images.push(...imageUrls); // Append new images
    }

    await listing.save();
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