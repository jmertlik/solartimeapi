/*
    Equation of time calculation
    *** No guarantees are implied. Use at your own risk ***

    Originally written by Del Smith, 2016-11-29
    Rewritten by xxc3nsoredxx for improved readability, 2017-08-06

    Based on "Equation of time" Wikipedia article as of 2017-08-6

    It appears to give a good result, but I make no claims for accuracy.
*/
// Use the constant for pi defined in java.lang.Math
private static final double meanVelocity = 2 * Math.PI / 365.24;    // Mean angular orbital velocity of Earth in radians/day
private static final double obliquity = 23.44 * Math.PI / 180;      // Obliquity of the Earth (tilt) on its axis;

// Calculate the Equation of Time from 'day of year'
// day represents the day of the year with 0 being January 1
// Returned is the value for the Equation of Time in seconds
public static double equationOfTime(int day) {
    // The returned result is in seconds
    // Add to the Mean Solar Time (UTC + Longitude*240 sec.) to get Apparent Solar Time

    double approxAngle = meanVelocity * ((day + 10) % 365);                                       // Angle the Earth would move on its orbit at mean velocity from the December
                                                                                                  //     solstice until the day specified
                                                                                                  // 10 comes from the approximate number of days from December solstice to January 1
    double correctedAngle = approxAngle + 0.0334 * Math.sin(meanVelocity * ((day - 2) % 365));    // Angle the Earth would move from solstice to specified day, with a correction
                                                                                                  //     for Earth's orbital eccentricity
                                                                                                  // 2 is the number of days from January 1 to Earth's perihelion
                                                                                                  // 0.0334 is the angle provided in the article (1.914 deg) in radians
    double angleDifference = Math.atan(Math.tan(correctedAngle) / Math.cos(obliquity));           // Difference between the angle moved at mean velocity and at the corrected velocity,
                                                                                                  //     projected onto equatorial plane
    angleDifference = approxAngle - angleDifference;                                              // Split into multiple lines for better readability
    angleDifference = angleDifference / Math.PI;                                                  // Divided by pi to get the value in half-turns
    return 43200 * (angleDifference - (int)(angleDifference + 0.5));                              // Return the Equation of Time in seconds
                                                                                                  // Corrected for any excess integer count half turns
                                                                                                  // 43200 comes from the number of seconds it takes for Earth to complete a half turn
                                                                                                  //     (12h * 60m * 60s)
}