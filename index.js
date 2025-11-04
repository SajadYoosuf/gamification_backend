const express = require("express");
const connection = require("./Config/Mongoos");
const app = express();
const router = require("./Routes/authRoutes");
const cors = require("cors");
require('dotenv').config();

connection();

// ✅ Allow all origins
app.use(cors({
    origin: "*",  // Allow all domains
    credentials: true,
}));

app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server is running on port ${PORT}...`);
});
