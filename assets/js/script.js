document.addEventListener("DOMContentLoaded", function() {
    loadSVG();
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
    fetch("../assets/data/chart.csv")
        .then(response => response.text())
        .then(csvData => {
            let demandData = parseCSV(csvData);
            updateSVG(demandData);
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

    document.querySelectorAll("#map svg path").forEach(region => {
        let regionName = region.getAttribute("aria-label");
        if (regionName) {
            let name = regionName.split(",")[0].replace(/^\d+\.\s*/, "").trim();
            let csvKeys = Object.keys(data).map(k => k.trim().toLowerCase());
            let matchIndex = csvKeys.indexOf(name.toLowerCase());

            if (matchIndex !== -1) {
                let demand = data[Object.keys(data)[matchIndex]];
                let originalStroke = region.getAttribute("stroke") || "none";
                let originalStrokeWidth = region.getAttribute("stroke-width") || "1";

                region.setAttribute("fill", getColor(demand));

                region.addEventListener("mouseover", function(event) {
                    tooltip.style.display = "block";
                    tooltip.innerHTML = `<strong>${name}</strong>: ${demand.toLocaleString()} GWh`;

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

function getColor(value) {
    if (value >= 40000) return "#FFDD00";
    if (value >= 30040) return "#FFE747";
    if (value >= 20060) return "#FFEF85";
    if (value >= 10080) return "#F9F1BD";
    return "#FDF9E0";
}

document.addEventListener("DOMContentLoaded", function () {
    fetch('../assets/data/chart.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n").map(line => line.trim()).filter(line => line !== "");
            const headers = lines[0].split(",");

            const regionSelect = document.getElementById("regionSelect");
            const energyTypeSelect = document.getElementById("energyType");

            lines.slice(1).forEach(line => {
                const values = line.split(",");
                const region = values[0];
                const option = document.createElement("option");
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });

            headers.slice(2).forEach(energy => {
                const option = document.createElement("option");
                option.value = energy;
                option.textContent = energy;
                energyTypeSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar el CSV:", error));
});

function downloadExcel() {
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

            let filteredData = lines.slice(1)
                .map(line => line.split(","))
                .filter(row => selectedRegions.includes(row[0]));

            let selectedColumns = [0]; 
            headers.forEach((header, index) => {
                if (selectedEnergies.includes(header)) {
                    selectedColumns.push(index);
                }
            });

            let finalData = filteredData.map(row => selectedColumns.map(index => row[index]));
            finalData.unshift(selectedColumns.map(index => headers[index]));

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

function calcularHuella() {
    var consumo = document.getElementById("energia").value;
    var factorEmision = 0.385; // kg de CO2 por kWh en España
    var huella = consumo * factorEmision;
    
    document.getElementById("resultado").innerHTML = "Tu huella de carbono mensual es de <strong>" + huella.toFixed(2) + " kg de CO₂</strong>";

    var mensaje = "";
    if (huella < 100) {
        mensaje = "¡Enhorabuena! Tu consumo energético es bajo. Sigue utilizando fuentes renovables.";
    } else if (huella < 300) {
        mensaje = "Tu consumo es moderado. Puedes reducirlo optimizando el uso de electrodomésticos.";
    } else {
        mensaje = "Tu consumo es alto. Considera mejorar la eficiencia energética en tu hogar y usar más energía renovable.";
    }

    document.getElementById("recomendaciones").innerHTML = mensaje;
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("../assets/data/energy_sources.csv")
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            renderChart(parsedData);
        })
        .catch(error => console.error("Error cargando el CSV:", error));
});

function parseCSV(data) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line);
    const labels = lines[0].split(",").slice(1);
    const datasets = [];
    
    for (let i = 1; i < lines.length; i++) {
        const [source, ...values] = lines[i].split(",");
        datasets.push({
            label: source,
            data: values.map(Number),
            backgroundColor: getColor(i - 1)
        });
    }
    
    return { labels, datasets };
}

function renderChart(parsedData) {
    var ctx = document.getElementById("graficoEnergia").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: parsedData,
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function getColor(index) {
    const colors = [
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 99, 132, 0.7)"
    ];
    return colors[index % colors.length];
}
