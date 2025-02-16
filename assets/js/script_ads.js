document.addEventListener("DOMContentLoaded", () => {
    const adContainer = document.getElementById("ad-container");

    if (!adContainer) return; 

    const pageCategories = {
        "balance.html": "mobile-accessories",
        "technologies.html": "laptops"
    };

    const page = window.location.pathname.split("/").pop();
    const category = pageCategories[page];

    fetch(`https://dummyjson.com/products/category/mobile-accessories`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Categoría no encontrada`);
        }
        return response.json();
    })
    .then(data => {
        if (data.products && data.products.length > 0) {
            const product = data.products[Math.floor(Math.random() * data.products.length)];
            adContainer.innerHTML = `
                <div class="ad-card">
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <div class="ad-content">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <p class="ad-price"><strong>Precio:</strong> $${product.price}</p>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(product.title)}" 
                        class="buy-button" 
                        target="_blank" 
                        rel="noopener noreferrer">
                            Ver más
                        </a>
                    </div>
                </div>
            `;
        } else {
            adContainer.innerHTML = `<p class="ad-error">No se encontró publicidad disponible.</p>`;
        }
    })
    .catch(error => {
        console.error("Error al cargar el producto:", error);
        adContainer.innerHTML = `<p class="ad-error">No se pudo cargar la publicidad.</p>`;
    });

});
