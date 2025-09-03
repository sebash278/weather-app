import express from "express";
import axios from "axios";
import path from "path";
import { configDotenv } from "dotenv";
import { error } from "console";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configDotenv();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

//Middleware para parsear los datos del formulario
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index", {
        weather: null,
        error: null,
        title: "Weather App"
    });
});

app.post("/weather", async (req, res) => {
    const { city, country, lat, lon } = req.body;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let url;
    if (lat && lon) {
        // 1. Obtener datos del clima por coordenadas (SIEMPRE confiable)
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
        const response = await axios.get(url);

        // 2. Hacer reverse geocoding SOLO para el nombre oficial de ciudad/país
        const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
        const geoRes = await axios.get(geoUrl);

        const geoCity = geoRes.data[0]?.name || response.data.name;
        const geoCountry = geoRes.data[0]?.country || response.data.sys.country;

        const weather = {
            city: geoCity,
            country: geoCountry,
            temperature: Math.round(response.data.main.temp),
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            pressure: response.data.main.pressure,
            feelsLike: Math.round(response.data.main.feels_like)
        };

        return res.render("index", { weather, error: null, title: "Weather App" });
    }

    try {
        const response = await axios.get(url);
        const weather = {
            city: response.data.name,
            country: response.data.sys.country,
            temperature: Math.round(response.data.main.temp),
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            pressure: response.data.main.pressure,
            feelsLike: Math.round(response.data.main.feels_like)
        };

        res.render("index", { weather, error: null, title: "Weather App" });
    } catch (error) {
        console.log("Error al obtener datos del clima: ", error.message);
        let errorMessage = "Error al obtener datos del clima";
        if (error.response?.status === 404) {
            errorMessage = "Ciudad no encontrada. Verifica el nombre e intenta de nuevo.";
        }
        res.render("index", { weather: null, error: errorMessage, title: "Weather App" });
    }
});

app.get("/geocode", async (req, res) => {
    const { q } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!q) {
        return res.status(400).json({ error: "Falta el parámetro q" });
    }

    try {
        const response = await axios.get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${apiKey}&lang=es`
        );

        res.json(response.data);
    } catch (error) {
        console.log("Error en geocoding:", error.message);
        res.status(500).json({ error: "No se pudo buscar la ciudad" });
    }
});

app.listen(port, () => {
    console.log(`🌤️ Servidor corriendo en http://localhost:${port}`);
});