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
            sidenoteLbl.innerHTML = "Simple local 1 vs 1 Connect4. Players play one after each other."
            break;

        case "random":
            sidenoteLbl.innerHTML = "Each move the algorithm choose randomly between the 7 column possible and plays it."
            break;

        case "heuristic1":
            sidenoteLbl.innerHTML = "A heuristic algorithm simulates future moves up to a certain depth, evaluates each possible outcome, and chooses the move that seems most promising based on its analysis."
            sidenoteLbl.innerHTML += "\n\nThis one has a depth of 1, so if he sees a critical move he play it but nothing more."
            break;

        case "heuristic2":
            sidenoteLbl.innerHTML = "A heuristic algorithm simulates future moves up to a certain depth, evaluates each possible outcome, and chooses the move that seems most promising based on its analysis."
            sidenoteLbl.innerHTML += "\n\nThis one has a depth of 2, so he will see critical moves and play so that he don't place the circle you were missing to win."
            break;

        case "heuristic3":
            sidenoteLbl.innerHTML = "A heuristic algorithm simulates future moves up to a certain depth, evaluates each possible outcome, and chooses the move that seems most promising based on its analysis."
            sidenoteLbl.innerHTML += "\n\nThis one has a depth of 3, so like the other but it can set up trap for him to win 2 turn in advance but will still get caught if you set up a 2 turn in advance trap."
            break;

        case "heuristic4":
            sidenoteLbl.innerHTML = "A heuristic algorithm simulates future moves up to a certain depth, evaluates each possible outcome, and chooses the move that seems most promising based on its analysis."
            sidenoteLbl.innerHTML += "\n\nThis one has a depth of 4, so he plays like the ones before him but can set up trap and see traps 2 turn in advance. Most humans can't process further than 2 turns in advance."
            break;

        case "heuristic5":
            sidenoteLbl.innerHTML = "A heuristic algorithm simulates future moves up to a certain depth, evaluates each possible outcome, and chooses the move that seems most promising based on its analysis."
            sidenoteLbl.innerHTML += "\n\nDepth 5, the final boss. Can set up trap 3 turn in advance and see oppenents traps 2 turn in advance which makes him untrappable for a human."
            break;

        case "heuristic6":
            sidenoteLbl.innerHTML = "A heuristic algorithm simulates future moves up to a certain depth, evaluates each possible outcome, and chooses the move that seems most promising based on its analysis."
            sidenoteLbl.innerHTML += "\n\nDepth 6 + Alph Beta Pruning, the final boss but even further and even faster. Increase depth but faster because it skips path when he understand that they lead to nothing better than he already have."
            break;

        default:
            break;
    }
}

refreshSideNote()
handleCheckbox()
handleResults()