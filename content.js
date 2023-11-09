let filaGlobal = [];

function obterStatusMusica() {
  const tituloMusica = document.getElementsByClassName(
    "title style-scope ytmusic-player-bar"
  )[0].textContent;

  const tempoMusica = document.getElementsByClassName(
    "time-info style-scope ytmusic-player-bar"
  )[0].textContent;

  const arteAlbum = document
    .getElementById("thumbnail")
    .getElementsByTagName("img")[0].src;

  const infoMusica = document
    .getElementsByClassName("subtitle style-scope ytmusic-player-bar")[0]
    .textContent.split("•");

  const estaTocando = estaTocandoF();


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
    estaTocando,
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
}

function tocarMusica(index) {
  filaGlobal[index].play();
}

function estaTocandoF() {
  if (document.getElementById("play-pause-button").getAttribute("title") == "Pausar") {
    return true;
  } else {
    return false;
  }
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
