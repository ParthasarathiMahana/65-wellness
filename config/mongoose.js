const mongoose = require("mongoose");
const env = require('./environment');
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`).then(()=>{console.log("connected with DB.")});
