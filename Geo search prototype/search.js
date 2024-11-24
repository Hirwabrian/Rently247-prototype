// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbJxFtFh6YcUVhiTRHFOxB_oSmSKOlRc0",
    authDomain: "map-prototype-5aa15.firebaseapp.com",
    projectId: "map-prototype-5aa15",
    storageBucket: "map-prototype-5aa15.firebasestorage.app",
    messagingSenderId: "783257672955",
    appId: "1:783257672955:web:6237e8f83f90fbfa38a45e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Modal and Map functionality
const modal = document.getElementById("mapModal");
const btnMap = document.getElementById("openMapBtn");
const close = document.getElementsByClassName("close")[0];

// Initialize the map centered on Kigali, Rwanda
const map = L.map('map').setView([-1.9441, 30.0619], 13);

// Add the tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialize a marker cluster group
const markers = L.markerClusterGroup();
map.addLayer(markers);

// Define a circle layer for the radius visualization
let radiusCircle = null;

// User marker
const redIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});
let userMarker = null;

// Function to update user marker
function addUserLocationMarker(lat, lng) {
    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        userMarker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
        userMarker.bindPopup('<strong>Your Location</strong>', {
            offset: [0, -20]
        }).openPopup();
    }
    map.setView([lat, lng], 13);
}

// Function to update the radius visualization
function updateRadius(lat, lng, range) {
    if (radiusCircle) {
        map.removeLayer(radiusCircle);
    }
    radiusCircle = L.circle([lat, lng], {
        radius: range * 1000,
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.2,
    }).addTo(map);
}

// Function to add house markers based on filters
async function addHouseMarkers(lat, lng, range, minBedrooms, minBathrooms, minPrice, maxPrice) {
    markers.clearLayers(); // Clear existing markers

    try {
        // Fetch all properties from Firestore
        const querySnapshot = await db.collection("properties").get();
        const allProperties = querySnapshot.docs.map(doc => doc.data());

        // Use Lodash for filtering
        const filteredProperties = _.filter(allProperties, (property) => {
            const distance = map.distance([lat, lng], [property.lat, property.lng]) / 1000; // Calculate distance in km
            return (
                distance <= range &&
                property.price >= minPrice &&
                property.price <= maxPrice &&
                property.bedrooms >= minBedrooms &&
                property.bathrooms >= minBathrooms
            );
        });

        // Add filtered properties as markers on the map
        filteredProperties.forEach((house) => {
            const marker = L.marker([house.lat, house.lng]).addTo(map);
            marker.bindPopup(`
                <div class="popup-content">
                    <img src="${house.imageUrl}" alt="${house.name}" class="popup-image">
                    <div class="popup-details">
                        <h3>${house.name}</h3>
                        <p>${house.description}</p>
                        <p><strong>Size:</strong> ${house.size}</p>
                        <p><strong>Price:</strong> $${house.price}</p>
                        <a href="${house.link}" target="_blank" class="popup-link">View More</a>
                    </div>
                </div>
            `);
            markers.addLayer(marker); // Add marker to the cluster group
        });
    } catch (error) {
        console.error("Error retrieving properties from Firestore: ", error);
    }
}

// Event listener for "Use My Location" button
document.getElementById("locationBtn").addEventListener("click", () => {
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;
    const minBedrooms = parseInt(document.getElementById("bedroomsModal").value) || 0;
    const minBathrooms = parseInt(document.getElementById("bathroomsModal").value) || 0;
    const minPrice = parseInt(document.getElementById("minPriceModal").value) || 0;  // Default to 0 if no min price
    const maxPrice = parseInt(document.getElementById("maxPriceModal").value) || Infinity;  // Default to Infinity if no max price

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                addUserLocationMarker(userLat, userLng);
                updateRadius(userLat, userLng, range);

                // Call the function to add house markers with all the necessary filters
                addHouseMarkers(userLat, userLng, range, minBedrooms, minBathrooms, minPrice, maxPrice);
            },
            () => {
                alert("Unable to retrieve your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Initialize the geocoder
const geocoder = L.Control.Geocoder.nominatim();

// Event listener for "Search" button
document.getElementById("searchBtn").addEventListener("click", () => {
    const locationInput = document.getElementById("locationInput").value;
    const minBedrooms = parseInt(document.getElementById("bedroomsModal").value) || 0;
    const minBathrooms = parseInt(document.getElementById("bathroomsModal").value) || 0;
    const minPrice = parseInt(document.getElementById("minPriceModal").value) || 0;  // Default to 0 if no min price
    const maxPrice = parseInt(document.getElementById("maxPriceModal").value) || Infinity;  // Default to Infinity if no max price
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;

    if (locationInput) {
        geocoder.geocode(locationInput, (results) => {
            if (results.length === 0) {
                alert("Location not found");
                return;
            }
            const result = results[0];
            const userLocation = result.center;
            addUserLocationMarker(userLocation.lat, userLocation.lng);
            updateRadius(userLocation.lat, userLocation.lng, range);

            // Call the function to add house markers with all the necessary filters
            addHouseMarkers(userLocation.lat, userLocation.lng, range, minBedrooms, minBathrooms, minPrice, maxPrice);
        });
    }
});

// Show the map modal when the button is clicked
btnMap.onclick = function () {
    modal.style.display = "block";
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
};

// Close the modal when the close button is clicked
close.onclick = function () {
    modal.style.display = "none";
};

// Close the modal when the user clicks outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


// Function to get properties from Firestore using compat syntax
async function getProperties() {
    try {
        const querySnapshot = await db.collection("properties").get();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(doc.id, " => ", data);
            // Here you can add the houses to your markers on the map
            addHouseMarker(data);
        });
    } catch (error) {
        console.error("Error retrieving properties: ", error);
    }
}
