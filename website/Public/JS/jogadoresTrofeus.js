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
    [ "Jeek Online Open I - 1º Lugar"] //, "Campeonato Mundial de Jeek Online - 1º Lugar" ]
);

const shinobu = new Jogador(
    "Shinobu",
    null,
    null,
    "BR",
    false,
    [ "Jeek Online Open I - 2º Lugar" ]
);

const batman = new Jogador(
    "Batman220206",
    null,
    null,
    "BR",
    false,
    [ "Jeek Online Open I - 3º Lugar"] //, "Campeonato Mundial de Jeek Online - 2º Lugar" ]
);

let jogadores = [];
jogadores.push(vidacalura);
jogadores.push(shinobu);
jogadores.push(batman);

jogadores.forEach(async (j) => {
    await fetch("https://jeek-online.vercel.app/api/aije/elo/" + j.nome)
    .then((rawRes) => { return rawRes.json(); })
    .then(async (res) => {
        console.log(res);
        j.eloAIJe = res.elo;

        await fetch("https://jeek-online.vercel.app/api/usuarios/elo/" + j.nome)
        .then((rawRes) => { return rawRes.json(); })
        .then(async (res) => {
            j.eloOnline = res.elo;
        });
    });
});