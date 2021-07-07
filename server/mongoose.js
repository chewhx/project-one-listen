require("dotenv").config();
const colors = require("colors");
const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, options);

  console.log(`Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB();
