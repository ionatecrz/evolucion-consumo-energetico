function calcularHuella() {
    var consumo = document.getElementById("energia").value;
    var factorEmision = 0.385; // kg de CO2 por kWh en España
    var huella = consumo * factorEmision;

    const lang = localStorage.getItem("selectedLanguage") || "es";  

    const translations = {
        "es": {
            "result": "Tu huella de carbono mensual es de <strong>{huella} kg de CO₂</strong>",
            "low": "¡Enhorabuena! Tu consumo energético es bajo. Sigue utilizando fuentes renovables.",
            "moderate": "Tu consumo es moderado. Puedes reducirlo optimizando el uso de electrodomésticos.",
            "high": "Tu consumo es alto. Considera mejorar la eficiencia energética en tu hogar y usar más energía renovable."
        },
        "en": {
            "result": "Your monthly carbon footprint is <strong>{huella} kg of CO₂</strong>",
            "low": "Congratulations! Your energy consumption is low. Keep using renewable sources.",
            "moderate": "Your consumption is moderate. You can reduce it by optimizing appliance usage.",
            "high": "Your consumption is high. Consider improving your home's energy efficiency and using more renewable energy."
        },
        "fr": {
            "result": "Votre empreinte carbone mensuelle est de <strong>{huella} kg de CO₂</strong>",
            "low": "Félicitations ! Votre consommation d'énergie est faible. Continuez à utiliser des sources renouvelables.",
            "moderate": "Votre consommation est modérée. Vous pouvez la réduire en optimisant l'utilisation des appareils électriques.",
            "high": "Votre consommation est élevée. Envisagez d'améliorer l'efficacité énergétique de votre maison et d'utiliser plus d'énergie renouvelable."
        }
    };

    let resultText = translations[lang]["result"].replace("{huella}", huella.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    let message = "";
    if (huella < 100) {
        message = translations[lang]["low"];
    } else if (huella < 300) {
        message = translations[lang]["moderate"];
    } else {
        message = translations[lang]["high"];
    }

    document.getElementById("resultado").innerHTML = resultText;
    document.getElementById("recomendaciones").innerHTML = message;
}
