// Initialize the map centered on Kigali, Rwanda
const map = L.map('map').setView([-1.9441, 30.0619], 13);

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
            offset: [0, -20] // Adjust the Y offset to move the popup above the marker
        }).openPopup();
    }

    // Center the map on the user's location
    map.setView([lat, lng], 13);
}

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
    { 
        name: "Cozy Townhouse in Kimihurura", 
        lat: -1.9480, 
        lng: 30.0620, 
        price: "$900 per month", 
        description: "Charming 2-bedroom townhouse with a garden in Kimihurura", 
        size: "130 sqm",
        imageUrl: "images/apartments/kimihurura.jpg",
        link: "https://example.com/listing2"
    },
    { 
        name: "Family Villa in Nyarutarama", 
        lat: -1.9400, 
        lng: 30.0700, 
        price: "$2,500 per month", 
        description: "Spacious 4-bedroom villa with private pool in Nyarutarama", 
        size: "300 sqm",
        imageUrl: "images/apartments/nyarutarama.jpg",
        link: "https://example.com/listing3"
    },
    { 
        name: "Modern Apartment in Gisozi", 
        lat: -1.9186673694533758, 
        lng: 30.0601100522657, 
        price: "$700 per month", 
        description: "Affordable 1-bedroom apartment in Gisozi", 
        size: "65 sqm",
        imageUrl: "images/apartments/gisozi.jpg",
        link: "https://example.com/listing4"
    },
    { 
        name: "Mater Boni Consili", 
        lat: -2.596630334499189, 
        lng: 29.747333310392225, 
        price: "$1,000 per month", 
        description: "Hostel apartment in Butare", 
        size: "400 sqm",
        imageUrl: "images/apartments/Boni.jpg",
        link: "https://example.com/listing5"
    },
    { 
        name: "Galileo Hotel", 
        lat: -2.593057831475852, 
        lng: 29.73711670060341,
        price: "$1,000 per month", 
        description: "Hostel apartment ", 
        size: "250 sqm",
        imageUrl: "images/apartments/Galileo.jpg",
        link: "https://example.com/listing5"
    }
];


// Function to update the radius visualization
function updateRadius(lat, lng, range) {
    // Remove the existing circle
    if (radiusCircle) {
        map.removeLayer(radiusCircle);
    }

    // Add a new circle
    radiusCircle = L.circle([lat, lng], {
        radius: range * 1000, // Convert km to meters
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.2,
    }).addTo(map);
}

// Function to add house markers within the range
function addHouseMarkers(lat, lng, range) {
    markers.clearLayers(); // Clear existing markers

    houses.forEach((house) => {
        const distance = map.distance([lat, lng], [house.lat, house.lng]) / 1000; // Convert to km
        if (distance <= range) {
            const marker = L.marker([house.lat, house.lng]);
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
            markers.addLayer(marker);
        }
    });
}

// Event listener for "Use My Location" button
document.getElementById("locationBtn").addEventListener("click", () => {
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Add user marker and update the radius visualization
                addUserLocationMarker(userLat, userLng);
                updateRadius(userLat, userLng, range);

                // Add house markers within the range
                addHouseMarkers(userLat, userLng, range);
            },
            (error) => {
                alert("Unable to retrieve your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

const geocoder = L.Control.Geocoder.nominatim();

// Event listener for "Search" button
document.getElementById("searchBtn").addEventListener("click", () => {
    const locationInput = document.getElementById("locationInput").value;
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;

    if (locationInput) {
        geocoder.geocode(locationInput, (results) => {
            if (results.length === 0) {
                alert("Location not found");
                return;
            }

            const result = results[0];
            const userLocation = result.center;

            // Add user marker and update the radius visualization
            addUserLocationMarker(userLocation.lat, userLocation.lng);
            updateRadius(userLocation.lat, userLocation.lng, range);

            // Add house markers within the range
            addHouseMarkers(userLocation.lat, userLocation.lng, range);
        });
    }
});
