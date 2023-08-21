const mongooes = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongooes.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected"+conn.connection.host);
  } catch (error) {
    console.log('Error connecting to MongoDB');
    process.exit();
  }
};

module.exports = connectDB;
