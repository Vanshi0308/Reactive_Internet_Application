"use strict";

// Importing the required libraries and setting variables
const express = require('express');
const path = require("path")
const app = express();
const port = 4000;

let appid = 'a2427b28a69fc0f2f189b0c017c63b37';
let image_appid = 'Fj37hWSFpxVc1dEUeSd1gx54W_VBX-BZss--fDtYqPA'
let publicPath = path.resolve(__dirname,"public");
const axios = require('axios');

app.use(express.static(publicPath));
app.get('/api/cityWeather/:cityName', sendWeather);
app.listen(port, () => console.log('Listening on port '+port));

// Function callback that returns the response to client requests
function sendWeather(req, res) {
    let cityName = req.params.cityName;
    get_data(cityName)
    .then((data) => {res.json(data)})
    .catch(() => {
        res.status(500);
        res.send('Error occurred');
        return;
    });
}

// Worker function that completes the main task of getting the data from openweather api
async function get_data(city){
    try{
        // Making API call to get latitude nad longitude of the city
        let res = await axios.get('http://api.openweathermap.org'+'/geo/1.0/direct?q='+city+'&limit=1&appid='+appid);
        let img_res = await axios.get('https://api.unsplash.com/search/photos?page=1&per_page=1&query='+city+'&client_id='+image_appid);
        let lat = res.data[0]['lat'];
        let lon = res.data[0]['lon'];
        let img_url = img_res.data.results[0]['urls']['regular'];

        try{
            // Making API call to get the weather data of the location
            let weather_res = await axios.get('https://api.openweathermap.org'+'/data/3.0/onecall?lat='+lat+'&lon='+lon+'&units=metric&exclude=current,minutely,hourly,alerts&appid='+appid);
            let ret = {};

            ret['img_url'] = img_url;
            ret['weather'] = 'mild';
            ret['pack_umbrella'] = false;
            ret['daily'] = [];
            for(let i=0; i<4; i++)
            {
               ret['daily'].push({});
               ret['daily'][i]['wind_speed'] = weather_res.data['daily'][i]['wind_speed'];
               ret['daily'][i]['temp'] = weather_res.data['daily'][i]['temp']['day'];
               ret['daily'][i]['rain'] = 0;

                if('rain' in weather_res.data['daily'][i]){
                    ret['pack_umbrella'] = true;
                    ret['daily'][i]['rain'] = weather_res.data['daily'][i]['rain'];
                }
                // Checking the minimum and maximum temperatures to return the type of weather
                if(weather_res.data['daily'][i]['temp']['min'] < 12)
                {
                    ret['weather'] = 'cold';
                }
                if(weather_res.data['daily'][i]['temp']['max'] > 24)
                {
                    ret['weather'] = 'hot';
                }
            }

            ret['wear_mask'] = false;
            try{
                // Making API call to get PM2_5 levels of next 5 days
                let aqi_res = await axios.get('http://api.openweathermap.org'+'/data/2.5/air_pollution/forecast?lat='+lat+'&lon='+lon+'&appid='+appid);

                // Checking all PM2_5 values returned to see if any value is greater than 10
                for(let i=0; i<aqi_res.data['list'].length; i++)
                {
                    if(aqi_res.data['list'][i]['components']['pm2_5'] > 10)
                    {
                        ret['wear_mask'] = true;
                        break;
                    }
                }
                return(ret);
            }
            catch (err) {
                console.error(err);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    catch (err) {
        console.error(err);
    }
}