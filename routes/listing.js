

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const  { storage } = require("../cloudConfig.js");
const upload = multer({ storage  });

// Index Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.create)
);

// New Route
router.get("/new", isLoggedIn, listingController.new);


// Show, Update, and Delete Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.update))
  .delete(wrapAsync(listingController.delete));

// Edit Route
router.get("/:id/edit", 
  isOwner, 
  isLoggedIn,  
  wrapAsync(listingController.edit));

module.exports = router;
