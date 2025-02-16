document.addEventListener("DOMContentLoaded", function () {
    loadSVG();
    loadCSVData();
});

function loadSVG() {
    fetch("../assets/img/chart.svg")
        .then(response => response.text())
        .then(svgData => {
            const mapContainer = document.getElementById("map");
            if (mapContainer) {
                mapContainer.innerHTML = svgData;
                let svgElement = document.querySelector("#map svg");
                if (svgElement) {
                    svgElement.style.width = "100%";
                    svgElement.style.height = "auto";
                    loadCSVData();
                } else {
                    console.error("El SVG no se insertó correctamente.");
                }
            } else {
                console.error("No se encontró el contenedor del mapa.");
            }
        })
        .catch(error => console.error("Error cargando el SVG:", error));
}

function loadCSVData() {
    const lang = localStorage.getItem("selectedLanguage") || "es";

    fetch('../assets/data/chart.csv')
        .then(response => response.text())
        .then(csvData => {
            let demandData = parseCSV(csvData);
            updateSVG(demandData);
            populateSelectors(csvData, lang);
        })
        .catch(error => console.error("Error cargando el CSV:", error));
}

function parseCSV(csvData) {
    let rows = csvData.trim().split("\n").slice(1);
    let demandData = {};

    rows.forEach(row => {
        let [region, demand] = row.split(",");
        if (region && demand) {
            demandData[region.trim()] = parseFloat(demand);
        }
    });

    return demandData;
}

function updateSVG(data) {
    const tooltip = document.getElementById("tooltip");
    const lang = localStorage.getItem("selectedLanguage") || "es"; 

    document.querySelectorAll("#map svg path").forEach(region => {
        let regionName = region.getAttribute("aria-label");
        if (regionName) {
            let name = regionName.split(",")[0].replace(/^\d+\.\s*/, "").trim();
            let translatedName = regionTranslations[lang][name] || name;
            let demand = data[name];

            if (demand !== undefined) {
                let originalStroke = region.getAttribute("stroke") || "none";
                let originalStrokeWidth = region.getAttribute("stroke-width") || "1";

                region.setAttribute("fill", getColor(demand));

                region.addEventListener("mouseover", function(event) {
                    tooltip.style.display = "block";
                    tooltip.innerHTML = `<strong>${translatedName}</strong>: ${formatNumber(demand, lang)} GWh`;

                    this.setAttribute("stroke-width", "2");
                    this.setAttribute("opacity", "0.8");
                });

                region.addEventListener("mousemove", function(event) {
                    tooltip.style.top = (event.pageY + 10) + "px";
                    tooltip.style.left = (event.pageX + 10) + "px";
                });

                region.addEventListener("mouseout", function() {
                    tooltip.style.display = "none";
                    this.setAttribute("stroke", originalStroke);
                    this.setAttribute("stroke-width", originalStrokeWidth);
                    this.setAttribute("opacity", "1");
                });
            }
        }
    });
}

function populateSelectors(csvData, lang) {
    const lines = csvData.split("\n").map(line => line.trim()).filter(line => line !== "");
    const headers = lines[0].split(",");

    const regionSelect = document.getElementById("regionSelect");
    const energyTypeSelect = document.getElementById("energyType");

    regionSelect.innerHTML = "";
    energyTypeSelect.innerHTML = "";

    lines.slice(1).forEach(line => {
        const values = line.split(",");
        const region = values[0].trim();
        const translatedRegion = regionTranslations[lang][region] || region;

        const option = document.createElement("option");
        option.value = region;
        option.textContent = translatedRegion;
        regionSelect.appendChild(option);
    });

    headers.slice(2).forEach(energy => {
        const translatedEnergy = energyTranslations[lang][energy] || energy;

        const option = document.createElement("option");
        option.value = energy;
        option.textContent = translatedEnergy;
        energyTypeSelect.appendChild(option);
    });
}

function getColor(value) {
    if (value >= 40000) return "#FFDD00";
    if (value >= 30040) return "#FFE747";
    if (value >= 20060) return "#FFEF85";
    if (value >= 10080) return "#F9F1BD";
    return "#FDF9E0";
}

function formatNumber(value, lang) {
    return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : lang === "en" ? "en-US" : "es-ES").format(value);
}

document.getElementById("language-selector").addEventListener("change", function (event) {
    localStorage.setItem("selectedLanguage", event.target.value);
    location.reload();
});

function downloadExcel() {
    const lang = localStorage.getItem("selectedLanguage") || "es";

    fetch('../assets/data/chart.csv')
        .then(response => response.text())
        .then(csv => {
            const lines = csv.split("\n").map(line => line.trim()).filter(line => line !== "");
            const headers = lines[0].split(",");

            const selectedRegions = Array.from(document.getElementById("regionSelect").selectedOptions).map(option => option.value);
            const selectedEnergies = Array.from(document.getElementById("energyType").selectedOptions).map(option => option.value);

            if (selectedRegions.length === 0 || selectedEnergies.length === 0) {
                alert("Por favor, selecciona al menos una Comunidad Autónoma y una Fuente de Energía.");
                return;
            }

            let selectedColumns = [0];
            headers.forEach((header, index) => {
                if (selectedEnergies.includes(header.trim())) {
                    selectedColumns.push(index);
                }
            });

            let filteredData = lines.slice(1)
                .map(line => line.split(","))
                .filter(row => selectedRegions.includes(row[0].trim()));

            let finalData = filteredData.map(row => selectedColumns.map(index => row[index].trim()));
            finalData.unshift(selectedColumns.map(index => headers[index].trim()));

            const translatedHeaders = finalData[0].map(header => energyTranslations[lang][header] || header);
            finalData[0] = translatedHeaders;

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            if (!name || !email) {
                alert("Por favor, completa tu nombre y correo antes de descargar.");
                return;
            }

            let worksheetData = [
                ["Nombre:", name],
                ["Correo Electrónico:", email],
                [],
                ...finalData
            ];

            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(wb, ws, "Datos Energéticos");

            XLSX.writeFile(wb, "datos_energia.xlsx");
        })
        .catch(error => console.error("Error al procesar el CSV:", error));
}


const regionTranslations = {
    "es": {
        "Andalucía": "Andalucía",
        "Aragón": "Aragón",
        "Asturias": "Asturias",
        "Cantabria": "Cantabria",
        "Castilla La Mancha": "Castilla La Mancha",
        "Castilla y León": "Castilla y León",
        "Cataluña": "Cataluña",
        "Ceuta": "Ceuta",
        "Madrid": "Comunidad de Madrid",
        "Comunidad Valenciana": "Comunidad Valenciana",
        "Extremadura": "Extremadura",
        "Galicia": "Galicia",
        "Islas Baleares": "Islas Baleares",
        "Islas Canarias": "Islas Canarias",
        "La Rioja": "La Rioja",
        "Melilla": "Melilla",
        "Murcia": "Murcia",
        "Navarra": "Navarra",
        "País Vasco": "País Vasco"
    },
    "en": {
        "Andalucía": "Andalusia",
        "Aragón": "Aragon",
        "Asturias": "Asturias",
        "Cantabria": "Cantabria",
        "Castilla La Mancha": "Castilla-La Mancha",
        "Castilla y León": "Castile and León",
        "Cataluña": "Catalonia",
        "Ceuta": "Ceuta",
        "Madrid": "Community of Madrid",
        "Comunidad Valenciana": "Valencian Community",
        "Extremadura": "Extremadura",
        "Galicia": "Galicia",
        "Islas Baleares": "Balearic Islands",
        "Islas Canarias": "Canary Islands",
        "La Rioja": "La Rioja",
        "Melilla": "Melilla",
        "Murcia": "Murcia",
        "Navarra": "Navarre",
        "País Vasco": "Basque Country"
    },
    "fr": {
        "Andalucía": "Andalousie",
        "Aragón": "Aragon",
        "Asturias": "Asturies",
        "Cantabria": "Cantabrie",
        "Castilla La Mancha": "Castille-La Manche",
        "Castilla y León": "Castille-et-León",
        "Cataluña": "Catalogne",
        "Ceuta": "Ceuta",
        "Madrid": "Communauté de Madrid",
        "Comunidad Valenciana": "Communauté Valencienne",
        "Extremadura": "Estrémadure",
        "Galicia": "Galice",
        "Islas Baleares": "Îles Baléares",
        "Islas Canarias": "Îles Canaries",
        "La Rioja": "La Rioja",
        "Melilla": "Melilla",
        "Murcia": "Murcie",
        "Navarra": "Navarre",
        "País Vasco": "Pays Basque"
    }
};

const energyTranslations = {
    "es": {
        "Energía solar (GWh)": "Energía solar (GWh)",
        "Energía eólica (GWh)": "Energía eólica (GWh)",
        "Energía hidráulica (GWh)": "Energía hidráulica (GWh)",
        "Energía nuclear (GWh)": "Energía nuclear (GWh)",
        "Energía de otras fuentes (GWh)": "Energía de otras fuentes (GWh)"
    },
    "en": {
        "Energía solar (GWh)": "Solar Energy (GWh)",
        "Energía eólica (GWh)": "Wind Energy (GWh)",
        "Energía hidráulica (GWh)": "Hydroelectric Energy (GWh)",
        "Energía nuclear (GWh)": "Nuclear Energy (GWh)",
        "Energía de otras fuentes (GWh)": "Other Sources Energy (GWh)"
    },
    "fr": {
    "Energía solar (GWh)": "Énergie solaire (GWh)",
    "Energía eólica (GWh)": "Énergie éolienne (GWh)",
    "Energía hidráulica (GWh)": "Énergie hydroélectrique (GWh)",
    "Energía nuclear (GWh)": "Énergie nucléaire (GWh)",
    "Energía de otras fuentes (GWh)": "Énergie d'autres sources (GWh)"
    }

};
