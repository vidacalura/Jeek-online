# Documentação da API pública do Jeek Online

Esta documentação se refere apenas às funções públicas da API, que 
podem ser acessadas por qualquer um livremente, e não às partes 
privadas desta.

## /api/ping

Verifica se o servidor está de pé

Request: GET
Parâmetros: nenhum

## /api/jogos/:codJogo

Retorna as informações salvas de uma partida específica

Request: GET
Parâmetros: 
* codJogo - Number

## /api/usuarios/:username

Retorna as informações do perfil de um usuário

Request: GET
Parâmetros:
* username - string

## /api/usuarios/elo/:username

Retorna o elo de um usuário

Request: GET
Parâmetros:
* username - string

## /api/ranking

Retorna os 10 jogadores com maior elo do site

Request: GET
Parâmetros: nenhum