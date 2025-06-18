const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary.js');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stayfinder/listings',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });
module.exports = upload;