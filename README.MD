# Reactive Internet Application

#### By Vanshika Sinha

This is a simple Internet Application that inputs the city that someone is planning to go to. The server side uses the openweathermap API to get the weather forecast for that city for the next 4 days and the client side displays some information which includes the type of weather according to which the user should pack for cold, mild or hot temperatures. It also indicates that the user should bring an umbrella or not and it also gives a summary table for the next 4 days showing temperature, wind speed and rainfall level.

## Client Implementation

* Running in an internet browser using Vue.js
* Utilizes the V- directives and moustache syntax
* Interacts with a Server-Side application

## Server Implementation

* Exposes the API primitive and consumes the services of a 3rd party Web API

## Innovative feature

Whenever the user inputs any city's name, the picture associated with the city is also diplayed along with the information on the weather of that city. The picture is fetched using Unsplash API on the server.