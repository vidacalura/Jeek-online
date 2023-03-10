let socket = io();

let startSound = new Audio("../imgs/startSound.mkv");
startSound.crossOrigin = "anonymous";
let endSound = new Audio("../imgs/lichessCheckmate.mkv");
endSound.crossOrigin = "anonymous";

let connections = 0;
let movesBack = 0;
let casasAtivas = [];
let gameRoom = null;
const roomID = (window.location.search != '' ? window.location.search : null);
const chatBtn = document.getElementById("chat-hamburger");
const containerLeft = document.querySelector(".left-div-container");
const mensagensField = document.querySelector(".msgs");
const textbox = document.getElementById("chat-txtbox");
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
const specsDiv = document.querySelector(".specs-div");
const specsIcon = document.querySelector(".specs-icon");
const nomeBrancas = document.querySelector(".anon-brancas");
const nomePretas = document.querySelector(".anon-pretas");
const telaConvite = document.querySelector(".tela-convite");
const btnCodigoSala = document.getElementById("copiar-codigo-sala");
const txtBoxConvite = document.getElementById("convite-codigo-txtbox");
const telaCarregamento = document.querySelector(".tela-carregamento");
const procurandoOponentes = document.querySelector(".procurando-oponentes");
const pingBrancasIcon = document.querySelector(".ping-brancas");
const pingPretasIcon = document.querySelector(".ping-pretas");
const divAnimacaoPecasLoading = document.querySelector(".animacao-pecas-loading");
const jogadoresOnline = document.querySelector(".num-oponentes");
const main = document.querySelector("main");
let board = document.querySelector(".tabuleiro");
const tabuleiroDiv = document.querySelector(".tabuleiro-div");
let tabuleiro = [];

createGrid();
criarSalaPrivada();
procurarPartida();
socket.on("connect", async () => {
    await fetch("/procurarPartida/" + socket.id)
    .then((res) => { return res.json(); })
    .then((res) => {  })
    .catch(error => console.log(error));
});

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

function renderGridRequest(roomNumber){

    if (roomNumber == gameRoom){
        socket.emit("updateGridRequest", { roomNumber, id: socket.id } );
    }

}

function renderGrid(data){

    const { roomNumber, id } = data;

    if (socket.id == id){

        casasAtivas = data.casasAtivas;

        const { casasAtivasBrancas, casasAtivasPretas } = data;

        for (const casa of Object.values(casasAtivasBrancas)){
            if (casa.y != null){
                addPeca(casa.y, casa.x, true, roomNumber);
            }
        }
        for (const casa of Object.values(casasAtivasPretas)){
            if (casa.y != null){
                addPeca(casa.y, casa.x, false, roomNumber);
            }
        }

    }

}

async function procurarPartida(){

    if (roomID == null){
        // Tela de carregamento
        if (telaCarregamento.className.includes("hidden")){
            telaCarregamento.classList.remove("hidden");
        }

        procurandoOponentesPecasAnimacao();
        procurandoOponentesTextoAnimacao();

    }

}

function criarSalaPrivada(){

    if (roomID != null && roomID.length == 16){

        if (!telaCarregamento.className.includes("hidden")){
            telaCarregamento.classList.add("hidden");
        }

        telaConvite.classList.remove("hidden");

        const Id = roomID.slice(8);

        socket.emit("privateGameCreated", Id);

        txtBoxConvite.value = Id;

        socket.emit()

        btnCodigoSala.addEventListener("click", () => {
            txtBoxConvite.select();
            txtBoxConvite.setSelectionRange(0, 99999);

            navigator.clipboard.writeText(txtBoxConvite.value);
        });
    }
    else if (roomID != null){
        const cod = roomID.slice(8, 16);
        socket.emit("startPrivateGame", cod);
    }

}

function addPeca(y, x, vezBrancas, skin, room){
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

        if (skin && false){
            const skinPeca = document.createElement("i");
            skinPeca.className = skin;

            peca.appendChild(skinPeca);
        }

        tabuleiro[y][x].appendChild(peca);
    }

}

async function procurandoOponentesTextoAnimacao(){

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

async function procurandoOponentesPecasAnimacao(){

    let i = 0;
    let pecaBrancaCounter = 0;
    let pecaPretaCounter = 0;

    const interval = setInterval(() => {

        let randN = Math.floor(Math.random() * 2);

        if (pecaBrancaCounter == 3){
            pecaBrancaCounter = 0;
            randN = 1;
        }
        else if (pecaPretaCounter == 3){
            pecaPretaCounter = 0;
            randN = 0;
        }

        if (randN == 1){
            pecaPretaCounter++;
            pecaBrancaCounter = 0;
        }
        else if (randN == 0){
            pecaBrancaCounter++;
            pecaPretaCounter = 0;
        }

        const peca = document.createElement("div");
        peca.className = (randN == 1 ? "peca-preta-loading" : "peca-branca-loading");
        divAnimacaoPecasLoading.appendChild(peca);

        i++;

        if (i >= 4){
            divAnimacaoPecasLoading.removeChild(divAnimacaoPecasLoading.firstChild);
        }

        if (telaCarregamento.className.includes("hidden")){
            clearInterval(interval);
        }

    }, 800);

}

function ping(){

    const interval = setInterval(() => {

        let pingDate = new Date();

        socket.emit("ping", { pingDate, gameRoom });

    }, 2000);

}

function latencia(data){

    const roomNumber = data.gameRoom;

    if (gameRoom == roomNumber){

        const { resTime, cor } = data;
        let icon;

        if (resTime < 100){
            icon = "./imgs/ping_bom.png";
        }
        else if (resTime <= 200){
            icon = "./imgs/ping_medio.png";
        }
        else {
            icon = "./imgs/ping_ruim.png";
        }
        // else { socket.disconnect(); }

        switch (cor){
            case "Brancas":
                pingBrancasIcon.src = icon;
                break;
            case "Pretas":
                pingPretasIcon.src = icon;
                break;
        }

    }

}

function jogadoresOnlineCounter(con){

    jogadoresOnline.textContent = `${con - 1} jogador(es) online`;

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

    socket.emit("aceitarRevanche", gameRoom);

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

    tabuleiro[y][x].firstChild.style.display = "none";

}

function moveForward(){

    const lastIndex = casasAtivas.length - movesBack;

    const x = casasAtivas[lastIndex][1];
    const y = casasAtivas[lastIndex][0];

    tabuleiro[y][x].firstChild.style.display = "flex";

    if (movesBack > 0)
        movesBack--;

}

function specs(data){

    const { specs, id, roomNumber } = data;

    if (id == socket.id){
        gameRoom = roomNumber;
        renderGridRequest(roomNumber);
    }

    if (gameRoom == roomNumber){
        if (specsDiv.className.includes("hidden"))
            specsDiv.classList.remove("hidden");

        specsIcon.textContent = " " + specs;
    }

}

function startGame(roomNumber){

    if (roomNumber == gameRoom){
        if (!telaCarregamento.className.includes("hidden") || main.className.includes("hidden")){
            telaCarregamento.classList.add("hidden");
            main.classList.remove("hidden");
        }
        if (!telaConvite.className.includes("hidden")){
            telaConvite.classList.add("hidden");
        }

        gridEventListener();

        ping();

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
        endgame_p.innerHTML = `<p class="endgame-p text-2xl"> ${brancasPontos} - ${pretasPontos} </p>`;

        // Mostrar quem foi vitorioso
        endgame_p.innerHTML += `<p> Vitória das ${(brancasGanham == true ? 'brancas' : 'pretas')}! </p>`;

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

        movesBack = 0;

        createGrid();
        gridEventListener();

        if (!telaCarregamento.className.includes("hidden")){
            telaConvite.classList.add("hidden");
        }
    
        if (!telaCarregamento.className.includes("hidden")){
            telaCarregamento.classList.add("hidden");
        }


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

        while (mensagensField.hasChildNodes()){
            mensagensField.removeChild(mensagensField.firstChild);
        }

        loadingImgContainer = null;
    }

}

async function trocarLados(data){

    let { roomNumber, nickBrancas, nickPretas } = data;

    nickBrancas = (!nickBrancas ? "Anônimo" :
    nickBrancas
    + await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + nickBrancas)
    .then((res) => { return res.json() })
    .then((res) => { return (res.elo != null ? ` (${res.elo})` : "") })
    );

    nickPretas = (!nickPretas ? "Anônimo" :
    nickPretas
    + await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + nickPretas)
    .then((res) => { return res.json() })
    .then((res) => { return (res.elo != null ? ` (${res.elo})` : "") })
    );

    if (gameRoom == roomNumber){
        if (nomeBrancas.textContent == "Anônimo (você)"){
            nomeBrancas.textContent = nickBrancas;
            nomePretas.textContent = nickPretas + " (você)";
        }
        else if (nomePretas.textContent == "Anônimo (você)"){
            nomeBrancas.textContent = nickBrancas + " (você)";
            nomePretas.textContent = nickPretas;
        }
        else {
            nomeBrancas.textContent = nickBrancas;
            nomePretas.textContent = nickPretas;
        }
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
chatBtn.addEventListener("click", () => {
    if (containerLeft.className.includes("hidden")){
        containerLeft.classList.remove("hidden");
        containerLeft.classList.add("absolute");
        containerLeft.classList.add("top-20");
        containerLeft.classList.add("left-0");
        containerLeft.classList.add("z-100");

        chatBtn.className = "fa-solid fa-xmark";
    }
    else{
        containerLeft.className = "left-div-container hidden w-screen h-screen bg-jeek-gray-600 \
        opacity-[0.98] md:w-auto md:h-auto md:bg-none md:opacity-100 md:block md:absolute top-20 md:left-12";

        chatBtn.className = "fa-solid fa-comments";
    }
});

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
    addPeca(data.y, data.x, data.vezBrancas, data.skin, data.room);
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

socket.on("trocarLados", (data) => {
    trocarLados(data);
});

socket.on("desconexao", (data) => {
    desconexao(data);
});

socket.on("updateRelogio", (data) => {
    relogio(data.tempo_w, data.tempo_b, data.roomNumber);
});

socket.on("pong", (data) => {
    latencia(data);
});

socket.on("updateSpecs", (data) => {
    specs(data);
});

socket.on("regRoom", async (data) => {
    if (gameRoom == null){
        const { roomNumber, idBrancas, idPretas, usernameBrancas, usernamePretas } = data;
        const usernamePadrao = "Anônimo (você)";

        if (socket.id == idBrancas || socket.id == idPretas){
            if (socket.id == idBrancas){
                nomeBrancas.textContent = (usernameBrancas == "Anônimo" || !usernameBrancas ? usernamePadrao : 
                usernameBrancas
                + " (" + 
                await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + usernameBrancas)
                .then((res) => { return res.json() })
                .then((res) => { return res.elo })
                + ")"
                );


                nomePretas.textContent = (!usernamePretas || usernamePretas == "Anônimo" ? "Anônimo" :
                usernamePretas
                + " (" 
                + await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + usernamePretas)
                .then((res) => { return res.json() })
                .then((res) => { return res.elo })
                + ")"
                );
            }
            else {
                nomePretas.textContent = (usernamePretas == "Anônimo" || !usernamePretas ? usernamePadrao :
                usernamePretas
                + " (" 
                + await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + usernamePretas)
                .then((res) => { return res.json() })
                .then((res) => { return res.elo })
                + ")"
                );

                nomeBrancas.textContent = (!usernameBrancas || usernameBrancas == "Anônimo" ? "Anônimo" :
                usernameBrancas
                + " (" 
                + await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + usernameBrancas)
                .then((res) => { return res.json() })
                .then((res) => { return res.elo })
                + ")"
                );
            }

            gameRoom = roomNumber;
            startGame(roomNumber);
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

socket.on("updateGrid", (data) => {
    renderGrid(data);
});

/* Tela de espera */
socket.on("updateConnections", (con) => {
    connections = con;
    jogadoresOnlineCounter(con);
});

/* Key bindings */
document.addEventListener("keydown", (e) => {

    let key = e.key;

    if (document.activeElement !== textbox){
        if (key == 'p' || key == 'P'){
            passarVez();
        }
        else if(key == 'd' || key == 'D'){
            desistir();
        }
        else if(key == "ArrowLeft"){
            moveBack();
        }
        else if(key == "ArrowRight"){
            moveForward();
        }
    }

});

socket.on("erro404", (data) => {
    if (socket.id == data){
        window.location = "/404";
    }
});

