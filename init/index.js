const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
 

let data = 
[
  {
    "title": "Luxury Beach Villa",
    "description": "A stunning beachfront villa with private pool and ocean view.",
    "image": "https://source.unsplash.com/featured/?beach,villa",
    "price": 12000,
    "location": "Goa",
    "country": "India"
  },
  {
    "title": "Cozy Mountain Cabin",
    "description": "Peaceful cabin surrounded by mountains, perfect for a weekend getaway.",
    "image": "https://source.unsplash.com/featured/?mountain,cabin",
    "price": 4500,
    "location": "Manali",
    "country": "India"
  },
  {
    "title": "Modern City Apartment",
    "description": "Stylish apartment in the heart of the city with skyline views.",
    "image": "https://source.unsplash.com/featured/?city,apartment",
    "price": 6000,
    "location": "Bangalore",
    "country": "India"
  },
  {
    "title": "Desert Camp Experience",
    "description": "Enjoy a unique stay in luxury tents under the stars.",
    "image": "https://source.unsplash.com/featured/?desert,camp",
    "price": 3500,
    "location": "Jaisalmer",
    "country": "India"
  },
  {
    "title": "Lakeview Cottage",
    "description": "Relax by the lake in this beautiful and serene cottage.",
    "image": "https://source.unsplash.com/featured/?lake,cottage",
    "price": 5200,
    "location": "Nainital",
    "country": "India"
  },
  {
    "title": "Heritage Haveli Stay",
    "description": "Experience royal living in a traditional Rajasthani haveli.",
    "image": "https://source.unsplash.com/featured/?heritage,house",
    "price": 8000,
    "location": "Udaipur",
    "country": "India"
  },
  {
    "title": "Treehouse Retreat",
    "description": "Stay among the trees with nature all around you.",
    "image": "https://source.unsplash.com/featured/?treehouse",
    "price": 7000,
    "location": "Wayanad",
    "country": "India"
  },
  {
    "title": "Snowy Chalet",
    "description": "A cozy chalet with fireplace in a snowy paradise.",
    "image": "https://source.unsplash.com/featured/?snow,chalet",
    "price": 9000,
    "location": "Gulmarg",
    "country": "India"
  },
  {
    "title": "Riverside Homestay",
    "description": "Calm and peaceful stay near a flowing river.",
    "image": "https://source.unsplash.com/featured/?river,house",
    "price": 3000,
    "location": "Rishikesh",
    "country": "India"
  },
  {
    "title": "Luxury Penthouse",
    "description": "Top-floor penthouse with panoramic city views and modern amenities.",
    "image": "https://source.unsplash.com/featured/?penthouse,luxury",
    "price": 15000,
    "location": "Mumbai",
    "country": "India"
  }
]

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
    
    await Listing.insertMany(data);
}

main().then(()=>console.log("connection DB successful.")).catch(err=> console.log(err));
