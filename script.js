const apiKey = "bfa111a9624edbd98655f2ae5cd01081"; // Replace with your OpenWeather API key

// Main function to get weather by city name
async function getWeatherByCity(city) {
  const weatherResult = document.getElementById("weatherResult");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);

    //Handles HTTP Errors:
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.cod === "404") {
      weatherResult.innerHTML =
        '<p style="color:red;">City not found. Try again.</p>';
    } else {
      const temp = data.main.temp;
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;

      weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p><strong>${temp}°C</strong></p>
        <p style="text-transform: capitalize;">${description}</p>
      `;
    }
  } catch (error) {
    console.error("Error:", error);
    weatherResult.innerHTML = ` 
    <p style="color:red;">
    ${
      error.message.includes("HTTP error")
        ? "Weather service unavailable. Try later."
        : "Something went wrong. Try again."
    }
    </p>`;
  }
}

// Called when user clicks "Get Weather" button
function getWeather() {
  const cityInput = document.getElementById("cityInput").value.trim();
  if (cityInput) {
    getWeatherByCity(cityInput);
  } else {
    document.getElementById("weatherResult").innerHTML =
      '<p style="color:red;">Please enter a city name.</p>';
  }
}

// Add Enter key listener to the input field
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather(); // Trigger search on Enter key
  }
});


// 🔍 Get city name using latitude and longitude (Reverse Geocoding)
async function getCityFromCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data && data.length > 0) {
    // console.log(data)
    return data[0].name;
    
  } else {
    throw new Error("City not found from coordinates.");
  }
}

// Get weather by user’s current location
function getWeatherByLocation() {
  const weatherResult = document.getElementById("weatherResult");
  weatherResult.innerHTML =
    '<p style="color:#2563eb;">Detecting your location...</p>';

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const city = await getCityFromCoordinates(lat, lon);
          getWeatherByCity(city);
        } catch (err) {
          console.error("Error getting city from location:", err);
          weatherResult.innerHTML =
            '<p style="color:red;">Failed to get city from location.</p>';
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        weatherResult.innerHTML =
          '<p style="color:red;">Location access denied.</p>';
      }
    );
  } else {
    weatherResult.innerHTML =
      '<p style="color:red;">Geolocation not supported by your browser.</p>';
  }
}