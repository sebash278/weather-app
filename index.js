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
        const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
        const geoRes = await axios.get(geoUrl);

        const geoCity = geoRes.data[0]?.name || null;
        const geoCountry = geoRes.data[0]?.country || null;

        if (geoCity && geoCountry) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${geoCity},${geoCountry}&appid=${apiKey}&units=metric&lang=es`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
        }
    } else if (city && country) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric&lang=es`;
    } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
    } else {
        return res.render("index", {
            weather: null,
            error: "Por favor ingresa una ciudad o usa tu ubicación.",
            title: "Weather App"
        });
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


app.listen(port, () => {
    console.log(`🌤️ Servidor corriendo en http://localhost:${port}`);
});