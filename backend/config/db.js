const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://yusufaklevi:vcXuPbolUYxNGmrU@cluster0.givylja.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    console.log(MONGO_URI);
    const connection = await mongoose.connect(MONGO_URI, {});
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

module.exports = connectDB;
