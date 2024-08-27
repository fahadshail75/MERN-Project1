const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview,isLoggedIn, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Create Route
router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview));

//Delete Route
router.delete("/:reviewId", 
    isAuthor,
    isLoggedIn,
    wrapAsync(reviewController.deleteReview));


module.exports = router;

