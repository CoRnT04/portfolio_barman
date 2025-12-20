// Créer la map
const map = L.map('map').setView([20, 0], 2);

// TileLayer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Groupe de clusters avec style DA
const markersCluster = L.markerClusterGroup({
    maxClusterRadius: 50, // un peu plus large pour clusters
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
            html: `<div style="
                background: linear-gradient(135deg, #FF7E5F, #FFB347);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                font-size: 1em;
            ">${count}</div>`,
            className: 'custom-cluster',
            iconSize: L.point(40, 40)
        });
    }
});

let allMarkers = [];

// Charger les cocktails depuis JSON
fetch('cocktails.json')
    .then(res => res.json())
    .then(cocktails => {
        cocktails.forEach(cocktail => {
            const marker = L.circleMarker([cocktail.lat, cocktail.lng], {
                radius: 9,                  // légèrement plus grand
                fillColor: "#FF7E5F",       // couleur DA
                color: "#FFB347",           // bordure DA
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            });

            marker.alcool = cocktail.alcool;

            marker.bindPopup(`
                <b>${cocktail.nom}</b> (${cocktail.pays})<br>
                ${cocktail.description}<br>
                <img src="${cocktail.image}" width="120">
            `);

            marker.on('mouseover', () => marker.setStyle({ opacity: 0.6 }));
            marker.on('mouseout', () => marker.setStyle({ opacity: 1 }));

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
