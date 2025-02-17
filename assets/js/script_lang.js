document.addEventListener("DOMContentLoaded", () => {
    const selector = document.getElementById("language-selector");

    function getLangPath() {
        return window.location.pathname.includes("/pages/") ? "../assets/lang/" : "./assets/lang/";
    }

    function changeLanguage(lang) {
        const langPath = getLangPath();

        fetch(`${langPath}${lang}.json`)
            .then(response => response.json())
            .then(data => {
                document.querySelectorAll("[data-key]").forEach(element => {
                    const key = element.getAttribute("data-key");
                    if (data[key]) {
                        if (element.tagName === "OPTION") {
                            element.textContent = data[key];
                        } else if (element.tagName === "IMG") {
                            element.setAttribute("alt", data[key]);
                        } else {
                            element.innerHTML = data[key];
                        }
                    }
                });

                localStorage.setItem("selectedLanguage", lang);
            })
            .catch(error => console.error("Error cargando el idioma:", error));
    }

    const savedLang = localStorage.getItem("selectedLanguage") || "es";

    if (selector) {
        selector.value = savedLang;
        selector.addEventListener("change", (event) => {
            const selectedLang = event.target.value;
            if (selectedLang !== localStorage.getItem("selectedLanguage")) {
                changeLanguage(selectedLang);
                selector.value = selectedLang;
            }
        });
    }

    setTimeout(() => {
        if (selector.value !== savedLang) {
            selector.value = savedLang; 
        }
    }, 100);

    changeLanguage(savedLang);
});
