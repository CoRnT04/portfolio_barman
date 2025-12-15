let markers = [];

const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Charger les cocktails depuis JSON
fetch('cocktails.json')
    .then(res => res.json())
    .then(cocktails => {
        cocktails.forEach(cocktail => {
            const marker = L.marker([cocktail.lat, cocktail.lng]).addTo(map);
            marker.alcool = cocktail.alcool;

            marker.bindPopup(`
                <b>${cocktail.nom}</b> (${cocktail.pays})<br>
                ${cocktail.description}<br>
                <img src="${cocktail.image}" width="120">
            `);

            // Animation simple au survol
            marker.on('mouseover', () => marker.setOpacity(0.6));
            marker.on('mouseout', () => marker.setOpacity(1));

            markers.push(marker);
        });
    });

// Filtrage par alcool
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const alcoolChoisi = btn.dataset.alcool;
        markers.forEach(marker => {
            if (alcoolChoisi === "Tous" || marker.alcool === alcoolChoisi) {
                if (!map.hasLayer(marker)) map.addLayer(marker);
            } else {
                if (map.hasLayer(marker)) map.removeLayer(marker);
            }
        });
    });
});
