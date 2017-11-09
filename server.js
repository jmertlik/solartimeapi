const express = require('express');
const getDayOfYear = require('date-fns/get_day_of_year');
const formatDate = require('date-fns/format');
const addSeconds = require('date-fns/add_seconds')

const port = 8888

const app = express();

app.get('/', (req, res) => {
    const solarTime = getSolarTime();
    console.log(formatDate(solarTime));

    res.json({data: formatDate(solarTime) });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function getSolarTime(){

    const time = new Date();
    const days = getDayOfYear(time);
    const longitude = -52.7050220;
    const eot = equationOfTime(days);
    return addSeconds(time, ((longitude * 240) + eot));
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function equationOfTime(day) {

    let meanVelocity = 2 * Math.PI / 365.24;
    let obliquity = 23.44 * Math.PI / 180;    
    let approxAngle = meanVelocity * ((day + 10) % 365);                                                                                                  
    let correctedAngle = approxAngle + 0.0334 * Math.sin(meanVelocity) * ((day - 2) % 365);                                                                                                                                                                                                                                                          
    let angleDifference = Math.atan(Math.tan((correctedAngle))) / Math.cos(obliquity);           
    
    angleDifference = approxAngle - angleDifference; 
    angleDifference = angleDifference / Math.PI; 
    return 43200 * (angleDifference - parseInt(angleDifference + 0.5));                              
}