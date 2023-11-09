let filaGlobal = [];

// Obter dados da música que está tocando no YouTube Music (obterStatusMusica)
chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.action === "obterStatusMusica") {
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

    await chrome.runtime.sendMessage({ musicaAtual: dadosMusica });
  }

  if (message.action === "getFila") {
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

        const playButton = musica.getElementsByTagName(
          "ytmusic-play-button-renderer"
        );

        const dados = {
          titulo,
          artista,
          tempo,
          play: () => playButton[0].click(),
        };

        lista.push(dados);
      }
    }
    filaGlobal = lista;
    await chrome.runtime.sendMessage({ fila: lista });
  }

  if (message.action === "tocarMusica") {
    filaGlobal[message.index].play();
    await chrome.runtime.sendMessage({ status: "ok" });
  }
});
