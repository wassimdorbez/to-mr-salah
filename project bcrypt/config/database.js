//Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = process.env.DB_URL;
mongoose.connect(
    mongoDB,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        console.log('successffuly connected to db')
    }
);

mongoose.Promise = global.Promise;
module.exports = mongoose;
