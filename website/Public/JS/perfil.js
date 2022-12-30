const title = document.querySelector("title");
let username = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];
const jogosDivMain = document.getElementById("jogos-div");
title.textContent += username;

fetch("https://jeek-online.vercel.app/api/usuarios/" + username)
.then((res) => { return res.json(); })
.then((res) => {
    username = res.username;
    gerarGrafico(res.jogos, res.elo);
    mostrarPerfil(res);
})
.catch((error) => {
    console.log(error);
});


function mostrarPerfil(res){
    const { elo, dataCad, partidas, vitorias, derrotas, jogos } = res;

    const usernameView = document.getElementById("username-view");
    usernameView.textContent = username;
    const eloView = document.getElementById("elo-view");
    eloView.textContent = elo;
    const dataCadView = document.getElementById("data-cad-view");
    console.log(dataCad)
    dataCadView.textContent = `${dataCad.slice(8, 10)}/${dataCad.slice(5, 7)}/${dataCad.slice(0, 4)}`;
    const partidasView = document.getElementById("jogos-jogados-view");
    partidasView.textContent = partidas;
    const vitoriasView = document.getElementById("vitorias-view");
    vitoriasView.textContent = vitorias;
    const derrotasView = document.getElementById("derrotas-view");
    derrotasView.textContent = derrotas;

    mostrarJogos(jogos);

}

function gerarGrafico(jogos, eloAtual){
    let elo = [];
    let labels = [];
    for (const jogo of jogos){
        if (username == jogo.username_jogador1)
            elo.push(jogo.elo_jogador1);
        else
            elo.push(jogo.elo_jogador2);
        labels.push("");
    }
    elo.push(eloAtual)
    labels.push("");

    let graficoElo = new Chart("grafico-elo", {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: `Elo de ${username}`,
                data: elo,
                fill: false,
                borderColor: 'rgb(255, 255, 255)',
                tension: 0.1
            }]
        }
    });
}

function mostrarJogos(jogos){

    console.log(jogos);

    for (const j of jogos){

        // fazer q href de a = "/jogos/" + cod_jogo

        const jogoDiv = document.createElement("div");
        jogoDiv.className = "w-full px-12 py-6 transition-all ease-in-out cursor-pointer hover:bg-jeek-gray-400 hover:shadow-sm";

        const jogoContainer = document.createElement("div");
        jogoContainer.className = "w-full flex justify-center text-center";

        const brancasDiv = document.createElement("div");
        const brancasNome = document.createElement("h3");
        brancasNome.className = "font-bold text-xl";
        brancasNome.textContent = j.username_jogador1;
        const brancasElo = document.createElement("p");
        brancasElo.className = "text-jeek-gray-200";
        brancasElo.textContent = j.elo_jogador1;

        brancasDiv.appendChild(brancasNome);
        brancasDiv.appendChild(brancasElo);

        const vs = document.createElement("p");
        vs.className = "px-6 pt-2 text-xl";
        vs.textContent = "vs.";

        const pretasDiv = document.createElement("div");
        const pretasNome = document.createElement("h3");
        pretasNome.className = "font-bold text-xl";
        pretasNome.textContent = j.username_jogador2;
        const pretasElo = document.createElement("p");
        pretasElo.className = "text-jeek-gray-200";
        pretasElo.textContent = j.elo_jogador2;

        pretasDiv.appendChild(pretasNome);
        pretasDiv.appendChild(pretasElo);

        const resultado = document.createElement("p");
        resultado.className = "text-center pt-4";
        
        if (j.cod_jogador1 == j.cod_vencedor){
            resultado.textContent = "Vitória das brancas (" + j.username_jogador1 + ")";
        }
        else {
            resultado.textContent = "Vitória das pretas (" + j.username_jogador2 + ")";
        }

        if (j.username_jogador1 == username){
            if (resultado.textContent.includes("brancas")){
                resultado.classList.add("text-green-100");
            }
            else {
                resultado.classList.add("text-red");
            }
        }
        else {
            if (resultado.textContent.includes("brancas")){
                resultado.classList.add("text-red");
            }
            else {
                resultado.classList.add("text-green-100");
            }
        }

        jogoContainer.appendChild(brancasDiv);
        jogoContainer.appendChild(vs);
        jogoContainer.appendChild(pretasDiv);
        jogoDiv.appendChild(jogoContainer);
        jogoDiv.appendChild(resultado);
        jogosDivMain.appendChild(jogoDiv);

    }

}