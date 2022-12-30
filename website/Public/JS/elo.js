const winProbability = (ratingA, ratingB) => {

    return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));

}

const eloCalculator = (obj) => {

    let { ratingBrancas, ratingPretas, brancasGanham } = obj;

    // Novo rating brancas
    const scoreBrancas = (brancasGanham == true ? 1 : 0);
    ratingBrancas = Math.round(ratingBrancas + 16 * (scoreBrancas - winProbability(ratingBrancas, ratingPretas)));

    // Novo rating pretas
    const scorePretas = (brancasGanham == true ? 0 : 1);
    ratingPretas = Math.round(ratingPretas + 16 * (scorePretas - winProbability(ratingPretas, ratingBrancas))); 

    return { ratingBrancas, ratingPretas };

}

console.log(eloCalculator({ ratingBrancas: 1700, ratingPretas: 1800, brancasGanham: false }));

module.exports = eloCalculator;