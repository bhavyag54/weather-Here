getData();

async function getData(){
    const response = await fetch('/api');
    const data = await response.json();
    
    const myMap = L.map('Map').setView([0, 0],1);

    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">openstreetmap</a> contributors';

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const tiles = L.tileLayer(tileUrl,{attribution});
    tiles.addTo(myMap);

    
    data.forEach((data)=>{
        
        let lat = data.lat;
        let lon = data.lon;

        let air;

        if(data.air !== '0')
        {
            air = `Air Quality: ${data.air.value} ${data.air.unit}`;
        }
        else{
            air = `Air Quality not available`
        }

        const text = `<p id="ws">
    The weather here is
    <span id="summary">${data.weather.weather[0].description}</span>
        with a temperature of <span id="temperature">${parseInt(data.weather.main.temp) - 273}</span>&deg;C.
    <br>
    Air Quality: <span id="air_quality">${air}</span>
    </p>`

        L.marker([lat,lon])
        .bindPopup(text)
        .addTo(myMap);
    
    })
}

    
