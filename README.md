# Página web estática

## Descripción del Proyecto

Este proyecto consiste en una página web estática que analiza la evolución del consumo energético en España. A través de diferentes secciones interactivas, se presentan datos sobre fuentes de energía, demanda energética y sostenibilidad, combinando gráficos, mapas y tablas dinámicas.

## Contenido del Repositorio

- **`assets/`**  
  - **`css/`**: Contiene la hoja de estilos `styles.css`.  
  - **`data/`**: 
    - `chart.csv`: Datos de evolución del consumo energético.
    - `energy_sources.csv`: Información sobre las fuentes de energía.
  - **`img/`**: Imágenes utilizadas en la web (`bal_sost.jpeg`, `chart.svg`, `energy_consumption.jpg`, `favicon.ico`).  
  - **`js/`**: Archivo `script.js` que maneja la interactividad de la página.  

- **`pages/`**  
  - `balance.html`: Análisis del balance energético y la sostenibilidad.  
  - `demand.html`: Sección sobre la demanda y el consumo energético.  
  - `technologies.html`: Evolución y uso de las fuentes de energía.  

- **`index.html`**: Página principal.  
- **`LICENSE`**: Información sobre la licencia del proyecto.  

## Características Principales

- **Pestaña de Fuentes de Energía**: Presenta la evolución de las principales fuentes de energía en España, destacando la transición hacia energías renovables.  

- **Pestaña de Consumo y Demanda Energética**: Ofrece datos históricos sobre la evolución del consumo de energía en diferentes regiones, con gráficos interactivos y mapas.  

- **Pestaña de Balance Energético y Sostenibilidad**: Proporciona información sobre la sostenibilidad del consumo energético, así como una calculadora de huella de carbono para estimar el impacto ambiental del usuario.  

- **Descarga de Datos**: Permite a los usuarios descargar conjuntos de datos energéticos en formato Excel para su análisis.  


## Instrucciones para su uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/ionatecrz/evolucion-consumo-energetico.git
   cd evolucion-consumo-energetico
   ```

2. **Abrir `index.html` en un navegador** para visualizar la página principal.  

## Herramientas utilizadas

- **HTML5** y **CSS3** para la estructura y el diseño de la web.  
- **JavaScript (JS)** para la interactividad y la manipulación de datos.  
- **Chart.js** para la visualización de datos en gráficos.  
- **Fetch API** para la carga de datos desde archivos CSV.  

## Autor

- **Nombre del autor**: Íñigo de Oñate Cruz
- **Contacto**: [LinkedIn](https://www.linkedin.com/in/%C3%AD%C3%B1igo-de-o%C3%B1ate-cruz-855b55263/)

## Licencia

Este proyecto está bajo la licencia [MIT License](LICENSE), permitiendo su uso, modificación y distribución.

