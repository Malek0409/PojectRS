const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_CONNECTED +
      "@cluster0.de4ah.mongodb.net/mern-project"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connected to mongoDB", err));
