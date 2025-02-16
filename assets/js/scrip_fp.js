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
