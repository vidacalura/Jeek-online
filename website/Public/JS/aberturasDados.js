class Movimento {
    constructor(nome, desc, pecas, PJN, pontuacao) {
        this.nome = nome;
        this.desc = desc;
        this.pecas = pecas; // []Peca
        this.PJN = PJN;
        this.pontuacao = pontuacao
    }   
}

class Peca {
    constructor(x, y, ehBrancas) {
        this.x = x;
        this.y = y;
        this.ehBrancas = ehBrancas;
    }
}

/* Abertura Hiro 1. A1 B1 C1 */
const aberturaHiroLance1 = new Movimento(
    "Abertura Hiro",
    "A Abertura Hiro foi a primeira abertura a ser usada e estudada a fundo no Jeek. Sendo a mais antiga e mais famosa abertura, trazida pelo famoso jogador Fábio Hiro.",
    [
        new Peca(0, 0, true),
        new Peca(1, 0, true),
        new Peca(2, 0, true)
    ],
    "1. A1 B1 C1",
    1
);

const aberturaHiroLance2 = new Movimento(
    "Refutação da Abertura Hiro",
    "Esta linha é chamada de 'Refutação da Abertura Hiro' pois vence a Hiro 100% das vezes. Teste algumas variantes para comprovar isso.",
    [
        new Peca(1, 1, false),
        new Peca(1, 2, false),
        new Peca(1, 3, false)
    ],
    "2. B2 B3 B4",
    0
);

const aberturaHiroLanceA4 = new Movimento(
    "Refutação da Abertura Hiro: Linha principal",
    "Aqui as brancas tentam um desperato, tentando fugir do ataque das pretas, mas esta resposta é ineficaz após 4. D2 D3 D4 (sistema 3x2x1)",
    [
        new Peca(0, 3, true),
        new Peca(3, 1, false),
        new Peca(3, 2, false),
        new Peca(3, 3, false)
    ],
    "3. A4 4. D2 D3 D4",
    0
);

const aberturaHiroLanceD1 = new Movimento(
    "Refutação da Abertura Hiro: 3. D1",
    "Aqui as brancas tentam um desperato, tentando fugir do ataque das pretas, mas esta resposta é ineficaz após 4. D2 D3 D4, gerando simetria 3x3",
    [
        new Peca(3, 0, true),
        new Peca(3, 1, false),
        new Peca(3, 2, false),
        new Peca(3, 3, false)
    ],
    "3. D1 4. D2 D3 D4",
    0
);

const aberturaHiroLanceD3 = new Movimento(
    "Refutação da Abertura Hiro: 3. D3",
    "Aqui as brancas tentam um desperato, tentando fugir do ataque das pretas, mas esta resposta é ineficaz após 4. C2 C3 C4 (sistema 3x2x1)",
    [
        new Peca(3, 2, true),
        new Peca(2, 1, false),
        new Peca(2, 2, false),
        new Peca(2, 3, false)
    ],
    "3. D3 4. C2 C3 C4",
    0
);

const aberturaHiroLanceA3 = new Movimento(
    "Refutação da Abertura Hiro: 3. A3",
    "Essa é uma das linhas mais complexas da Hiro, aqui, a única forma das pretas sobreviverem é com 4. D2 (!), fazendo um sistema 3x2x1x1x1, que é um sistema ganhador. Vale notar que, caso as brancas joguem 3. D2, a resposta é 4. A3 por ser uma transposição desta posição.",
    [
        new Peca(0, 2, true),
        new Peca(3, 1, false)
    ],
    "3. A3 4. D2",
    0
);

/* Variante Raffles 2. B3 C3 D3 */
const varianteRafflesLance2 = new Movimento(
    "Abertura Hiro: Variante Raffles",
    "A variante Raffles foi desenvolvida pelo jogador Rafflesblack, sendo a primeira tentativa de refutação da Hiro, mas que logo entrou em desuso por ser refutável. Você consegue achar o lance?",
    [
        new Peca(1, 2, false),
        new Peca(2, 2, false),
        new Peca(3, 2, false)
    ],
    "2. B3 C3 D3",
    98
)

const varianteRafflesLance3 = new Movimento(
    "Abertura Hiro: Variante Raffles",
    "Exato! Após 3. A2 A3, as brancas deixam a posição simétrica (4x4) ganhando a partida!",
    [
        new Peca(0, 1, true),
        new Peca(0, 2, true)
    ],
    "3. A2 A3",
    99
)

const varianteRafflesLanceC4 = new Movimento(
    "Abertura Hiro: Variante Travazap",
    "3. C4 foi por muito tempo considerada a principal defesa contra a Variante Raffles, porém, com uma resposta muito simples as brancas perdem (4. A2 B2 C2).",
    [
        new Peca(2, 3, true),
        new Peca(0, 1, false),
        new Peca(1, 1, false),
        new Peca(2, 1, false)
    ],
    "3. C4 4. A2 B2 C2",
    0
)

/* Abertura Vicius 1. C2 C3 */
const aberturaViciusLance1 = new Movimento(
    "Abertura Vicius",
    "A Abertura Vicius foi criada pelo renomado jogador Batman220206, buscando uma nova abordagem após a queda da Abertura Hiro. Esta abertura se tornou um dos principais pilares do jogo competitivo, sendo uma das mais sólidas aberturas.",
    [
        new Peca(2, 1, true),
        new Peca(2, 2, true)
    ],
    "1. C2 C3",
    50
);

/* Abertura Semi-Hiro */
const aberturaSemiHiroLance1 = new Movimento(
    "Semi-Hiro",
    "A Abertura Semi-Hiro foi criada pelo campeão mundial de Jeek Online vidacalura, buscando uma nova abordagem após a queda da Abertura Hiro. Esta abertura se baseia na Abertura Hiro, tendo dievrsos golpes táticos com ela. Foi parte do cenário competitivo por muito tempo, mas acabou entrando em desuso após achada sua refutação.",
    [
        new Peca(2, 1, true),
        new Peca(2, 2, true)
    ],
    "1. C2 C3",
    20
);