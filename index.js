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
    const { city } = req.body;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    console.log('=== DEBUG ===');
    console.log('Ciudad recibida:', city);
    console.log('API Key existe:', apiKey ? 'SÍ' : 'NO');
    console.log('URL que vamos a llamar:', `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`);
    

    if(!city){
        return res.render("index", {
            weather: null,
            error: "Por favor ingresa una ciudad.",
            title: "Weather App"
        });
    }

    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`);

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

        res.render("index", {
            weather: weather,
            error: null,
            title: "Weather App"
        });
    } catch(error){
        console.log("Error al obtener datos del clima: ", error.message);

        let errorMessage = "Error al obtener datos del clima";
        if (error.response && error.response.status === 404){
            errorMessage = "Ciudad no encontrada. Verifica el nombre e intenta de nuevo.";
        }

        res.render("index", {
            weather: null,
            error: errorMessage,
            title: "Weather App"
        });
    }
});

app.listen(port, () => {
    console.log(`🌤️ Servidor corriendo en http://localhost:${port}`);
});