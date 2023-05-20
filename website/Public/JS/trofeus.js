class Jogador {
    constructor(nome, eloOnline, eloAIJe, pais, isCampeao, titulos) {
        this.nome = nome;
        //this.desc = desc;
        this.eloOnline = eloOnline;
        this.eloAIJe = eloAIJe;
        this.pais = pais;
        this.isCampeao = isCampeao;
        this.titulos = titulos;
    }

}

const vidacalura = new Jogador(
    "vidacalura",
    null,
    null,
    "BR",
    true,
    [
        "Jeek Online Open I - 1º Lugar",
        "Campeonato Mundial de Jeek Online (2023) - 1º Lugar",
        "Torneio de aniversário de 1 ano - 1º Lugar"
    ]
);

const shinobu = new Jogador(
    "Shinobu",
    null,
    null,
    "BR",
    false,
    [
        "Jeek Online Open I - 2º Lugar", "Torneio de Candidatos Jeek Online I - 3º Lugar",
        "Torneio de Candidatos Jeek Online 2023 - Melhor espírito esportivo"
    ]
);

const batman = new Jogador(
    "Batman220206",
    null,
    null,
    "BR",
    false,
    [
        "Jeek Online Open I - 3º Lugar", "Torneio de Candidatos Jeek Online 2023 - 1º Lugar",
        "Torneio de Candidatos Jeek Online 2023 - Melhor jogada do Torneio",
        "Torneio de Candidatos Jeek Online 2023 - Jogador revelação",
        "Campeonato Mundial de Jeek Online (2023) - 2º Lugar"
    ]
);

const leonestri = new Jogador(
    "LeoNestri",
    null,
    null,
    "BR",
    false,
    [ "Torneio de Candidatos Jeek Online 2023 - 2º Lugar" ]
);

const php = new Jogador(
    "Php",
    null,
    null,
    "BR",
    false,
    [ "Nomeação de Árbitro Classe D" ]
);

const rafflesblack = new Jogador(
    "Rafflesblack",
    null,
    null,
    "BR",
    false,
    [ "Torneio de aniversário de 1 ano - 3º Lugar" ]
);

const fabiohiro = new Jogador(
    "Fábio Hiro",
    null,
    null,
    "BR",
    false,
    [ "Torneio de aniversário de 1 ano - 2º Lugar" ]
);

let jogadores = [];
jogadores.push(vidacalura);
jogadores.push(shinobu);
jogadores.push(batman);
jogadores.push(leonestri);
jogadores.push(php);
jogadores.push(rafflesblack);
jogadores.push(fabiohiro);

// Cria elementos
const premiosPorUserDiv = document.getElementById("premios-por-usuario");

jogadores.forEach(async (j) => {
    // Pega elo do jogador
    await fetch("https://jeek-online.vercel.app/api/aije/elo/" + j.nome)
    .then((rawRes) => { return rawRes.json(); })
    .then(async (res) => {
        j.eloAIJe = res.elo;

        await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + j.nome)
        .then((rawRes) => { return rawRes.json(); })
        .then(async (res) => {
            j.eloOnline = res.elo;
        });
    });

    const containerDiv = document.createElement("div");

    const subContainer = document.createElement("div");
    subContainer.classList.add("jogador-aije-container");
    subContainer.textContent = j.nome;

    containerDiv.appendChild(subContainer);

    if (j.isCampeao) {
        const frame = document.createElement("i");
        frame.className = "fa-solid fa-crown text-gold pt-1";
        subContainer.appendChild(frame);
    }

    const paisFrame = document.createElement("img");
    paisFrame.classList.add("w-8");

    switch(j.pais) {
        case "BR":
            paisFrame.src = "../imgs/br.png";
            break;
        case "PT":
            paisFrame.src = "../imgs/pt.png";
            break;
        case "AO":
            paisFrame.src = "../imgs/ao.png";
            break;
        case "KR":
            paisFrame.src = "../imgs/kr.png";
            break;
        case "IT":
            paisFrame.src = "../imgs/internacional.png";
            paisFrame.title = "Internacional";
            break;
    }

    const dadosJogadorDiv = document.createElement("div");

    const eloOnlineH3 = document.createElement("h3");
    eloOnlineH3.textContent = "Elo Online: " + (j.eloOnline != null ? j.eloOnline : "-");
    eloOnlineH3.classList.add("pt-6");
    eloOnlineH3.classList.add("pb-2");

    const eloAIJeH3 = document.createElement("h3");
    eloAIJeH3.classList.add("pb-6");
    if (j.eloAIJe) {
        eloAIJeH3.textContent = "Elo AIJe: " + (j.eloAIJe != null ? j.eloAIJe : "-");
    }

    dadosJogadorDiv.classList.add("jogador-aije-dados-container");
    dadosJogadorDiv.classList.add("hidden");
    dadosJogadorDiv.appendChild(paisFrame);
    dadosJogadorDiv.appendChild(eloOnlineH3);
    dadosJogadorDiv.appendChild(eloAIJeH3);

    const titulosDiv = document.createElement("div");
    titulosDiv.classList.add("jogador-titulos-div");
    
    const p = document.createElement("p");
    p.textContent = "Prêmios:";
    p.className = "text-2xl underline font-bold pb-6";

    titulosDiv.appendChild(p);

    const trofeusDiv = document.createElement("div");
    trofeusDiv.classList.add("px-3");
    trofeusDiv.classList.add("flex");
    trofeusDiv.classList.add("gap-4");

    j.titulos.forEach((t) => {
        const trofeu = document.createElement("i");
        trofeu.title = t;

        trofeu.className = "fa-solid text-5xl cursor-pointer";

        if (t.includes("1º")) {
            trofeu.classList.add("text-gold");
            trofeu.classList.add("fa-trophy");

            if (t.includes("Mundial")) {
                trofeu.classList.remove("fa-trophy");
                trofeu.classList.add("fa-crown");
            }
        }
        else if (t.includes("2º")) {
            trofeu.classList.add("text-jeek-gray-200");
            trofeu.classList.add("fa-medal");

            if (t.includes("Mundial")) {
                trofeu.classList.remove("fa-medal");
                trofeu.classList.add("fa-crown");
            }
        }
        else if (t.includes("3º")) {
            trofeu.classList.add("text-copper");
            trofeu.classList.add("fa-medal");
        }
        else if (t.includes("Árbitro")) {
            if (t.includes("Classe D")) {
                trofeu.classList.add("text-jeek-gray-500");
            }
            else if (t.includes("Classe C")) {
                trofeu.classList.add("text-copper");
            }
            else if (t.includes("Classe B")) {
                trofeu.classList.add("text-jeek-gray-200");
            }
            else if (t.includes("Classe A")) {
                trofeu.classList.add("text-gold");
            }

            trofeu.classList.add("fa-award");
        }
        else {
            if (t.includes("revelação")) {
                trofeu.classList.add("text-[#b69d4d]");
            }

            trofeu.classList.add("text-jeek-gray-500");
            trofeu.classList.add("fa-award");
        }

        trofeusDiv.appendChild(trofeu);
    });

    titulosDiv.appendChild(trofeusDiv);
    dadosJogadorDiv.appendChild(titulosDiv);

    subContainer.addEventListener("click", () => {
        if (dadosJogadorDiv.className.includes("hidden")) {
            dadosJogadorDiv.classList.remove("hidden");
        }
        else {
            dadosJogadorDiv.classList.add("hidden");
        }
    });

    containerDiv.appendChild(dadosJogadorDiv);
    premiosPorUserDiv.appendChild(containerDiv);
});