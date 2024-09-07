const { default: mongoose } = require("mongoose");

async function connectDB(url) {
  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("error: ", error);
  }
}

module.exports = connectDB;
