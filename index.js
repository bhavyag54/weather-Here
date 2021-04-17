const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Starting server at ${port}`));

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/weather/:latlon',async (request, response)=>{

    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    //console.log(lat,lon);
    //console.log("Hello");

    const api_key = process.env.API_KEY;

    const weather_url =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const aq_url =`https://docs.openaq.org/v2/latest?coordinates=${lat},${lon}`; 
    

    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();
    
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };

    response.json(data);
});

app.get('/api', (request,response)=>{
    database.find({}, (err,data) =>{
        response.json(data);
    })
})

app.post('/api', (request,response) =>{
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});
