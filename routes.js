const express = require('express');
const cors = require('cors');
const request = require('superagent')


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

async function getWeather(lat, lon){
    const response = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`);
    
    const forecast = response.body.data.map((day) => {
         return{
            forecast: day.weather.description,
            time: new Date(day.ts * 1000),
        };
    })

    return forecast;
        
};

app.get('/weather', async (req, res) => {
    try {
        const userLat = req.query.latitude;
        const userLon = req.query.longitude;

        const mungedData = await getWeather(userLat, userLon);
        res.json(mungedData);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});
// async function getHiking(lat, lon){
//     const response = await request.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${process.env.TRAIL_API_KEY}`);
    
//     const hikes = response.body.trails.map((hike) => {
//          return{
//             name: hike.name ,
//             location:hike.location,
//             length: hike.length,
//             stars: hike.stars,
//             star_votes: hike.starVotes,
//             summary: hike.summary,
//             trail_url: hike.url,
//             conditions: hike.conditionDetails,
//             condition_date: hike.conditionDate,
//             condition_time:
//         };
//     })

//     return hikes;
        
// };
// app.get('/trails', async (req, res) => {
//     try {
//         const userLat = req.query.latitude;
//         const userLon = req.query.longitude;

//         const mungedData = await getHiking(userLat, userLon);
//         res.json(mungedData);
//     } catch (e) {
//         res.status(500).json({error: e.message})
//     }
// });

module.exports = {
    app
};