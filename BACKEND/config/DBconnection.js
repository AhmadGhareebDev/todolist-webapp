const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL;


const DBConnection = async () =>{
    try{
     await mongoose.connect(DATABASE_URL);
    } catch (error) {
        console.error(error);
    }
}


module.exports = DBConnection;