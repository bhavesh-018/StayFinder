const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
  try {
    const { title, description, location, price, image } = req.body;

    if (!title || !description || !location || !price || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const listing = new Listing({
      title,
      description,
      location,
      price,
      image,
      owner: req.user,
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
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
    const listing = await Listing.findById(req.params.id).populate('owner', 'title');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    // console.log(listing)
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Optional: Check if current user is the owner
    if (listing.owner.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updates = req.body;
    Object.assign(listing, updates);
    await listing.save();
    res.json(listing);
  } catch (err) {
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
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Optional: check if the user has already reviewed
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

    // Recalculate average rating
    listing.averageRating =
      listing.reviews.reduce((acc, item) => item.rating + acc, 0) /
      listing.reviews.length;

    await listing.save();
    res.status(201).json({ message: 'Review added', listing });
  } catch (err) {
    console.error('Review Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};