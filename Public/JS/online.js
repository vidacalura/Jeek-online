let socket = io();

let startSound = new Audio("../imgs/startSound.mkv");
startSound.crossOrigin = "anonymous";
let endSound = new Audio("../imgs/lichessCheckmate.mkv");
endSound.crossOrigin = "anonymous";

let connections = 0;
let gameRoom = null;
const mensagensField = document.querySelector(".msgs");
const textbox = document.querySelector(".chat-txtbox");
const enviarBtn = document.querySelector(".chat-btn ");
enviarBtn.addEventListener("click", enviarMsg);
const desistirBtn = document.querySelector(".botao-desistir");
desistirBtn.addEventListener("click", desistir);
const passarBtn = document.querySelector(".botao-passar");
passarBtn.addEventListener("click", passarVez);
const revancheBtn = document.querySelector(".botao-restart");
revancheBtn.addEventListener("click", pedirRevanche);
const endgame_p = document.querySelector(".endgame-p");
const tempo_w_p = document.querySelector(".tempo-white");
const tempo_b_p = document.querySelector(".tempo-black");
//const specsDiv = document.querySelector(".specs-div");
//const specsIcon = document.querySelector(".specs-icon");
const telaCarregamento = document.querySelector(".tela-carregamento");
const main = document.querySelector("main");
let board = document.querySelector(".tabuleiro");
const tabuleiroDiv = document.querySelector(".tabuleiro-div");
let tabuleiro = [];

createGrid();
gridEventListener();
socket.emit("createPlayer", socket.id);


function createGrid(){

    let count = 0;
    let col_list = [];

    for (let i = 0; i < 4; i++){

        let col_list = [];
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

            col_list.push(casa);

            col.appendChild(casa);

            count++;
        }

        tabuleiro.push(col_list);
    }

}

function gridEventListener(){

    for (i = 0; i < tabuleiro.length; i++){
        for (j = 0; j < tabuleiro[i].length; j++){
            const y = i;
            const x = j;

            tabuleiro[y][x].addEventListener("click", () => {
                if (!tabuleiro[y][x].hasChildNodes()){
                    socket.emit("addPecaBackend", { y: y, x: x, room: gameRoom });
                }
            });
        }
    }

}

function renderGrid(){



}

function addPeca(y, x, vezBrancas, room){
    if (gameRoom == room){
        // Registro do lance - Visual
        const peca = document.createElement("div");
                        
        if (vezBrancas == true)
            peca.classList.add("peca-branca");
        else
            peca.classList.add("peca-preta");


        tabuleiro[y][x].appendChild(peca);
    }

}

function desistir(){

    socket.emit("desistir", gameRoom);

}

function passarVez(){

    socket.emit("passarVez", gameRoom);

}

function pedirRevanche(){

    // aceitarRevanche()
        socket.emit("restart", gameRoom);

}

function relogio(tempo_w, tempo_b, roomNumber){

    if (roomNumber == gameRoom){
        tempo_w_p.textContent = (tempo_w % 60 < 10 ? Math.floor(tempo_w / 60) + ":" + "0" + Math.floor(tempo_w % 60)
        : Math.floor(tempo_w / 60) + ":" + Math.floor(tempo_w % 60));

        tempo_b_p.textContent = (tempo_b % 60 < 10 ? Math.floor(tempo_b / 60) + ":" + "0" + Math.floor(tempo_b % 60)
        : Math.floor(tempo_b / 60) + ":" + Math.floor(tempo_b % 60));
    }

}

function specs(quant_specs){

    if (specsDiv.className.includes("hidden"))
        specsDiv.classList.remove("hidden");

    specsIcon.textContent = " " + quant_specs;

}

function startGame(roomNumber){

    if (roomNumber == gameRoom){
        if (!telaCarregamento.className.includes("hidden") || main.className.includes("hidden")){
            telaCarregamento.classList.add("hidden");
            main.classList.remove("hidden");
        }

        startSound.play();
    }

}

function endGame(data){

    if (data.roomNumber == gameRoom){
        desistirBtn.classList.add("hidden");
        passarBtn.classList.add("hidden");
        revancheBtn.classList.remove("hidden");

        // Mostrar placar
        endgame_p.textContent = data.brancasPontos + " - " + data.pretasPontos + "   ";

        // Mostrar quem foi vitorioso
        endgame_p.textContent += "Vitória das " + (data.brancasGanham == true ? "brancas" : "pretas") + "!";

        endSound.play();
    }

}

function mensagemJogo(msg){

    const mensagem_jogo = document.createElement("p");

    mensagem_jogo.textContent = msg;
    mensagem_jogo.className = "msg-jogo";

    mensagensField.appendChild(mensagem_jogo);

}

function restart(roomNumber){

    if (roomNumber == gameRoom){
        tabuleiro = [];
        board.remove();
        board = document.createElement("section");
        board.classList = "tabuleiro mt-12";
        tabuleiroDiv.appendChild(board);

        createGrid();
        gridEventListener();

        desistirBtn.classList.remove("hidden");
        passarBtn.classList.remove("hidden");
        revancheBtn.classList.add("hidden");

        endgame_p.textContent = " ";
    }

}

/* Chat */
textbox.addEventListener("keyup", (event) => {
    event.preventDefault();

    if (event.key == "Enter"){
        enviarMsg();
    }
});

function enviarMsg(){

    if (textbox.value[0] != " " && textbox.value != ""){
        const text = textbox.value;

        socket.emit("chat", { text, gameRoom });
        clearTextbox();
    }

}

function regMsg(data, chatPlayer){

    if (data.gameRoom == gameRoom){
        if (chatPlayer != null){

            const mensagem = document.createElement("div");
            mensagem.classList.add("msg");

            const peca = document.createElement("div");
            peca.className = (chatPlayer == "brancas" ? "peca-branca-chat" : "peca-preta-chat");

            const mensagem_p = document.createElement("p");
            mensagem_p.classList.add("msg-p");

            mensagem_p.textContent = data.text;

            mensagem.appendChild(peca);
            mensagem.appendChild(mensagem_p);
            mensagensField.appendChild(mensagem);
            
        }
    }

}

function clearTextbox(){

    textbox.value = "";

}


/* Listeners do server */
socket.on("chat", (data) => {
    regMsg(data.data, data.chatPlayer);
});

socket.on("addPecaBackend", (data) => {
    addPeca(data.y, data.x, data.vezBrancas, data.room);
});

socket.on("endGame", (data) => {
    endGame(data);
});

socket.on("restart", (data) => {
    restart(data);
});

socket.on("desconexao", (data) => {
    if (data.roomNumber == gameRoom){
        mensagemJogo(data.cor + " saíram do jogo. Encerrando partida...");
    }
});

socket.on("updateRelogio", (data) => {
    relogio(data.tempo_w, data.tempo_b, data.roomNumber);
});

socket.on("updateSpecs", (data) => {
    specs(data);
});

socket.on("regRoom", (data) => {
    if (gameRoom == null){
        gameRoom = data;
        startGame(gameRoom);
    }
});

socket.on("serverFull", (data) => {
    alert("Os servidores estão cheios no momento, tente novamente mais tarde.");
    window.location = "index.html";
});

/* Tela de espera */
socket.on("updateConnections", (con) => {
    connections++;
});