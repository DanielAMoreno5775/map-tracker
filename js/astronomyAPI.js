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

function getAstronomicalImages(pickupLocation) {
  //get the API key
  const authString = btoa(`39ef0597-a976-40b5-aa9a-96323fd2db7f:e6066031a8c91e638c47fe8b135457a31e034eafc057e2be4770551214c0783f2d555a8b84f9d64dac093495325fd7746652ece4164dacb2f25eccf0b6f6aee3674569ba0614d091c0f640da17a86b8ca8ac576e724016b7ca721d168e2a1490f6f1d8c999a4f5d321ebc18da15014c9`);
  var client = new AstronomyAPI({
    basicToken: authString,
  });

  //infinite loop until all resources in the page have been loaded
  while (1) {
    if (document.readyState === "complete" || document.readyState === "loaded") {
      //get the selected latitude and longitude
      lat = pickupLocation.latitude
      long = pickupLocation.longitude

      console.log(lat)
      console.log(parseFloat(lat))
      console.log(long)
      console.log(parseFloat(long))

      //make API call for moon phase image
      client.moonPhase(
        {
          element: "#moon-phase", // custom html element
          format: "png",
          style: {
            moonStyle: "default",
            backgroundStyle: "solid",
            backgroundColor: "#0a0f3c", //navy blue
            headingColor: "white",
            textColor: "white",
          },
          observer: {
            //latitude: lat,
            //longitude: long,
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            date: yyyymmdd(),
          },
          view: {
            type: "landscape-simple",
            orientation: "north-up",
          },
        },
        (re) => { // callback function
          console.log("done", re);
        },
      );

      //make API call for star chart image
      client.starChart(
        {
          element: "#star-chart", // custom html element
          style: "navy",
          observer: {
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            date: yyyymmdd(),
          },
          view: {
            type: "area",
            parameters: {
              position: {
                equatorial: {
                  rightAscension: 14.83,
                  declination: -15.23
                }
              },
              zoom: 3
            },
          },
        },
        (re) => { // callback function
          console.log("done", re);
        },
      );

      break //ends the loop
    }
  }

  
}

/*
document.addEventListener("DOMContentLoaded", function () {
  //get the API key
  const authString = btoa(`39ef0597-a976-40b5-aa9a-96323fd2db7f:e6066031a8c91e638c47fe8b135457a31e034eafc057e2be4770551214c0783f2d555a8b84f9d64dac093495325fd7746652ece4164dacb2f25eccf0b6f6aee3674569ba0614d091c0f640da17a86b8ca8ac576e724016b7ca721d168e2a1490f6f1d8c999a4f5d321ebc18da15014c9`);
  var client = new AstronomyAPI({
    basicToken: authString,
  });

  //get the selected latitude and longitude
  

  //make API call for moon phase image
  client.moonPhase(
    {
      element: "#moon-phase", // custom html element
      format: "png",
      style: {
        moonStyle: "default",
        backgroundStyle: "solid",
        backgroundColor: "#0a0f3c", //#0a0f3c
        headingColor: "white",
        textColor: "white",
      },
      observer: {
        latitude: 32.899072,
        longitude: -97.3570048,
        date: yyyymmdd(),
      },
      view: {
        type: "landscape-simple",
        orientation: "north-up",
      },
    },
    (re) => { // callback function
      console.log("done", re);
    },
  );

  //make API call for star chart image
  client.starChart(
    {
      element: "#star-chart", // custom html element
      style: "navy",
      observer: {
        latitude: 32.899072,
        longitude: -97.3570048,
        date: yyyymmdd(),
      },
      view: {
        type: "area",
        parameters: {
          position: {
            equatorial: {
              rightAscension: 14.83,
              declination: -15.23
            }
          },
          zoom: 3
        },
      },
    },
    (re) => { // callback function
      console.log("done", re);
    },
  );
});
*/