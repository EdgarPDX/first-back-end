const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const geoData = require('./data/geo.js')

app.use(cors());

app.use(express.static('public'));

function getLatLong(cityName){
    const city = geoData[0]
    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon
    };
}

app.get('/location', (req, res) => {
    const userInput = req.query.search;
    const mungedData = getLatLong(userInput)
  res.json (mungedData);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})