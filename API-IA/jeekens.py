from random import shuffle
from flask import Flask
from flask import request

class Jogo:
    def __init__(self):
        self.movimentos = [] # Primeiro lance das brancas
        self.lances = 0  # Lances 
        self.turno = "B"     # B - Brancas, P - Pretas
        self.tabuleiro = [
        [".", ".", ".", "."],
        [".", ".", ".", "."],
        [".", ".", ".", "."],
        [".", ".", ".", "."]
    ]

    def mostrar_tabuleiro(self):
        counter = 1
        for linha in self.tabuleiro:
            print("\n" + str(counter), end=" ")
            counter += 1

            for casa in linha:
                print(casa, end=" ")

        print("\n  a b c d")


    def registrar_movimento(self, movimento):
        if self.validar_movimento(movimento):
            self.movimentos.append(movimento)
            
            movimento = converter_movimento(movimento)
            for i in movimento:
                self.tabuleiro[i[1]][i[0]] = self.turno

            if self.turno == "B":
                self.turno = "P"
            else:
                self.turno = "B"

            self.lances += 1


    def validar_movimento(self, movimento):
        movimento = converter_movimento(movimento)

        if movimento == None:
            return False

        if len(movimento) > 3:
            return False

        # Verifica lance espelhado
        if self.lances == 1:
            movimento_brancas = converter_movimento(self.movimentos[0].split(" "))

            if len(movimento_brancas) == len(movimento):
                if len(movimento_brancas) == 1:
                    if movimento_brancas[0][0] + movimento_brancas[0][1] + movimento[0][0] + movimento[0][1] == 6:
                        return False

                elif len(movimento_brancas) == 2:
                    if (movimento_brancas[0][0] + movimento_brancas[0][1] + movimento[0][0] + movimento[0][1]
                    + movimento_brancas[1][0] + movimento_brancas[1][1] + movimento[1][0] + movimento[1][1] == 12):
                        return False

                elif len(movimento_brancas) == 3:
                    if (movimento_brancas[0][0] + movimento_brancas[0][1] + movimento[0][0] + movimento[0][1]
                    + movimento_brancas[1][0] + movimento_brancas[1][1] + movimento[1][0] + movimento[1][1]
                    + movimento_brancas[2][0] + movimento_brancas[2][1] + movimento[2][0] + movimento[2][1] == 18):
                        return False 

        # Verifica se casa já foi preenchida
        for i in movimento:
            if self.tabuleiro[i[1]][i[0]] != ".":
                return False

        if len(movimento) == 1:
            return True            
        
        # Verifica se o lance é legal
        comum = ""
        for i in movimento:
            if comum == "":
                comum = list(i)
            else:
                if i[0] == comum[0]:
                    comum[0] = i[0]
                    comum[1] = ""
                elif i[1] == comum[1]:
                    comum[1] = i[1]
                    comum[0] = ""
                else:
                    return False

        # Verifica se peças estão conectadas
        movimentos_ok_lista = [
            [0, 1], [1, 2], [2, 3],
            [1, 0], [2, 1], [3, 2],
            [0, 1, 2], [1, 2, 3],
            [1, 0, 2], [2, 1, 3],
            [2, 1, 0], [3, 2, 1],
            [1, 2, 0], [2, 3, 1],
            [2, 3, 1], [3, 1, 2],
            [3, 2, 1], [1, 3, 2],
        ]

        nao_comum_lista = []
        if comum[1] == '':
            for i in movimento:
                nao_comum_lista.append(i[1])
        else:
            for i in movimento:
                nao_comum_lista.append(i[0])

        if nao_comum_lista not in movimentos_ok_lista:
            return False

        return True


    def get_count_pecas(self):
        count = 0
        for linha in self.tabuleiro:
            for casa in linha:
                if casa != ".":
                    count += 1

        return count


    def verificar_vitoria(self):
        if self.get_count_pecas() == 15:
            if self.turno == "B":
                return "P"
            else:
                return "B"

        elif self.get_count_pecas() > 15:
            return self.turno

        else:
            return None


def converter_movimento(movimento):
    if movimento == None:
        return None

    movimentos_convertidos = []

    for i in movimento:
        i = i.lower()
        if len(i) != 2:
            return None
        if i[0] == "a" or i[0] == "b" or i[0] == "c" or i[0] == "d":
            movimentos_convertidos.append([ord(i[0]) - 97, int(i[1]) - 1])
        else:
            return None

    return movimentos_convertidos


app = Flask(__name__)

# Jeekens (600)
@app.route("/jeekens/600elo", methods=["POST"])
def receber_movimento():

    jogo = Jogo()

    random_moves = [
        "a1", "a2", "a3", "a4",
        "b1", "b2", "b3", "b4",
        "c1", "c2", "c3", "c4",
        "d1", "d2", "d3", "d4",
        "a1 a2", "a2 a3", "a3 a4",
        "b1 b2", "b2 b3", "b3 b4",
        "c1 c2", "c2 c3", "c3 c4",
        "d1 d2", "d2 d3", "d3 d4",
        "a1 a2 a3", "a2 a3 a4",
        "b1 b2 b3", "b2 b3 b4",
        "c1 c2 c3", "c2 c3 c4",
        "d1 d2 d3", "d2 d3 d4",
    ]


    jogo = Jogo()
    jogo.turno = request.json['turno'] # "turno": "P" || "B"
    jogo.tabuleiro = request.json['tabuleiro'] # "tabuleiro": [[], [], [], []]
    jogo.movimentos.append(request.json['movimentos']) # "movimentos": "A1 A2" (ex)
    jogo.lances = request.json['lances'] # "lances": 3
    lances = request.json['lances']

    movimento = None
    while jogo.lances == lances:
        shuffle(random_moves)

        # Jeekens faz um movimento
        movimento = random_moves[0].split(" ")

        jogo.registrar_movimento(movimento)

    # Enviar movimento
    return movimento