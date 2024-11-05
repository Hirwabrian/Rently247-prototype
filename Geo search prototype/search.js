// Initialize the map centered on Kigali, Rwanda
const map = L.map('map').setView([-1.9441, 30.0619], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale().addTo(map);

// Define the red marker icon for user location
const redIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // URL for a red marker icon
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

// Define a global variable to store the user location marker
let userMarker = null;

// Function to add or update the user's location marker
/**
 * Adds or updates a user location marker on the map.
 *
 * If a user location marker already exists, this function updates its position.
 * Otherwise, it creates a new marker with a red icon at the specified latitude and longitude.
 * The marker will have a popup displaying "Your Location".
 *
 * @param {number} lat - The latitude of the user's location.
 * @param {number} lng - The longitude of the user's location.
 */
function addUserLocationMarker(lat, lng) {
    // If userMarker already exists, update its position
    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        // Otherwise, create a new marker with the red icon
        userMarker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
        userMarker.bindPopup('<strong>Your Location</strong>', {
            offset: [0, -20] // Adjust the Y offset to move the popup above the marker
        }).openPopup();
    }
}

/**
 * An array of house objects, each representing a property listing.
 * 
 * @typedef {Object} House
 * @property {string} name - The name of the property.
 * @property {number} lat - The latitude coordinate of the property.
 * @property {number} lng - The longitude coordinate of the property.
 * @property {string} price - The rental price of the property per month.
 * @property {string} description - A brief description of the property.
 * @property {string} size - The size of the property in square meters.
 * @property {string} imageUrl - The URL to an image of the property.
 * @property {string} link - The URL to the full listing of the property.
 * 
 * @type {House[]}
 */
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


// Geocoder
/**
 * Initializes a geocoder using the Nominatim service from the Leaflet Control Geocoder library.
 * The geocoder is used to convert addresses into geographic coordinates and vice versa.
 *
 * @constant {L.Control.Geocoder} geocoder - The geocoder instance configured to use Nominatim.
 */
const geocoder = L.Control.Geocoder.nominatim();

// Search Button Event
document.getElementById("searchBtn").addEventListener("click", () => {
    const locationInput = document.getElementById("locationInput").value;
    /**
     * Retrieves the value from the input element with the ID "radiusInput",
     * parses it as a floating-point number, and assigns it to the variable `range`.
     * If the input value is not a valid number, defaults to 5.
     *
     * @constant {number} range - The radius value input by the user, defaulting to 5 if invalid.
     */
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;

    if (locationInput) {
        geocoder.geocode(locationInput, results => {
            if (results.length === 0) {
                alert("Location not found");
                return;
            }

            const result = results[0];
            const userLocation = result.center;

            map.setView(userLocation, 13);

            // Clear existing markers (excluding tile layers)
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            // Add markers within the specified range
            houses.forEach(house => {
                const distance = map.distance(userLocation, [house.lat, house.lng]) / 1000; // Convert to km
                if (distance <= range) {
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
                }
            });
        });
    }
});

// "Use My Location" button functionality
document.getElementById("locationBtn").addEventListener("click", () => {
    const range = parseFloat(document.getElementById("radiusInput").value) || 5;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.setView([userLat, userLng], 13);
                
                // Add or update the user's location marker
                addUserLocationMarker(userLat, userLng);

                // Clear existing markers except for the userMarker
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker && layer !== userMarker) {
                        map.removeLayer(layer);
                    }
                });

                // Add markers for houses within range of user's location
                houses.forEach(house => {
                    /**
                     * Calculates the distance between the user's location and the house location in kilometers.
                     *
                     * @param {number} userLat - The latitude of the user's location.
                     * @param {number} userLng - The longitude of the user's location.
                     * @param {Object} house - The house object containing its location coordinates.
                     * @param {number} house.lat - The latitude of the house location.
                     * @param {number} house.lng - The longitude of the house location.
                     * @returns {number} The distance between the user's location and the house location in kilometers.
                     */
                    const distance = map.distance([userLat, userLng], [house.lat, house.lng]) / 1000;
                    if (distance <= range) {
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
                    }
                });
            },
            error => {
                alert("Unable to retrieve your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});