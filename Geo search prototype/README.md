# Property Locator Map Prototype

This project is a prototype for a property locator map web application built using the Leaflet JavaScript library. It allows users to view available properties around Kigali, Rwanda, and filter properties within a specific radius based on a selected location. The application also includes a "Use My Location" feature to display properties close to the user's current location.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Code Documentation](#code-documentation)
  - [Map Initialization](#map-initialization)
  - [Adding Markers for Properties](#adding-markers-for-properties)
  - [Using the Geocoder](#using-the-geocoder)
  - [Handling User Location](#handling-user-location)
- [Future Improvements](#future-improvements)

---

## Features

- **Map View**: Centers on Kigali, Rwanda, and displays a map with zoom functionality.
- **Property Markers**: Displays property locations as markers on the map, with details for each listing.
- **Geolocation**: Allows the user to view properties near their current location.
- **Radius Filter**: Filters properties based on a user-defined radius from a given location.
- **Search by Location**: Uses a geocoder to search for an address and show properties within a specified distance from that address.

## Demo

Include screenshots or a link to a live demo if available.

## Technologies Used

- **JavaScript**: Main programming language.
- **Leaflet**: For rendering interactive maps.
- **Leaflet Control Geocoder**: To convert addresses into geographic coordinates.
- **HTML/CSS**: For the structure and styling of the web page.

## Project Structure

```
.
├── index.html               # Main HTML file
├── styles.css               # CSS for styling the map and popup elements
├── search.js                # JavaScript code for initializing the map and adding features
└── images                   # Folder containing property images
    ├── kiyovu.jpg
    ├── kimihurura.jpg
    ├── nyarutarama.jpg
    ├── gisozi.jpg
    ├── Boni.jpg
    └── Galileo.jpg
```

## Getting Started

1. Clone this repository:
    ```bash
    git clone <repository-url>
    ```

2. Open the `Geo-search` file in a web browser to view the application.

3. Make sure you have an internet connection, as the prototype relies on external map tiles from OpenStreetMap.

## Usage

1. **Search for Location**: Enter an address or area name in the search box and click "Search" to center the map on that location.
2. **Filter by Radius**: Set a radius value (in kilometers) and search for properties within that distance of the selected location.
3. **Use My Location**: Click "Use My Location" to allow the application to center on your current location and show nearby properties.

## Code Documentation

### Map Initialization

The map is initialized and centered on Kigali, Rwanda, with a zoom level of 13. It uses OpenStreetMap tiles for map rendering.

```javascript
const map = L.map('map').setView([-1.9441, 30.0619], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

L.control.scale().addTo(map);
```

### Adding Markers for Properties

The `houses` array contains a list of property objects, each with details such as name, coordinates, price, description, size, and a link to the full listing. For each property, a marker is added to the map, which opens a popup displaying the property's details.

```javascript
const houses = [
    { 
        name: "Luxury Apartment in Kiyovu", 
        lat: -1.9460, 
        lng: 30.0585, 
        price: "$1,200 per month", 
        description: "2-bedroom luxury apartment in the heart of Kiyovu", 
        size: "110 sqm",
        imageUrl: "images/apartments/kiyovu.jpg",
        link: "https://example.com/listing1"
    },
    // Other properties...
];

houses.forEach(house => {
    const marker = L.marker([house.lat, house.lng]).addTo(map);
    marker.bindPopup(`
        <div class="popup-content">
            <img src="${house.imageUrl}" alt="${house.name}" class="popup-image">
            <div class="popup-details">
                <h3>${house.name}</h3>
                <p>${house.description}</p>
                <p><strong>Size:</strong> ${house.size}</p>
                <p><strong>Price:</strong> ${house.price}</p>
                <a href="${house.link}" target="_blank" class="popup-link">View More</a>
            </div>
        </div>
    `);
});
```

### Using the Geocoder

The Leaflet Control Geocoder is used to search for locations by address. The geocoder converts the address into geographic coordinates, which are then used to center the map and filter properties within the specified radius.

```javascript
const geocoder = L.Control.Geocoder.nominatim();

document.getElementById("searchBtn").addEventListener("click", () => {
    const locationInput = document.getElementById("locationInput").value;
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;

    geocoder.geocode(locationInput, results => {
        if (results.length === 0) {
            alert("Location not found");
            return;
        }

        const result = results[0];
        const userLocation = result.center;
        map.setView(userLocation, 13);
        
        // Filter properties within range
    });
});
```

### Handling User Location

The "Use My Location" feature allows the user to find properties close to their current position. When enabled, the browser requests the user's permission to access their location, then centers the map on their coordinates and filters nearby properties.

```javascript
document.getElementById("locationBtn").addEventListener("click", () => {
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.setView([userLat, userLng], 13);
                addUserLocationMarker(userLat, userLng);

                // Filter properties within range
            },
            error => {
                alert("Unable to retrieve your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
```

## Future Improvements

- **Dynamic Property Data**: Load property data dynamically from a backend server or a database.
- **Enhanced UI**: Improve the interface and add animations for a more engaging user experience.
- **Additional Filters**: Add filters based on property type, price range, and amenities.
- **Responsive Design**: Ensure the application works well on mobile devices.
- **Map Clustering**: Cluster markers for dense areas to improve map readability.