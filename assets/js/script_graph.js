document.addEventListener("DOMContentLoaded", function () {
    const lang = localStorage.getItem("selectedLanguage") || "es"; 

    fetch(`../assets/data/energy_sources.csv`)
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data, lang);
            renderChart(parsedData);
        })
        .catch(error => console.error("Error cargando el CSV:", error));
});


const energyTranslations = {
    "es": {
        "Eólica": "Eólica",
        "Solar": "Solar",
        "Nuclear": "Nuclear",
        "Hidroeléctrica": "Hidroeléctrica",
        "Gas Natural": "Gas Natural"
    },
    "en": {
        "Eólica": "Wind",
        "Solar": "Solar",
        "Nuclear": "Nuclear",
        "Hidroeléctrica": "Hydroelectric",
        "Gas Natural": "Natural Gas"
    },
    "fr": {
        "Eólica": "Éolien",
        "Solar": "Solaire",
        "Nuclear": "Nucléaire",
        "Hidroeléctrica": "Hydroélectrique",
        "Gas Natural": "Gaz Naturel"
    }
};

function parseCSV(data, lang) {
    const lines = data.split("\n").map(line => line.trim()).filter(line => line);
    const labels = lines[0].split(",").slice(1);
    const datasets = [];
    
    for (let i = 1; i < lines.length; i++) {
        const [source, ...values] = lines[i].split(",");
        const translatedSource = energyTranslations[lang][source] || source; 
        datasets.push({
            label: translatedSource,
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

document.getElementById("language-selector").addEventListener("change", function (event) {
    localStorage.setItem("selectedLanguage", event.target.value);
    location.reload(); 
});
