const { ipcRenderer, app } = require("electron");

addEventListener("DOMContentLoaded", () => {
    const markers = document.getElementById("themarkers");
    const lef = document.getElementById("integrated-lef");
    const button = document.getElementById("lef-button");

    let lefVisible = false;
    const toggleLEF = () => {
        if (lefVisible = !lefVisible) {
            markers.style.height = "calc(100vh - 200px)";
            lef.style.height = "200px";
            button.className = "active";
        } else {
            markers.style.height = "100vh";
            lef.style.height = "0";
            button.className = "";
        }
    };

    const applyLEF = (skill, level, text, hint) => {
        const header = document.getElementById("item-name");
        const description = document.getElementById("item-description");
    
        header.innerHTML = `${skill}<em>niveau ${level}</em>`;
        let output = text
            .replaceAll('\n\nof\n\n', " <strong>OF</strong> ")
            .replaceAll(/^niveau (1|2|3)\s+\+/g, "<strong>Niveau $1, én:</strong> ");

        if (hint) {
            const hinttext = hint.replaceAll("# Opmerkingen", "");
            output += `<h3>${hinttext}</h3>`;
        }
        description.innerHTML = output;
    };

    const fetchLEF = () => {
        if (!LEFbuttons.professionalTasks.className) { // skills
            const skill = document.querySelector(".skills button.active").innerHTML;
            const level = parseInt(document.querySelector(".levels button.active").innerHTML);

            fetch(`https://lef.open-ict.hu.nl/api/v1/vaardigheden/${encodeURIComponent(skill)}`).then((res) => {
                res.json().then((json) => {
                    applyLEF(skill, level, json[level].title, json[level].info);
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        } else if (!LEFbuttons.skills.className) { // professional tasks
            const architectureLayer = document.querySelector(".architecture-layers button.active").innerHTML;
            const activity = document.querySelector(".activities button.active").innerHTML.replace("&amp;", "&");
            const level = parseInt(document.querySelector(".levels button.active").innerHTML);

            fetch(`https://lef.open-ict.hu.nl/api/v1/hboi?architectuurlaag=${encodeURIComponent(architectureLayer)}&activiteit=${encodeURIComponent(activity)}&niveau=${level}`).then((res) => {
                res.json().then((json) => {
                    const task = `${architectureLayer} ${activity}`;
                    applyLEF(task, level, json[task][level].title, json[task][level].info);
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const LEFbuttons = {
        skills: document.getElementById("button-skills"),
        professionalTasks: document.getElementById("button-professional-tasks"),
        skillList: document.querySelectorAll(".skills"),
        professionalTaskList: document.querySelectorAll(".professional-tasks")
    };

    ipcRenderer.on("toggle-lef", toggleLEF);
    button.addEventListener("click", toggleLEF);

    LEFbuttons.skills.addEventListener("click", () => {
        LEFbuttons.skills.className = "active";
        LEFbuttons.professionalTasks.className = "";
        for (const col of LEFbuttons.skillList) col.style.display = "flex";
        for (const col of LEFbuttons.professionalTaskList) col.style.display = "none";
        fetchLEF();
    });
    LEFbuttons.professionalTasks.addEventListener("click", () => {
        LEFbuttons.skills.className = "";
        LEFbuttons.professionalTasks.className = "active";
        for (const col of LEFbuttons.skillList) col.style.display = "none";
        for (const col of LEFbuttons.professionalTaskList) col.style.display = "flex";
        fetchLEF();
    });

    for (const cl of ["skills", "architecture-layers", "activities", "levels"]) {
        for (const btn of document.querySelectorAll(`.${cl} button`)) {
            btn.addEventListener("click", () => {
                for (const i of document.querySelectorAll(`.${cl} button`)) i.className = "";
                btn.className = "active";
                fetchLEF();
            });
        }
    }

    fetchLEF();

    // inject css to add dark mode, hopefully!
    /** @type {import("electron").WebviewTag} */
    const webview = document.getElementById("themarkers-webview");
    webview.addEventListener("did-finish-load", () => {
        // webview.insertCSS("body { background: #333 !important; }");
    });
});
