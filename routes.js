const express = require('express');
const cors = require('cors');
const request = require('superagent')
const weatherData = require('./data/weather.js');

const app = express();




app.use(cors());

app.use(express.static('public'));

async function getLatLong(cityName){
    const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${cityName}&format=json`);

    const city = response.body[0]
    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon
    };
}

app.get('/location', async(req, res) => {
    try{
        const userInput = req.query.search;
        const mungedData = await getLatLong(userInput)
        res.json (mungedData);
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
    
})

async function getWeather(cityName){
    const response = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?&city=${cityName}&key=${process.env.WEATHER_KEY}`)
    const forecast = response.data[0]

        return{
            forecast: forecast.weather.description,
            time: new Date(forecast.ts * 1000),
        };
    
    return forecast;
}

app.get('/weather', async(req, res) => {
    try {
        const userLat = req.query.latitude;
        const userLon = req.query.longitude;

        const mungedData = await getWeather(userLat, userLon);
        res.json(mungedData);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});


module.exports = {
    app
};