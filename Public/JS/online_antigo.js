let socket = io.connect("http://localhost:5000");

const mensagensField = document.querySelector(".msgs");
const textbox = document.querySelector(".chat-txtbox");
const enviarBtn = document.querySelector(".chat-btn ");

let player = "white";
let turn;
let jogadas = 3;
let tempo_w_p = document.querySelector(".tempo-white");
let tempo_b_p = document.querySelector(".tempo-black");
let tempo = 120;
let tempo_w = tempo;
let tempo_b = tempo;
const board = document.querySelector(".tabuleiro");
let casas = [];
let casas_ativas = [];
let lances = -1;
const passarBtn = document.querySelector(".botao-passar");
const desistirBtn = document.querySelector(".botao-desistir");
const p_turn = document.querySelector(".p-turn");
tempo_w_p.textContent = Math.floor(tempo / 60) + ":" + Math.floor(tempo % 60) + "0";
tempo_b_p.textContent = Math.floor(tempo / 60) + ":" + Math.floor(tempo % 60) + "0";


createGrid();
gridEventListener();
enviarBtn.addEventListener("click", enviarMsg);
desistirBtn.addEventListener("click", desistir);

// Manda mensagem no chat via websocket.io
function enviarMsg(){

    socket.emit("chat", textbox.value);

}

function desistir(){

    socket.emit("desistir", player);

}

// Relógio 

function createGrid(){

    let count = 0;

    for (let i = 0; i < 4; i++){

        const col = document.createElement("div");
        col.classList.add("coluna");
        board.appendChild(col);

        for (let j = 0; j < 4; j++){
            const casa = document.createElement("div");
            casa.dataset.id = count;
            casa.classList.add("casa");

            if (count == 0){
                casa.classList.add("casa1");
            }
            else if(count == 3){
                casa.classList.add("casa2");
            }
            else if(count == 12){
                casa.classList.add("casa3");
            }
            else if(count == 15){
                casa.classList.add("casa4");
            }

            col.appendChild(casa);

            casas.push(casa);

            count++;
        }
    }

}

function verifTurn(){

    if (turn == "white"){
        p_turn.textContent = "Vez das brancas";
    }
    else{
        p_turn.textContent = "Vez das pretas";
    }    

}

function endgame(){

    if (player == "white"){
        alert("Brancas ganham!");
    }
    else{
        alert("Pretas ganham!");
    }

    restart();

}

function restart(){

    window.location.reload();

}

function gridEventListener(){

    for (const casa_ataque of casas){
        casa_ataque.addEventListener("click", () => {
            if (!casas_ativas.includes(Number(casa_ataque.dataset.id))){
                if (jogadas == 3 || isConnected(Number(casa_ataque.dataset.id))){
                    sendMove(Number(casa_ataque.dataset.id));
                }
            }
        });
    }

}

function sendMove(num){

    socket.emit("addPiece", num);

}

// Listeners do server
socket.on("chat", (data) => {
    mensagensField.innerHTML += "<p>" + "[" + player + "] " + data + "</p>";
});

socket.on("addPiece", (data) => {

    const peca = document.createElement("div");

    if (player == "white")
        peca.classList.add("peca-branca");
    else
        peca.classList.add("peca-preta");

    casas[data].appendChild(peca);

    casas_ativas.push(data);

});

socket.on("changeTurn", (data) => {

});

socket.on("passarJogada", (data) => {

});

socket.on("passarVez", (data) => {

});

socket.on("desistir", (data) => {

    if (data == "white"){
        alert("Brancas desistem. Pretas ganham!");
    }
    else {
        alert("Pretas desistem. Brancas ganham!");
    }

    restart();

});


function isConnected(casa_num){

    // Verifica se o lance é legal
    if ((casa_num != Number(casas_ativas[lances]) - 1) && (casa_num != Number(casas_ativas[lances]) + 1) &&
    (casa_num != Number(casas_ativas[lances]) - 4) && (casa_num != Number(casas_ativas[lances]) + 4)){
        if ((jogadas != 1) && ((casa_num != Number(casas_ativas[lances - 1]) - 1) && (casa_num != Number(casas_ativas[lances - 1]) + 1) &&
        (casa_num != Number(casas_ativas[lances - 1]) - 4) && (casa_num != Number(casas_ativas[lances - 1]) + 4))){
            return false;
        }
    }

    if ((Number(casas_ativas[lances]) % 4 == 0) && (casa_num == Number(casas_ativas[lances]) - 1)){
        return false;
    }

    if (((Number(casas_ativas[lances]) == 3) || (Number(casas_ativas[lances]) == 7) || 
    (Number(casas_ativas[lances]) == 11)) && (casa_num == Number(casas_ativas[lances]) + 1)){
        return false;
    }    

    // Permite apenas lances horizontais caso os primeiros 2 lances tenham sido horizontais
    if ((jogadas == 1) && ((Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) - 1) || 
    (Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) + 1))){
        if ((casa_num != Number(casas_ativas[lances]) - 1) && (casa_num != Number(casas_ativas[lances]) + 1)){
            if ((casa_num != Number(casas_ativas[lances - 1]) - 1) && (casa_num != Number(casas_ativas[lances - 1]) + 1)){
                return false;
            }

        }
    }

    // Permite apenas lances verticais caso os primeiros 2 lances tenham sido verticais
    if ((jogadas == 1) && ((Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) - 4) || 
    (Number(casas_ativas[lances - 1]) == Number(casas_ativas[lances]) + 4))){
        if ((casa_num != Number(casas_ativas[lances]) - 4) && (casa_num != Number(casas_ativas[lances]) + 4)){
            if ((casa_num != Number(casas_ativas[lances - 1]) - 4) && (casa_num != Number(casas_ativas[lances - 1]) + 4)){
                return false;
            }

        }
    }
    
    jogadas--;

    return true;

}