let filaGlobal = [];

const observerEstaTocando = new MutationObserver(function (mutations) {
  for (let mutation of mutations) {
    if (mutation.type === "attributes") {
      if (mutation.attributeName === "title") {
        const target = mutation.target;
        chrome.runtime.sendMessage({
          estaTocando: target.getAttribute("title"),
        });
      }
    }
  }
});

const observerTempo = new MutationObserver(function (mutations) {
  mutations.forEach(async (mutation) => {
    if (mutation.type === "characterData") {
      const target = mutation.target;
      await chrome.runtime.sendMessage({
        tempoMusica: target.textContent,
      });
    }
  });
});

observerEstaTocando.observe(document.getElementById("play-pause-button"), {
  attributes: true,
  childList: true,
});

observerTempo.observe(
  document.querySelector(".time-info.style-scope.ytmusic-player-bar"),
  {
    childList: true,
    subtree: true,
    characterData: true,
  }
);

function obterStatusMusica() {
  const tituloMusica = document.getElementsByClassName(
    "title style-scope ytmusic-player-bar"
  )[0].textContent;

  const tempoMusica = document.getElementsByClassName(
    "time-info style-scope ytmusic-player-bar"
  )[0].textContent;

  const arteAlbumSrc = document
    .getElementById("thumbnail")
    .getElementsByTagName("img")[0].src;

  const arteAlbum = arteAlbumSrc.includes("data:")
    ? document.getElementsByClassName("image style-scope ytmusic-player-bar")[0]
        .src
    : arteAlbumSrc;

  const infoMusica = document
    .getElementsByClassName("subtitle style-scope ytmusic-player-bar")[0]
    .textContent.split("•");

  const artistaMusica = infoMusica[0]?.trim();

  const albumMusica = infoMusica[1]?.trim();

  const anoMusica = infoMusica[2]?.trim();

  const dadosMusica = {
    tituloMusica,
    artistaMusica,
    albumMusica,
    anoMusica,
    tempoMusica,
    arteAlbum,
  };

  return { musicaAtual: dadosMusica };
}

function getFila() {
  const fila = document.getElementsByTagName("ytmusic-player-queue-item");
  const lista = [];

  for (let i = 0; i < fila.length; i++) {
    if (i % 2 === 0) {
      const musica = fila[i];

      const titulo = musica.getElementsByClassName(
        "song-title style-scope ytmusic-player-queue-item"
      )[0].textContent;

      const artista = musica.getElementsByClassName(
        "byline style-scope ytmusic-player-queue-item"
      )[0].textContent;

      const tempo = musica.getElementsByClassName(
        "duration style-scope ytmusic-player-queue-item"
      )[0].textContent;

      const playMusicButton = musica.getElementsByTagName(
        "ytmusic-play-button-renderer"
      );

      const dados = {
        titulo,
        artista,
        tempo,
        play: () => playMusicButton[0].click(),
      };

      lista.push(dados);
    }
  }
  filaGlobal = lista;
  return { fila: lista };
}

function playPause() {
  const playPauseMusicButton = document.getElementById("play-pause-button");
  playPauseMusicButton.click();
  enviarMensagemParaServidor("Música pausada/retomada");
}

function tocarMusica(index) {
  enviarMensagemParaServidor(
    `Tocando ${filaGlobal[index].titulo} de ${filaGlobal[index].artista}`
  );
  filaGlobal[index].play();
}

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  const actions = {
    obterStatusMusica: () => obterStatusMusica(),
    playPause: () => playPause(),
    getFila: () => getFila(),
    tocarMusica: (index) => tocarMusica(index),
  };

  if (message.action) {
    const action = actions[message.action];
    if (action) {
      const result = message.index
        ? await action(message.index)
        : await action();
      await chrome.runtime.sendMessage({ ...result });
    }
  }
});

// Estabelece uma conexão com o script de extensão
const port = chrome.runtime.connect({ name: "content-script" });

// Listener para mensagens enviadas do script de extensão
port.onMessage.addListener(function (msg) {
  console.log("Recebido do script de extensão:", msg);
});

// Função para enviar mensagens para o servidor WebSocket
function enviarMensagemParaServidor(mensagem) {
  // Substitua a URL do WebSocket pelo seu servidor WebSocket
  const wsURL = "ws://localhost:8765/extensao";
  const ws = new WebSocket(wsURL);

  ws.onopen = function (event) {
    ws.send(mensagem);
  };

  ws.onmessage = function (event) {
    // Envia a mensagem recebida para o script de extensão
    port.postMessage({ mensagem: event.data });
  };
}
