let board = document.getElementById("tabuleiro");
const passarBtn = document.querySelector(".botao-passar");
passarBtn.addEventListener("click", passarVez);
const backBtn = document.querySelector(".move-back");
const forwardBtn = document.querySelector(".move-forward");
const PJNReader = document.getElementById("pjn-reader");

let turn = "white";
let jogadas = 3;
let lances = -1;
let movesBack = 0;
let casas_ativas = [];
let jogadasHistory = [];
let PrePJN = { casasAtivas: [], brancasGanham: null };
let casas = [];

createGrid();
gridEventListener();


function passarVez(){

    if (jogadas < 3){
        if (turn == "white"){
            turn = "black";
        }
        else{
            turn = "white";
        }

        jogadas = 3;
    }

}

function createGrid(){

    let count = 0;

    for (let i = 0; i < 4; i++){

        const col = document.createElement("div");
        col.classList.add("coluna");
        board.appendChild(col);

        for (let j = 0; j < 4; j++){
            const casa = document.createElement("div");
            casa.dataset.id = count;
            casa.dataset.x = i;
            casa.dataset.y = j;
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

function gridEventListener(){

    for (const casa_ataque of casas){
        casa_ataque.addEventListener("click", (e) => {
            if (movesBack > 0){
                casas_ativas.length = casas_ativas.length - movesBack;
                PrePJN.casasAtivas.length = PrePJN.casasAtivas.length - movesBack;
                jogadasHistory.length = jogadasHistory.length - movesBack;

                jogadas = jogadasHistory[jogadasHistory.length - 1];

                if (jogadas <= 0){
                    if (turn == "white"){
                        turn = "black";
                        jogadas = 3;
                    }
                    else{
                        turn = "white";
                        jogadas = 3;
                    }
                }
                
                lances -= movesBack;
                movesBack = 0;
            }

            if (!casas_ativas.includes(casa_ataque.dataset.id)){
                if ((isConnected(Number(casa_ataque.dataset.id))) && (casas_ativas.length < 15)){
                    // Captar e registrar movimento
                    const peca = document.createElement("div");
                    
                    if (turn == "white")
                        peca.classList.add("peca-branca");
                    else
                        peca.classList.add("peca-preta");

                    if(casas_ativas.length == 14){
                        PrePJN.brancasGanham = (turn == "white" ? true : false);
                    }

                    PrePJN.casasAtivas.push([Number(casa_ataque.dataset.x), Number(casa_ataque.dataset.y), turn]);

                    casa_ataque.appendChild(peca);
                    casas_ativas.push(casa_ataque.dataset.id);

                    jogadas--;
                    jogadasHistory.push(jogadas);

                    if (jogadas <= 0){
                        if (turn == "white"){
                            turn = "black";
                            jogadas = 3;
                        }
                        else{
                            turn = "white";
                            jogadas = 3;
                        }
                    }

                    lances++;
                    autoPass(casa_ataque.dataset.id);

                    gerarPJN(PrePJN);
                }
            }
        });
    }

}


function goBack(){

    if (movesBack < casas_ativas.length)
        movesBack++;

    if (casas[Number(casas_ativas[casas_ativas.length - movesBack])].children.length > 1){
        for (let i = 0; i < casas[Number(casas_ativas[casas_ativas.length - movesBack])].children.length - 1; i++){
            casas[Number(casas_ativas[casas_ativas.length - movesBack])].children[i].remove();
        }
        casas[Number(casas_ativas[casas_ativas.length - movesBack])].firstChild.classList.add("hidden");
    }
    else {
        casas[Number(casas_ativas[casas_ativas.length - movesBack])].firstChild.classList.add("hidden");
    }

}

function goForward(){

    casas[Number(casas_ativas[casas_ativas.length - movesBack])].firstChild.classList.remove("hidden");

    if (movesBack > 0)
        movesBack--;

}

function isConnected(casa_num){

    if (jogadas == 3){
        if ((casas_ativas.length == 1) &&
        (turn == "black") && (jogadas == 1) &&
        (Number(casas_ativas[0]) == 
        (15 - casa_num))){
            alert("O primeiro lance não pode ser espelhado!");
            return false;
        }

        return true;
    }

    if (casa_num > 15 || casa_num < 0)
        return false;

    // Verifica se o lance é legal
    if ((casa_num != Number(casas_ativas[lances]) - 1) && (casa_num != Number(casas_ativas[lances]) + 1) &&
    (casa_num != Number(casas_ativas[lances]) - 4) && (casa_num != Number(casas_ativas[lances]) + 4)){
        if (jogadas != 1){
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

    // Verfica se os lances são simétricos
    if ((casas_ativas.length == 5) && 
    (turn == "black") && (jogadas == 3) &&
    (Number(casas_ativas[0]) + Number(casas_ativas[1]) + Number(casas_ativas[2])) == 
    ((15 - Number(casas_ativas[3])) + (15 - Number(casas_ativas[4])) + (15 - casa_num))){
        alert("O primeiro lance não pode ser espelhado!");
        return false;
    }
    
    if ((casas_ativas.length == 3) &&
    (turn == "black") && (jogadas == 2) &&
    (Number(casas_ativas[0]) + Number(casas_ativas[1])) == 
    ((15 - Number(casas_ativas[2])) + (15 - casa_num))){
        return false;
    }


    return true;

}

function autoPass(casa_num){

    casa_num = Number(casa_num);

    if (!isConnected(casa_num - 1) || casas_ativas.includes((casa_num - 1).toString())){
        if (!isConnected(casa_num + 1) || casas_ativas.includes((casa_num + 1).toString())){
            if (!isConnected(casa_num - 4) || casas_ativas.includes((casa_num - 4).toString())){
                if (!isConnected(casa_num + 4) || casas_ativas.includes((casa_num + 4).toString())){
                    if (jogadas != 3){
                        casa_ant = Number(casas_ativas[lances - 1]);
                        if (!isConnected(casa_ant - 1) || casas_ativas.includes((casa_ant - 1).toString())){
                            if (!isConnected(casa_ant + 1) || casas_ativas.includes((casa_ant + 1).toString())){
                                if (!isConnected(casa_ant - 4) || casas_ativas.includes((casa_ant - 4).toString())){
                                    if (!isConnected(casa_ant + 4) || casas_ativas.includes((casa_ant + 4).toString())){
                                        passarVez();
                                    }
                                }
                            }
                        }
                    }
                    else{
                        passarVez();
                    }
                }
            }
        }
    }

}

function gerarPJN(obj){

    PJNReader.textContent = PJNEncoder(obj);

}

document.addEventListener("keydown", (e) => {

    let key = e.key;

    if (key == 'p' || key == 'P'){
        passarVez();
    }
    else if (key == "ArrowLeft"){
        goBack();
    }
    else if (key == "ArrowRight"){
        goForward();
    }

});


const PJNEncoder = (obj) => {

    const arr = obj.casasAtivas;
    const { brancasGanham } = obj;

    let PJNcode = "";

    for (let i = 0, j = 1; i < arr.length; i++){
        if (i == 0){
            PJNcode += j + ". ";
            j++;
        }
        else if (arr[i][2] != arr[i - 1][2]){
            PJNcode += j + ". ";
            j++;
        }

        // Pega a letra
        switch (arr[i][1]){
            case 0:
                PJNcode += "A";
                break;
            case 1:
                PJNcode += "B";
                break;
            case 2:
                PJNcode += "C";
                break;
            case 3:
                PJNcode += "D";
                break;
        }

        // Pega o número
        PJNcode += `${arr[i][0] + 1} `;

    }

    // Confirma quem ganhou
    if (brancasGanham == true){
        PJNcode += "{ Brancas ganham }";
    }
    else if (brancasGanham == false){
        PJNcode += "{ Pretas ganham }";
    }

    return PJNcode;

}


const PJNDecoder = (str) => {

    let decodedPJN = { casasAtivas: [], brancasGanham: null }

    // Remove os números dos lances
    for (let i = 0; i < 17; i++){

        str = str.replace(i + ".", "");

    }

    // Define "brancasGanham"
    if (str.includes("{ Brancas ganham }")){
        decodedPJN.brancasGanham = true;
    }
    else {
        decodedPJN.brancasGanham = false;
    }

    let arr = [];
    let vezBrancas = true;
    for (let i = 1; i < str.length; i++){

        switch (str[i]){
            case " ":
                if (str[i + 1] == " "){
                    (vezBrancas == true ? false : true);
                    i++;
                }

                arr.push(vezBrancas);
                break;

            // Pega X
            case "A":
                arr.push(0);
                break;
            case "B":
                arr.push(1);
                break;
            case "C":
                arr.push(2);
                break;
            case "D":
                arr.push(3);
                break;
            
            // Pega Y
            case "1":
                arr.push(0);
                break;
            case "2":
                arr.push(1);
                break;
            case "3":
                arr.push(2);
                break;
            case "4":
                arr.push(3);
                break;

            case "{":
                i = str.length;
                break;
        }

        if (arr.length == 3){
            const tmp = arr[0]; 
            arr[0] = arr[1];
            arr[1] = tmp;

            decodedPJN.casasAtivas.push(arr);
            arr = [];
        }

    }

    return decodedPJN;

}