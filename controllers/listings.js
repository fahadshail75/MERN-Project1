const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
  }

module.exports.create = async (req, res, next) => {
    
    const geoData = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();
    
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    newListing.geometry = geoData.body.features[0].geometry;

     let savedListing = await newListing.save();
     console.log(savedListing);

    req.flash("success", "New listing is created");
    console.log("new listing is created");
    res.redirect("/listings");
  }

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
      req.flash("error", "Cannot find the listing");
      console.log("Cannot find the listing");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Cannot find the listing");
      console.log("Cannot find the listing");
      res.redirect("/listings");
    }
    let orirginalImageUrl = listing.image.url;
    orirginalImageUrl = orirginalImageUrl.replace("upload", "upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, orirginalImageUrl });
  }

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let lisitng = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(req.body.listing);

    if(typeof req.file !== "undefined"){
      const url = req.file.path;
      const filename = req.file.filename;
      lisitng.image = { url, filename };
      await lisitng.save();
    }

    req.flash("success", "Listing is updated");
    console.log("Updated successfully");
    res.redirect(`/listings/${id}`);
  }

  module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted");
    console.log("deleted successfully");
    res.redirect("/listings");
  }