// const express = require ("express")
// const connection = require("./Config/Mongoos")
// const app = express()
// const router = require("./Routes/authRoutes")
// const cors = require("cors")



// connection()

// app.use(cors())
// app.use(express.json()) 
// app.use('/',router)


// app.listen(4000,() => {
//     console.log('Server is running..')
// })




// const express = require("express");
// const connection = require("./Config/Mongoos");
// const app = express();
// const router = require("./Routes/authRoutes");
// const cors = require("cors");
// require('dotenv').config();

// connection();

// app.use(cors());
// app.use(express.json()); 
// app.use('/', router);

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on port ${PORT}...`);
// });



const express = require("express");
const connection = require("./Config/Mongoos");
const app = express();
const router = require("./Routes/authRoutes");
const cors = require("cors");
const { createDefaultAdmin } = require("./Controller/adminloginController");
require('dotenv').config();

connection();

// setTimeout(() => {
//     createDefaultAdmin();
// }, 2000);

// CORS configuration to allow localhost
const corsOptions = {
    origin: [
        'http://localhost:',
        'http://localhost:3001', 
        'http://localhost:8080',
        'http://localhost:8000',
        'http://localhost:5173', // Vite default
        'http://localhost:4200', // Angular default
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use('/', router);


const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}...`);
}); 