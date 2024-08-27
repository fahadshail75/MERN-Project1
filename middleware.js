// Description: This file contains the middleware functions for the application.
const Listing = require("./models/listing");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressErr");
const Review = require("./models/review");

//Middleware function to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You need to login first");
    console.log("You need to login first");
    return res.redirect("/login");
 }
 next();
}

//Middleware function to save the redirect url
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
       res.locals.redirectUrl = req.session.redirectUrl;
}
 next();
}

//Middleware function to check if the user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
      req.flash("error", "You are not the owner of the listing");
      console.log("You are not the owner of the listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

//Middleware function to validate the listing
module.exports.validateListing =  (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
      let msg = error.details.map(el => el.message).join(",");
      throw new ExpressError(400, msg);
  }
      next();
}

//Middleware function to validate the review
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let msg = error.details.map(el => el.message).join(",");
      throw new ExpressError(400, msg);
      }
      next();
}
  
module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
      req.flash("error", "You are not the author of the review");
      console.log("You are not the author of the review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}