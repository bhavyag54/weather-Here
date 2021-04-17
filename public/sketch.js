let lan, lon;
document.querySelector("#ws").style.visibility = "hidden";

navigator.geolocation.getCurrentPosition(async position => {
    lat =  position.coords.latitude;
    lon =  position.coords.longitude;

    document.getElementById('latitude').textContent = lat.toFixed(2);
    document.getElementById('longitude').textContent = lon.toFixed(2);

    const api_url = `/weather/${lat},${lon}`
    const response = await fetch(api_url);
    const json = await response.json();

    //console.log(json);

    const weather = json.weather;
    
    let air = "0";
    try{
        air = json.air_quality.results[0].measurements[0];
        document.getElementById('air_quality').textContent = `${air.value} ${air.unit}`;
    } catch(error) {
        document.querySelector("#air_quality").textContent = "not available";
    }

    document.getElementById('summary').textContent = json.weather.weather[0].description;
    document.getElementById('temperature').textContent =`${parseInt(json.weather.main.temp) - 273}`;

    document.querySelector("#ws").style.visibility = "visible";
    
    const data = {lat , lon, weather, air};

    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };

    const db_response = await fetch('/api', option);
    const db_json = await db_response.json();
    //console.log(db_json);
    
}); 
