var map;
var markers = [];
var waterData = {};  // Data structure to store water levels by date
var dateList = [];   // List to store all the dates from the waterLevels array

// Initialize the map centered on Chennai
function initMap() {
    map = L.map('map').setView([13.0827, 80.2707], 10); // Chennai coordinates

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Function to process the water data from the waterLevels variable
function processWaterData(data) {
    const reservoirs = Object.keys(data[0]).slice(1); // Extract the reservoir names (skip the Date column)

    // Fill the waterData object with dates and corresponding water levels
    data.forEach(row => {
        const date = row['Date']; // First column is the date in DD-MM-YYYY format
        dateList.push(date); // Store available dates for validation

        waterData[date] = []; // Initialize water data for the date

        // Create entries for each reservoir
        reservoirs.forEach(reservoir => {
            const level = parseFloat(row[reservoir]); // Water level for the reservoir
            waterData[date].push({
                locality: reservoir,
                coordinates: getCoordinates(reservoir), // Get coordinates for each locality
                level: level
            });
        });
    });

    // Initialize the map after data is ready
    initMap();
    initializeDatePicker();
}

// Call the processWaterData function with the data from the `output.js` file
processWaterData(waterLevels);

// Function to initialize the date picker
function initializeDatePicker() {
    const datePicker = document.getElementById('datePicker');

    // Event listener for when the user selects a date
    datePicker.addEventListener('change', function(e) {
        const selectedDate = e.target.value; // Get the selected date in YYYY-MM-DD format
        const formattedDate = formatDate(selectedDate); // Convert to DD-MM-YYYY format
        console.log(`Selected date from date picker: ${formattedDate}`); // Log the selected date

        // Check for the formatted date in waterData
        if (waterData[formattedDate]) {
            document.getElementById('dateDisplay').textContent = formattedDate;
            updateMarkersByDate(formattedDate); // Update markers based on selected date
        } else {
            alert('No data available for the selected date.');
        }
    });
}

// Function to convert the selected date from YYYY-MM-DD to DD-MM-YYYY
function formatDate(dateString) {
    const dateParts = dateString.split("-");
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Rearrange date to DD-MM-YYYY
}

// Function to update markers by the selected date
function updateMarkersByDate(date) {
    // Remove existing markers
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];

    // Add new markers for the selected date
    waterData[date].forEach(reservoirData => {
        const marker = L.circleMarker(reservoirData.coordinates, {
            radius: 8,
            color: getColorByWaterLevel(reservoirData.level),
            fillOpacity: 0.6
        }).addTo(map)
        .bindPopup(`${reservoirData.locality}: ${reservoirData.level} water level`);

        markers.push(marker);
    });
}

// Function to return color based on water level
function getColorByWaterLevel(level) {
    if (level > 200) {
        return 'green';
    } else if (level > 50) {
        return 'yellow';
    } else {
        return 'red';
    }
}

// Function to get coordinates for a given reservoir
function getCoordinates(reservoir) {
    const coordinatesMap = {
        "POONDI": [13.2166, 79.7836],
        "CHOLAVARAM": [13.2065, 80.1358],
        "REDHILLS": [13.1835, 80.1938],
        "CHEMBARAMBAKKAM": [13.0105, 80.1060]
    };
    return coordinatesMap[reservoir];
}