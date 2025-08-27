# Weather App 🌤️

Una aplicación web del clima construida con Node.js, Express y EJS que muestra información meteorológica en tiempo real.

## 🚀 Tecnologías

- **Backend:** Node.js, Express
- **Template Engine:** EJS
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **API:** OpenWeatherMap API
- **Otros:** Axios para peticiones HTTP

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- NPM o Yarn
- Una API key de [OpenWeatherMap](https://openweathermap.org/api)

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/sebash278/weather-app.git
cd weather-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto y agrega tu API key:
```env
OPENWEATHER_API_KEY=tu_api_key_aqui
PORT=3000
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador y ve a `http://localhost:3000`

## 📁 Estructura del Proyecto

```
weather-app/
├── package.json
├── server.js
├── .env
├── .gitignore
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
├── views/
│   ├── index.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
└── README.md
```

## ✨ Características

- [ ] Búsqueda de clima por ciudad
- [ ] Muestra temperatura actual
- [ ] Información adicional (humedad, viento, presión)
- [ ] Pronóstico de varios días
- [ ] Diseño responsivo
- [ ] Geolocalización (opcional)

## 🎯 Funcionalidades Planeadas

- [ ] Favoritos de ciudades
- [ ] Modo oscuro/claro
- [ ] Gráficos de temperatura
- [ ] Alertas meteorológicas

## 🤝 Contribuciones

Este es un proyecto de aprendizaje, pero las sugerencias son bienvenidas.

## 📝 Notas de Desarrollo

- Recuerda nunca subir tu API key al repositorio
- El archivo `.env` está en `.gitignore` por seguridad
- Usa `npm run dev` para desarrollo con nodemon

## 🔗 Enlaces Útiles

- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [Express.js Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/)

---

**Autor:** Sebastian Hernandez
**Fecha:** Agosto 2025