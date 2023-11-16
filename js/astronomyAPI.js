function yyyymmdd() {
  var date = new Date()

  // Get year, month, and day part from the date
  var year = date.toLocaleString("default", { year: "numeric" })
  var month = date.toLocaleString("default", { month: "2-digit" })
  var day = date.toLocaleString("default", { day: "2-digit" })

  // Generate yyyy-mm-dd date string
  var formattedDate = year + "-" + month + "-" + day
  return formattedDate
}

function resetAPIImages() {
  let moonImg = document.getElementById('moon-phase')
  let starImg = document.getElementById('star-chart')

  moonImg.remove()
  starImg.remove()
}

//add a new function to the Date object
Date.prototype.getJulian = function() {
  //this divided by 86400000 reflects the days since epoch
  //1440 minutes in a day
  //(this.getTimezoneOffset() / 1440) subtracts the local systems timezone offset
  //2440587.5 is the number of days from 4713BC to 1970AD
  return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
}

function reduceAngle (deg) {
  deg %= 360
  if (deg < 0) {
    deg += 360
  }
  return deg
}

function getAstronomicalImages(pickupLocation) {
  //remove the previously generated images
  document.querySelectorAll("#moon-phase img").forEach(img => img.remove());
  document.querySelectorAll("#star-chart img").forEach(img => img.remove());

  //get the selected latitude and longitude
  lat = pickupLocation.latitude
  long = pickupLocation.longitude

  //calculate declination based on observer's latitude
  declinationVar = parseFloat(lat)

  //calculate right ascension based on the time and the observer's longitude
  //equations from Astronomical Algorithms by Jean Meeus
  let today = new Date()
  let julianDay = today.getJulian()
  let t = ((julianDay - 2451545.0) / 36525)
  let theta0 = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + (0.000387933 * t * t) - (t * t * t / 38710000.0)
  let gmstRA = reduceAngle(theta0)
  let lmstRA = gmstRA + long
  let rightAscensionVar = (lmstRA / 15)

  console.log(long)
  console.log(gmstRA)
  console.log(rightAscensionVar)

  //infinite loop until all resources in the page have been loaded
  while (1) {
    if (document.readyState === "complete" || document.readyState === "loaded") {
      //get the API
      const authString = btoa(`39ef0597-a976-40b5-aa9a-96323fd2db7f:e6066031a8c91e638c47fe8b135457a31e034eafc057e2be4770551214c0783f2d555a8b84f9d64dac093495325fd7746652ece4164dacb2f25eccf0b6f6aee3674569ba0614d091c0f640da17a86b8ca8ac576e724016b7ca721d168e2a1490f6f1d8c999a4f5d321ebc18da15014c9`);
      var client = new AstronomyAPI({
        basicToken: authString,
      });

      //make API call for moon phase image
      client.moonPhase(
        {
          element: "#moon-phase", // html element to target
          format: "png",
          style: {
            moonStyle: "default",
            backgroundStyle: "solid",
            backgroundColor: "#0a0f3c", //navy blue
            headingColor: "white",
            textColor: "white"
          },
          observer: {
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            date: yyyymmdd()
          },
          view: {
            type: "landscape-simple",
            orientation: "north-up"
          },
        },
        (re) => { // callback function
          console.log("done", re)
          setTimeout(function() {
            displayUpdate('The moon phase and time of rising/setting for the selected location have been retrieved', '#6F8FAF');
          }, (2500)); //basically delays action by 2500 milliseconds
        },
      );

      //make API call for star chart image
      client.starChart(
        {
          element: "#star-chart", // html element to target
          style: "navy",
          observer: {
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            date: yyyymmdd()
          },
          view: {
            type: "area",
            parameters: {
              position: {
                equatorial: {
                  rightAscension: rightAscensionVar,
                  declination: declinationVar
                }
              },
              zoom: 3
            },
          },
        },
        (re) => { // callback function
          console.log("done", re)
          setTimeout(function() {
            displayUpdate('<strong>An image of the stars above the selected location has been retrieved</strong>', '#6F8FAF');
          }, (500)); //basically delays action by 500 milliseconds
        },
      );

      break //ends the loop
    }
  }
}