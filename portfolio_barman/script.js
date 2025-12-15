// Toggle avis avec fermeture des autres cocktails
document.querySelectorAll('.cocktail').forEach(cocktail => {
    cocktail.addEventListener('click', () => {
        // Fermer tous les autres cocktails
        document.querySelectorAll('.cocktail').forEach(c => {
            if (c !== cocktail) c.classList.remove('active');
        });

        // Toggle le cocktail cliqué
        cocktail.classList.toggle('active');
    });
});