var map;
var markers = []; // Global array to hold marker objects

function initMap() {
  map = L.map('map').setView([11.5000, 77.5946], 8); // Bengaluru coordinates

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add the Kaveri River polyline to the map
  addKaveriRiver();

  // Add the markers to the map
  addMarkers();

  // Set up filter event listeners after the DOM is loaded
  setupFilters();
}

function addMarkers() {
  waterData.forEach((area) => {
    addMarker(area.locality, area.lat, area.lng, area.waterLevel);
  });
}

function addMarker(locality, lat, lng, waterLevel) {
  let markerColor;

  if (waterLevel < 10) {
      markerColor = 'red';
  } else if (waterLevel >= 10 && waterLevel <= 20) {
      markerColor = 'yellow';
  } else {
      markerColor = 'green';
  }

  // Create the circle marker with a larger radius
  let marker = L.circleMarker([lat, lng], {
      radius: 30, // Adjust the size of the circle marker
      color: markerColor,
      fillColor: markerColor,
      fillOpacity: 0.5
  }).bindPopup(`${locality} - Water Level: ${waterLevel} m`);

  marker.addTo(map); // Add marker to the map

  // Push the marker and its color into the global markers array
  markers.push({ marker: marker, color: markerColor });
}

function addKaveriRiver() {
  // Corrected Kaveri River path coordinates
  var kaveriCoordinates = [
    [12.4160, 75.3333], // Talakaveri (Origin)
    [12.5095, 75.7345], // Madikeri
    [12.4212, 75.8489], // Bhagamandala
    [12.4642, 76.0457], // Kushalnagar
    [12.4388, 76.0956], // Holenarsipur
    [12.2757, 76.6346], // Srirangapatna
    [12.2173, 77.0229], // Shivanasamudra Falls
    [12.1132, 78.1656], // Dharmapuri
    [11.8044, 77.8044], // Bhavani
    [11.3410, 77.7129], // Erode
    [10.9649, 78.0866], // Karur
    [10.7905, 78.7047], // Tiruchirappalli
    [10.7900, 79.1545], // Thanjavur
    [11.1330, 79.8497], // Poompuhar (End Point near the Bay of Bengal)
  ];

  // Create the polyline for Kaveri River
  let kaveriPolyline = L.polyline(kaveriCoordinates, {
    color: 'blue', // Set the color for the river
    weight: 2,     // Thickness of the line
    opacity: 0.7,  // Transparency
    smoothFactor: 1
  }).bindPopup('Kaveri River').addTo(map); // Add polyline to map
  
  // Create a shadow for the river
  let kaveriShadow = L.polyline(kaveriCoordinates, {
    color: 'skyblue',     // Sky blue shadow color
    weight: 10,           // Thicker for shadow effect
    opacity: 0.3,         // More transparent for the shadow
    smoothFactor: 1
  }).addTo(map); // Add shadow to map
}

function filterMarkers(color) {
  // Loop through all markers and show/hide based on the filter color
  markers.forEach((item) => {
    if (item.color === color) {
      map.addLayer(item.marker); // Show marker
    } else {
      map.removeLayer(item.marker); // Hide marker
    }
  });
}

function setupFilters() {
  // Event listeners for filter buttons
  document.getElementById('filter-green').addEventListener('click', function () {
    filterMarkers('green');
  });

  document.getElementById('filter-yellow').addEventListener('click', function () {
    filterMarkers('yellow');
  });

  document.getElementById('filter-red').addEventListener('click', function () {
    filterMarkers('red');
  });

  document.getElementById('filter-all').addEventListener('click', function () {
    markers.forEach((item) => {
      map.addLayer(item.marker); // Show all markers
    });
  });
}