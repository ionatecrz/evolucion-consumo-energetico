document.addEventListener("DOMContentLoaded", function () {
    const climateTitle = document.getElementById("climate-title");
    const climateDataDiv = document.getElementById("climate-data");
    const languageSelector = document.getElementById("language-selector");

    function getTranslation(key) {
        return window.translations?.climate?.[key] || key;
    }

    function fetchClimateData() {
        fetch("https://api.open-meteo.com/v1/forecast?latitude=40.42&longitude=-3.70&current=temperature_2m,cloudcover,shortwave_radiation&timezone=Europe/Madrid")
            .then(response => response.json())
            .then(data => {
                if (data.current) {
                    const temp = data.current.temperature_2m;
                    const clouds = data.current.cloudcover;
                    const radiation = data.current.shortwave_radiation;
                    const lastUpdated = new Date().toLocaleString();

                    updateClimateUI(temp, clouds, radiation, lastUpdated);
                } else {
                    climateDataDiv.innerHTML = `<p>${getTranslation("error")}</p>`;
                }
            })
            .catch(error => {
                console.error("Error al obtener datos climáticos:", error);
                climateDataDiv.innerHTML = `<p>${getTranslation("error")}</p>`;
            });
    }

    function updateClimateUI(temp, clouds, radiation, lastUpdated) {
        if (!window.translations) return;
        climateTitle.textContent = getTranslation("title");
        climateDataDiv.innerHTML = `
            <p><strong>${getTranslation("temperature")}:</strong> ${temp}°C</p>
            <p><strong>${getTranslation("cloudcover")}:</strong> ${clouds}%</p>
            <p><strong>${getTranslation("radiation")}:</strong> ${radiation} W/m²</p>
            <p><em>${getTranslation("updated")}: ${lastUpdated}</em></p>
        `;
    }

    function loadSelectedLanguage() {
        const selectedLanguage = localStorage.getItem("selectedLanguage") || "es";
        languageSelector.value = selectedLanguage;

        fetch(`assets/lang/${selectedLanguage}.json`)
            .then(response => response.json())
            .then(data => {
                window.translations = data;
                fetchClimateData();
            })
            .catch(error => console.error("Error al cargar el idioma almacenado:", error));
    }

    function changeLanguage() {
        const selectedLanguage = languageSelector.value;
        localStorage.setItem("selectedLanguage", selectedLanguage);

        fetch(`assets/lang/${selectedLanguage}.json`)
            .then(response => response.json())
            .then(data => {
                window.translations = data;
                fetchClimateData();
            })
            .catch(error => console.error("Error al cambiar idioma:", error));
    }

    languageSelector.addEventListener("change", changeLanguage);

    loadSelectedLanguage();
    setInterval(fetchClimateData, 600000);
});
