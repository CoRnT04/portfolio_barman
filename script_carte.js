// Créer la map
const map = L.map('map').setView([20, 0], 2);

// TileLayer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Créer un groupe de clusters
const markersCluster = L.markerClusterGroup({
    maxClusterRadius: 40,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true
});

let allMarkers = [];

// Charger les cocktails depuis JSON
fetch('cocktails.json')
    .then(res => res.json())
    .then(cocktails => {
        cocktails.forEach(cocktail => {
            const marker = L.marker([cocktail.lat, cocktail.lng]);
            marker.alcool = cocktail.alcool;

            marker.bindPopup(`
                <b>${cocktail.nom}</b> (${cocktail.pays})<br>
                ${cocktail.description}<br>
                <img src="${cocktail.image}" width="120">
            `);

            marker.on('mouseover', () => marker.setOpacity(0.6));
            marker.on('mouseout', () => marker.setOpacity(1));

            markersCluster.addLayer(marker);
            allMarkers.push(marker);
        });

        map.addLayer(markersCluster);
    });

// Filtrage par alcool
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const alcoolChoisi = btn.dataset.alcool;

        markersCluster.clearLayers();

        allMarkers.forEach(marker => {
            if (alcoolChoisi === "Tous" || marker.alcool === alcoolChoisi) {
                markersCluster.addLayer(marker);
            }
        });
    });
});
