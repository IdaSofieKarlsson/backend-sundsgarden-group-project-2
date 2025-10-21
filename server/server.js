import express from "express";
const app = express();
import cors from "cors";

const corsOptions = {
    origin: ["http://localhost:5173"],          //the frontend address. It must be exact. No extra / at the end! 
};

app.use(cors(corsOptions));

app.get("/car-brands", (req, res) => {
    res.json({ carBrands: ["SAAB", "Volvo", "Mazda"] });
});

app.listen(8080, () => {
    console.log("Server is running on port: 8080");
});
