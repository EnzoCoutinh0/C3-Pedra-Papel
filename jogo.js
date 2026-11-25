// Regras
const PONTOS_PARA_VENCER = 3;

// Cria lista de cada jogada possivel
const OPCOES = [
  { id: "pedra", nome: "Pedra", icone: "✊", tecla: "1", vence: "tesoura" },
  { id: "papel", nome: "Papel", icone: "✋", tecla: "2", vence: "pedra" },
  { id: "tesoura", nome: "Tesoura", icone: "✌️", tecla: "3", vence: "papel" },
];

//Estado do jogo
const estado = {
  pontosJogador: 0,
  pontosComputador: 0,
  rodada: 1,
  historico: [], // rodadas jogadas
  terminou: false,
};

// Elementos da página- Guarda os elementos html para o js mexer depois
const pontosJogadorEl = document.querySelector("#pontos-jogador");
const pontosComputadorEl = document.querySelector("#pontos-computador");
const numeroRodadaEl = document.querySelector("#numero-rodada");
const maoJogadorEl = document.querySelector("#mao-jogador");
const maoComputadorEl = document.querySelector("#mao-computador");
const mensagemEl = document.querySelector("#mensagem");
const escolhasEl = document.querySelector("#escolhas");
const botaoReiniciar = document.querySelector("#botao-reiniciar");
const listaHistoricoEl = document.querySelector("#lista-historico");

// Lógica ----- Cria a procura de opção
function buscarOpcao(id) { //.find(...) percorre o array e devolve o primeiro que satisfaz
  return OPCOES.find((opcao) => opcao.id === id); // testa cada opção e devolve para o id
}

function escolhaDoComputador() {//sorteia a jogada do computador
  const indice = Math.floor(Math.random() * OPCOES.length);
  return OPCOES[indice];
}

// Retorna quem ganhou ou se foi empate
function decidirVencedor(jogador, computador) {
  if (jogador.id === computador.id) return "empate";
  if (jogador.vence === computador.id) return "jogador";
  return "computador";
}

function jogarRodada(idEscolha) { // roda cada vez que escolhe alguma opção  e faz a rodada acontecer
  if (estado.terminou) return;

  const jogador = buscarOpcao(idEscolha);
  const computador = escolhaDoComputador();
  const resultado = decidirVencedor(jogador, computador);

  if (resultado === "jogador") estado.pontosJogador++;
  if (resultado === "computador") estado.pontosComputador++;

  estado.historico.push({ rodada: estado.rodada, jogador, computador, resultado });
  estado.rodada++;

  mostrarRodada(jogador, computador, resultado);// mostra os emojjis
  atualizarPlacar();//escreve quantos pontos cada pessoa fez
  verificarFimDeJogo();//se o computador ou o jogador chegar a 3 pontos acaba
}

function verificarFimDeJogo() {
  if (estado.pontosJogador === PONTOS_PARA_VENCER) {
    terminarPartida(true);
  } else if (estado.pontosComputador === PONTOS_PARA_VENCER) {
    terminarPartida(false);
  }
}

function terminarPartida(jogadorVenceu) {// roda quando alguem ganha 
  estado.terminou = true;
  mensagemEl.textContent = jogadorVenceu
    ? "🏆 Você venceu a partida por " + estado.pontosJogador + " a " + estado.pontosComputador + "!"
    : "💀 O computador venceu por " + estado.pontosComputador + " a " + estado.pontosJogador + ".";
  mensagemEl.classList.add(jogadorVenceu ? "vitoria" : "derrota");
  botaoReiniciar.classList.remove("oculto");
  ativarBotoes(false);
}

function reiniciarPartida() { // Zera o estado por código, sem recarregar a página
 
  estado.pontosJogador = 0;
  estado.pontosComputador = 0;
  estado.rodada = 1;
  estado.historico = [];
  estado.terminou = false;

  maoJogadorEl.textContent = "❔";
  maoComputadorEl.textContent = "❔";
  limparClassesDasMaos();
  mensagemEl.textContent = "Faça sua escolha!";
  mensagemEl.classList.remove("vitoria", "derrota");
  botaoReiniciar.classList.add("oculto");
  listaHistoricoEl.textContent = "";
  ativarBotoes(true);
  atualizarPlacar();
}

// ----- Tela ------
function criarBotoesDeEscolha() {// cria os 3 botões
  for (const opcao of OPCOES) {
    const botao = document.createElement("button");
    botao.className = "botao-escolha";
    botao.dataset.id = opcao.id;

    const icone = document.createElement("span");
    icone.className = "icone";
    icone.textContent = opcao.icone;

    const nome = document.createElement("span");
    nome.textContent = opcao.nome;

    const tecla = document.createElement("span");
    tecla.className = "tecla";
    tecla.textContent = "tecla " + opcao.tecla;

    botao.append(icone, nome, tecla);
    botao.addEventListener("click", () => jogarRodada(opcao.id));
    escolhasEl.appendChild(botao);
  }
}

function ativarBotoes(ativos) {//ativa ou desativa os botões 
  for (const botao of escolhasEl.querySelectorAll(".botao-escolha")) {
    botao.disabled = !ativos;
  }
}

function limparClassesDasMaos() {//tira as cores da rodada anterior
  for (const mao of [maoJogadorEl, maoComputadorEl]) {
    mao.classList.remove("venceu", "perdeu", "empatou", "sacudindo");
  }
}

function mostrarRodada(jogador, computador, resultado) {//mostra o resultado
  maoJogadorEl.textContent = jogador.icone;
  maoComputadorEl.textContent = computador.icone;

  limparClassesDasMaos();
  void maoJogadorEl.offsetWidth; // reinicia a animação
  maoJogadorEl.classList.add("sacudindo");
  maoComputadorEl.classList.add("sacudindo");

  if (resultado === "empate") {
    maoJogadorEl.classList.add("empatou");
    maoComputadorEl.classList.add("empatou");
    mensagemEl.textContent = "Empate! Os dois escolheram " + jogador.nome.toLowerCase() + ".";
  } else if (resultado === "jogador") {
    maoJogadorEl.classList.add("venceu");
    maoComputadorEl.classList.add("perdeu");
    mensagemEl.textContent = jogador.nome + " vence " + computador.nome.toLowerCase() + ". Ponto seu!";
  } else {
    maoJogadorEl.classList.add("perdeu");
    maoComputadorEl.classList.add("venceu");
    mensagemEl.textContent = computador.nome + " vence " + jogador.nome.toLowerCase() + ". Ponto do computador.";
  }

  adicionarAoHistorico(estado.historico[estado.historico.length - 1]);
}

function adicionarAoHistorico(registro) {//coloca uma linha no historico mostrando o que aconteceu
  const textos = { jogador: "você ganhou", computador: "computador ganhou", empate: "empate" };
  const item = document.createElement("li");
  item.textContent =
    registro.jogador.icone + " x " + registro.computador.icone + " — " + textos[registro.resultado];
  listaHistoricoEl.appendChild(item);
}

function atualizarPlacar() {//escreve os numeros na tela
  pontosJogadorEl.textContent = estado.pontosJogador;
  pontosComputadorEl.textContent = estado.pontosComputador;
  numeroRodadaEl.textContent = estado.rodada;
}

botaoReiniciar.addEventListener("click", reiniciarPartida);//chama a função para reiniciar a partida

document.addEventListener("keydown", (evento) => {//faz as teclas funcionarem basicamente
  if (evento.key === "Enter" && estado.terminou) {
    reiniciarPartida();
    return;
  }
  const opcao = OPCOES.find((o) => o.tecla === evento.key);
  if (opcao) jogarRodada(opcao.id);
});

// ----- Início do jogo-----
criarBotoesDeEscolha();
atualizarPlacar();
