let socket = io();

let startSound = new Audio("../imgs/startSound.mkv");
startSound.crossOrigin = "anonymous";
let endSound = new Audio("../imgs/lichessCheckmate.mkv");
endSound.crossOrigin = "anonymous";

let connections = 0;
let movesBack = 0;
let casasAtivas = [];
let gameRoom = null;
const mensagensField = document.querySelector(".msgs");
const textbox = document.querySelector(".chat-txtbox");
const enviarBtn = document.querySelector(".chat-btn ");
const conexaoBrancas = document.querySelector(".conexao-brancas");
const conexaoPretas = document.querySelector(".conexao-pretas");
enviarBtn.addEventListener("click", enviarMsg);
const desistirBtn = document.querySelector(".botao-desistir");
desistirBtn.addEventListener("click", desistir);
const passarBtn = document.querySelector(".botao-passar");
passarBtn.addEventListener("click", passarVez);
const revancheBtn = document.querySelector(".botao-restart");
revancheBtn.addEventListener("click", pedirRevanche);
const revancheAceitarBtn = document.querySelector(".botao-aceitar-revanche");
revancheAceitarBtn.addEventListener("click", aceitarRevanche);
const revancheRecusarBtn = document.querySelector(".botao-recusar-revanche");
revancheRecusarBtn.addEventListener("click", recusarRevanche);
let loadingImgContainer = null;
const backBtn = document.querySelector(".move-back");
backBtn.addEventListener("click", moveBack);
const forwardBtn = document.querySelector(".move-forward");
forwardBtn.addEventListener("click", moveForward);
const revancheIcon = document.querySelector(".revanche-icon");
const revancheDiv = document.querySelector(".revanche-div");
const endgame_p = document.querySelector(".endgame-p");
const tempo_w_p = document.querySelector(".tempo-white");
const tempo_b_p = document.querySelector(".tempo-black");
//const specsDiv = document.querySelector(".specs-div");
//const specsIcon = document.querySelector(".specs-icon");
const nomeBrancas = document.querySelector(".anon-brancas");
const nomePretas = document.querySelector(".anon-pretas");
const telaCarregamento = document.querySelector(".tela-carregamento");
const procurandoOponentes = document.querySelector(".procurando-oponentes");
const jogadoresOnline = document.querySelector(".num-oponentes");
const main = document.querySelector("main");
let board = document.querySelector(".tabuleiro");
const tabuleiroDiv = document.querySelector(".tabuleiro-div");
let tabuleiro = [];

createGrid();
gridEventListener();
procurandoOponentesAnimacao();
socket.emit("createPlayer", socket.id);


function createGrid(){

    for (let i = 0; i < 4; i++){

        let col_list = [];
        const col = document.createElement("div");
        col.classList.add("coluna");
        board.appendChild(col);

        for (let j = 0; j < 4; j++){
            const casa = document.createElement("div");
            casa.classList.add("casa");

            if (i == 0 && j == 0){
                casa.classList.add("casa1");
            }
            else if(i == 0 && j == 3){
                casa.classList.add("casa2");
            }
            else if(i == 3 && j == 0){
                casa.classList.add("casa3");
            }
            else if(i == 3 && j == 3){
                casa.classList.add("casa4");
            }

            col_list.push(casa);

            col.appendChild(casa);

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
                if (!tabuleiro[y][x].hasChildNodes() && movesBack == 0){
                    socket.emit("addPecaBackend", { y: y, x: x, room: gameRoom });
                }
            });
        }
    }

}

/*
async function renderGrid(){



}
*/

function addPeca(y, x, vezBrancas, room){
    if (gameRoom == room){
        // Registro do lance - Visual
        const peca = document.createElement("div");
                        
        if (vezBrancas == true)
            peca.classList.add("peca-branca");
        else
            peca.classList.add("peca-preta");

        if (movesBack > 0){
            peca.classList.add("hidden");
            movesBack++;
        }

        tabuleiro[y][x].appendChild(peca);
    }

}

async function procurandoOponentesAnimacao(){

    let i = 0;

    const interval = setInterval(() =>{

        procurandoOponentes.textContent += ".";

        i++;

        if (i == 4){
            i = 0;
            procurandoOponentes.textContent = "Procurando oponente";
        }

        if (telaCarregamento.className.includes("hidden")){
            clearInterval(interval);
        }

    }, 1000);

}

function jogadoresOnlineCounter(con){

    jogadoresOnline.textContent = `${con - 1} jogadores online`;

}

function desistir(){

    socket.emit("desistir", gameRoom);

}

function passarVez(){

    socket.emit("passarVez", gameRoom);

}

function pedirRevanche(){

    socket.emit("pedirRevanche", gameRoom);
    revancheBtn.removeChild(revancheIcon);
    
    const loadingImg = document.createElement("img");
    loadingImgContainer = document.createElement("div");
    loadingImg.src = "../imgs/loadingRevanche";
    loadingImg.classList = "w-8 h-8";
    loadingImgContainer.classList = "w-full flex justify-center";

    loadingImgContainer.appendChild(loadingImg)
    revancheBtn.appendChild(loadingImgContainer);

}

function solicitarRevanche(roomNumber){

    if (roomNumber == gameRoom){
        if (loadingImgContainer == null){
            revancheBtn.classList.add("hidden");
            revancheDiv.classList.remove("hidden");
        }
    }

}

function aceitarRevanche(){

    socket.emit("restart", gameRoom);

}

function recusarRevanche(){

    socket.emit("recusarRevanche", gameRoom);

    revancheDiv.classList.add("hidden");

}

function relogio(tempo_w, tempo_b, roomNumber){

    if (roomNumber == gameRoom){
        tempo_w_p.textContent = (tempo_w % 60 < 10 ? Math.floor(tempo_w / 60) + ":" + "0" + Math.floor(tempo_w % 60)
        : Math.floor(tempo_w / 60) + ":" + Math.floor(tempo_w % 60));

        tempo_b_p.textContent = (tempo_b % 60 < 10 ? Math.floor(tempo_b / 60) + ":" + "0" + Math.floor(tempo_b % 60)
        : Math.floor(tempo_b / 60) + ":" + Math.floor(tempo_b % 60));
    }

}

function moveBack(){

    if (movesBack < casasAtivas.length)
        movesBack++;

    const lastIndex = casasAtivas.length - movesBack;

    const x = casasAtivas[lastIndex][1];
    const y = casasAtivas[lastIndex][0];

    tabuleiro[y][x].firstChild.classList.add("hidden");

}

function moveForward(){

    const lastIndex = casasAtivas.length - movesBack;

    const x = casasAtivas[lastIndex][1];
    const y = casasAtivas[lastIndex][0];

    tabuleiro[y][x].firstChild.classList.remove("hidden");

    if (movesBack > 0)
        movesBack--;

}

/*
function specs(quant_specs){

    if (specsDiv.className.includes("hidden"))
        specsDiv.classList.remove("hidden");

    specsIcon.textContent = " " + quant_specs;

}
*/

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

    const { roomNumber, brancasPontos, pretasPontos, brancasGanham } = data;

    if (roomNumber == gameRoom){
        desistirBtn.classList.add("hidden");
        passarBtn.classList.add("hidden");
        revancheBtn.classList.remove("hidden");

        // Mostrar placar
        endgame_p.innerHTML = `<p class="endgame-p text-lg"> ${brancasPontos} - ${pretasPontos} <br>`;

        // Mostrar quem foi vitorioso
        endgame_p.innerHTML += `Vitória das ${(brancasGanham == true ? 'brancas' : 'pretas')}! </p>`;

        endSound.play();
    }

}

function mensagemJogo(msg, roomNumber){

    if (gameRoom == roomNumber){
        const mensagem_jogo = document.createElement("p");

        mensagem_jogo.textContent = msg;
        mensagem_jogo.className = "msg-jogo";

        mensagensField.appendChild(mensagem_jogo);
    }

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

        if (conexaoBrancas.className.includes("bg-red")){
            conexaoBrancas.classList.add("bg-green-100");
            conexaoBrancas.classList.remove("bg-red");   
        }
        if (conexaoPretas.className.includes("bg-red")){
            conexaoPretas.classList.add("bg-green-100");
            conexaoPretas.classList.remove("bg-red");   
        }

        desistirBtn.classList.remove("hidden");
        passarBtn.classList.remove("hidden");

        if (!revancheDiv.className.includes("hidden")){
            revancheDiv.classList.add("hidden");
        }
        if (loadingImgContainer != null){
            revancheBtn.removeChild(loadingImgContainer);
            revancheBtn.appendChild(revancheIcon);
        }
        
        revancheBtn.classList = "botao-jogo botao-restart hidden";

        endgame_p.textContent = " ";

        loadingImgContainer = null;
    }

}

function desconexao(data){

    const { cor, roomNumber } = data;

    mensagemJogo(`${cor} saíram do jogo. Encerrando partida...`, roomNumber);

    if (cor == "Brancas"){
        conexaoBrancas.classList.remove("bg-green-100");
        conexaoBrancas.classList.add("bg-red");
    }
    else if (cor == "Pretas"){
        conexaoPretas.classList.remove("bg-green-100");
        conexaoPretas.classList.add("bg-red");
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

    const { text, roomNumber } = data;

    if (roomNumber == gameRoom){
        if (chatPlayer != null){

            const mensagem = document.createElement("div");
            mensagem.classList.add("msg");

            const peca = document.createElement("div");
            peca.className = (chatPlayer == "brancas" ? "peca-branca-chat" : "peca-preta-chat");

            const mensagem_p = document.createElement("p");
            mensagem_p.classList.add("msg-p");

            mensagem_p.textContent = text;

            mensagem.appendChild(peca);
            mensagem.appendChild(mensagem_p);
            mensagensField.appendChild(mensagem);
            
        }
    }

    mensagensField.scrollTop = mensagensField.scrollHeight - mensagensField.clientHeight;

}

function clearTextbox(){

    textbox.value = "";

}


/* Listeners do server */
socket.on("chat", (data) => {
    const { text, gameRoom } = data.data;

    regMsg({ text, roomNumber: gameRoom }, data.chatPlayer);
});

socket.on("addPecaBackend", (data) => {
    addPeca(data.y, data.x, data.vezBrancas, data.room);
});

socket.on("endGame", (data) => {
    endGame(data);
});

socket.on("confirmarRevanche", (data) => {
    solicitarRevanche(data);
});

socket.on("revancheRecusada", (data) => {
    mensagemJogo("Proposta de revanche recusada.", data);
});

socket.on("restart", (data) => {
    restart(data);
});

socket.on("desconexao", (data) => {
    desconexao(data);
});

socket.on("updateRelogio", (data) => {
    relogio(data.tempo_w, data.tempo_b, data.roomNumber);
});

/*
socket.on("updateSpecs", (data) => {
    specs(data);
});
*/

socket.on("regRoom", (data) => {
    if (gameRoom == null){
        gameRoom = data.roomNumber;
        startGame(gameRoom);

        if(socket.id == data.idBrancas){
            nomeBrancas.textContent = "Anônimo (você)";
        }
        else{
            nomePretas.textContent = "Anônimo (você)";
        }
    }
});

socket.on("serverFull", (data) => {
    alert("Os servidores estão cheios no momento, tente novamente mais tarde.");
    window.location = "index.html";
});

socket.on("updateCasasAtivas", (data) => {
    if (data.roomNumber == gameRoom){
        casasAtivas = data.casasAtivas;
    }
});

/* Tela de espera */
socket.on("updateConnections", (con) => {
    connections = con;
    jogadoresOnlineCounter(con);
});