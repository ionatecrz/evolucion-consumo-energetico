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
