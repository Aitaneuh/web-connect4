import Renderer from './renderer.js'
import GameController from './game_controller.js'

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const modeSel = document.getElementById('mode');
const sidenoteLbl = document.getElementById('sidenote');
const checkBox = document.getElementById('cbx');
const checkBoxLabel = document.getElementById('cbxLbl');
const sidenoteTgl = document.getElementById('sidenoteToggle');

const resTimeLbl = document.getElementById("resTimeLbl");
const resTimeVal = document.getElementById("resTimeVal");
const resCountLbl = document.getElementById("resCountLbl");
const resCountVal = document.getElementById("resCountVal");

const renderer = new Renderer(boardEl, statusEl);
const controller = new GameController(modeSel, resetBtn, renderer, checkBox);

modeSel.addEventListener("change", () => {
    refreshSideNote()
    handleCheckbox()
    handleResults()
});

sidenoteTgl.addEventListener("click", () => {
    toogleSidenote()
});

function toogleSidenote() {
    if (sidenoteTgl.innerHTML == "hide sidenote") {
        sidenoteLbl.style.display = "none"
        sidenoteTgl.innerHTML = "show sidenote"
    } else {
        sidenoteLbl.style.display = "block"
        sidenoteTgl.innerHTML = "hide sidenote"
    }
}

function handleResults() {
    if (typeof modeSel.value === "string" && modeSel.value.startsWith('heuristic')) {
        resTimeLbl.style.display = "block";
        resTimeVal.style.display = "block";
        resCountLbl.style.display = "block";
        resCountVal.style.display = "block";

        resTimeVal.textContent = "-";
        resCountVal.textContent = "-";
    } else {
        resTimeLbl.style.display = "none";
        resTimeVal.style.display = "none";
        resCountLbl.style.display = "none";
        resCountVal.style.display = "none";
    }
}

function handleCheckbox() {
    if (typeof modeSel.value === "string" && modeSel.value.startsWith('heuristic')) {
        checkBox.style.display = "block"
        checkBoxLabel.style.display = "block"
    } else {
        checkBox.style.display = "none"
        checkBoxLabel.style.display = "none"
    }
}

function refreshSideNote() {
    const mode = modeSel.value;

    switch (mode) {
        case "local":
            sidenoteLbl.innerHTML = `
                Two human players take turns playing on the same board. 
                A simple, classic 1v1 Connect Four match.
            `;
            break;

        case "random":
            sidenoteLbl.innerHTML = `
                This bot picks a random column every move. 
                No logic, no plan — just pure chaos. 
                Sometimes it wins, but mostly by accident.
            `;
            break;

        case "heuristic1":
            sidenoteLbl.innerHTML = `
                The AI looks only one move ahead. 
                It reacts instantly to winning or losing threats, but has no sense of planning.<br><br>
                Think of it like a beginner who just notices: “Oh, I can win right now!”
            `;
            break;

        case "heuristic2":
            sidenoteLbl.innerHTML = `
                Now the AI starts to anticipate one turn in advance. 
                It can block your immediate threats and set up basic traps, 
                but still can’t see far beyond the surface.<br><br>
                A cautious but still short-sighted opponent.
            `;
            break;

        case "heuristic3":
            sidenoteLbl.innerHTML = `
                This version thinks several turns ahead. 
                It can detect double traps, plan small combos, and punish short-term mistakes.<br><br>
                A solid opponent that feels much more “human”.
            `;
            break;

        case "heuristic4":
            sidenoteLbl.innerHTML = `
                Now it begins to feel dangerous. 
                With Alpha-Beta Pruning optimizing its calculations, 
                it sees deeper and plays much faster.<br><br>
                It can recognize setups that win or lose two turns in advance.
            `;
            break;

        case "heuristic5":
            sidenoteLbl.innerHTML = `
                A strategic thinker. 
                It explores thousands of future positions, 
                seeing traps and long-term plays invisible to most players.<br><br>
                You’ll have to stay sharp — every move matters.
            `;
            break;

        case "heuristic6":
            sidenoteLbl.innerHTML = `
                This version plays almost perfectly. 
                It can plan multiple turns ahead and balance attack and defense with surgical precision.<br><br>
                Thanks to Alpha-Beta Pruning, it’s deep *and* efficient.
            `;
            break;

        case "heuristic7":
            sidenoteLbl.innerHTML = `
                The ultimate challenge. 
                This bot sees nearly everything — deep search, efficient pruning, and refined evaluation.<br><br>
                If you manage to beat it, you’ve basically solved Connect Four.
            `;
            break;

        default:
            sidenoteLbl.innerHTML = "";
            break;
    }
}



refreshSideNote()
handleCheckbox()
handleResults()