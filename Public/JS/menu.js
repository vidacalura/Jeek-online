const board = document.querySelector(".tabuleiro-simulacao");
let casas = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sleepTime = 500;

createGrid();
simulacao();


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

async function simulacao(){

    const peca_branca = [];
    for (let i = 0; i < 8; i++){
        peca_branca[i] = document.createElement("div");
        peca_branca[i].classList.add("peca-branca");
    }

    const peca_preta = [];
    for (let i = 0; i < 8; i++){
        peca_preta[i] = document.createElement("div");
        peca_preta[i].classList.add("peca-preta");
    }

    casas[0].appendChild(peca_branca[0]);
    await sleep(sleepTime);
    casas[1].appendChild(peca_branca[1]);
    await sleep(sleepTime);
    casas[2].appendChild(peca_branca[2]);
    await sleep(sleepTime);

    casas[5].appendChild(peca_preta[0]);
    await sleep(sleepTime);
    casas[6].appendChild(peca_preta[1]);
    await sleep(sleepTime);
    casas[7].appendChild(peca_preta[2]);
    await sleep(sleepTime);

    casas[4].appendChild(peca_branca[3]);
    await sleep(sleepTime);

    casas[11].appendChild(peca_preta[3]);
    await sleep(sleepTime);
    casas[15].appendChild(peca_preta[4]);
    await sleep(sleepTime);  
    
    casas[12].appendChild(peca_branca[4]);
    await sleep(sleepTime);

    casas[9].appendChild(peca_preta[5]);
    await sleep(sleepTime);

    casas[13].appendChild(peca_branca[5]);
    await sleep(sleepTime);
    casas[14].appendChild(peca_branca[6]);
    await sleep(sleepTime);
}