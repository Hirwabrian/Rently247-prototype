# Property Locator Map Prototype

An interactive map application that helps users locate properties around Kigali, Rwanda. This prototype integrates **Leaflet.js** for map rendering and **Firebase** for property data management. Users can view property locations, filter by radius, search by address, and use their current location to find nearby listings.

---

## Table of Contents
1. [Features](#features)   
2. [Technologies Used](#technologies-used)  
3. [Project Structure](#project-structure)  
4. [Getting Started](#getting-started)  
5. [Usage](#usage)  
6. [Code Documentation](#code-documentation)  
    - [Map Initialization](#map-initialization)  
    - [Fetching Property Data from Firebase](#fetching-property-data-from-firebase)  
    - [Adding Markers to the Map](#adding-markers-to-the-map)  
    - [Using the Geocoder](#using-the-geocoder)  
    - [Handling User Location](#handling-user-location)  
7. [Future Improvements](#future-improvements)  

---

## Features
- **Map View:** Centers on Kigali, Rwanda, with zoom functionality for navigation.  
- **Property Markers:** Displays dynamic property listings from Firebase as map markers, each with detailed information.  
- **Geolocation:** Centers the map on the user's location and filters nearby properties.  
- **Radius Filter:** Allows filtering properties within a user-defined distance from a selected location.  
- **Search by Location:** Converts addresses into geographic coordinates to filter nearby properties.  
- **Real-Time Data:** Synchronizes property data using Firebase.

---

## Demo
_Details about a working demo or screenshots can go here._

---

## Technologies Used
- **JavaScript**: Core language for application interactivity.  
- **Leaflet.js**: Renders the map and manages markers.  
- **Firebase**:  
  - **Firestore**: Stores and retrieves property data.  
  - **Hosting**: Deploys the application.  
  - **Authentication** (optional): Manages user access.  
- **HTML/CSS**: Structures and styles the application.  

---

## Project Structure
```
.
├── index.html               # Main HTML file
├── styles.css               # CSS for styling the map and popup elements
├── search.js                # JavaScript code for map logic
├── firebase.js              # Firebase configuration and data integration
└── images                   # Optional folder for static images
    ├── kiyovu.jpg
    ├── kimihurura.jpg
    ├── nyarutarama.jpg
    ├── gisozi.jpg
    ├── Boni.jpg
    └── Galileo.jpg
```

---

## Getting Started
### Prerequisites
- Firebase project setup (Firestore database configured with property data).  
- Internet connection (for external map tiles and Firebase access).  
- Modern web browser.

### Steps to Run Locally
1. Clone the repository:  
   ```bash
   git clone <repository-url>
   cd property-locator-map
   ```
2. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a web app and copy the Firebase configuration object.
   - Replace the placeholder in `firebase.js` with your configuration.
3. Open `index.html` in a web browser.

---

## Usage
1. **Search for a Location:**  
   Enter an address and click "Search" to center the map on that location.  
2. **Filter by Radius:**  
   Enter a radius (in kilometers) to display properties within that distance from the selected location.  
3. **Use My Location:**  
   Click "Use My Location" to center the map on your location and find nearby properties.  
4. **View Property Details:**  
   Click on markers to see details like price, size, and a link to the listing.

---

## Code Documentation

### Map Initialization
The map initializes and centers on Kigali. OpenStreetMap tiles are used for rendering:  
```javascript
const map = L.map('map').setView([-1.9441, 30.0619], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

L.control.scale().addTo(map);
```

---

### Fetching Property Data from Firebase
Properties are retrieved from Firebase Firestore in real time:  
```javascript
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

async function fetchProperties() {
    const querySnapshot = await getDocs(collection(db, "properties"));
    querySnapshot.forEach(doc => {
        const property = doc.data();
        addMarker(property);
    });
}
```

---

### Adding Markers to the Map
Markers are dynamically added to the map based on data from Firebase:  
```javascript
function addMarker(property) {
    const marker = L.marker([property.lat, property.lng]).addTo(map);
    marker.bindPopup(`
        <div class="popup-content">
            <h3>${property.name}</h3>
            <p><strong>Price:</strong> ${property.price}</p>
            <p>${property.description}</p>
            <a href="${property.link}" target="_blank">View Listing</a>
        </div>
    `);
}
```

---

### Using the Geocoder
Addresses are converted into map coordinates for searches:  
```javascript
const geocoder = L.Control.Geocoder.nominatim();

document.getElementById("searchBtn").addEventListener("click", () => {
    const location = document.getElementById("locationInput").value;
    geocoder.geocode(location, results => {
        if (results.length === 0) {
            alert("Location not found");
            return;
        }
        const result = results[0];
        const userLocation = result.center;
        map.setView(userLocation, 13);
        filterProperties(userLocation, range);
    });
});
```

---

### Handling User Location
Finds nearby properties based on the user's location:  
```javascript
document.getElementById("locationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
                filterProperties([latitude, longitude], range);
            },
            error => {
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
```

---

## Future Improvements
- **Advanced Filters:** Add options for filtering by property type, amenities, and price range.  
- **Admin Panel:** Allow property owners to manage listings directly.  
- **Responsive Design:** Optimize the application for mobile devices.  
- **Map Clustering:** Cluster markers for high-density areas.  
- **Enhanced Authentication:** Use Firebase Authentication for secure user access.  

---
