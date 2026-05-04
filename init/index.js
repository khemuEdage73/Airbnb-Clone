const mongoose = require("mongoose");
const Listing = require("../models/listings.js")

const data = require("./data.json");

async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnbclone");
}

async function initDB(){
    try{
        await Listing.deleteMany({});
        console.log("Deleted all existing listings");
        await Listing.insertMany(data);
        console.log("Inserted multiple listings successfully");
        mongoose.connection.close();
    }
    catch(err){
        console.log("error in intializing database: ", err);
    }
}

main().then(()=>{
    console.log("Connection to DB successful.")
}).catch(err=>console.log(err));

initDB();