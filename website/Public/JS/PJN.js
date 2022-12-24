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
    if (brancasGanham){
        PJNcode += "{ Brancas ganham }";
    }
    else {
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

module.exports = PJNEncoder;