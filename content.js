// Obter dados da música que está tocando no YouTube Music (obterStatusMusica)
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "obterStatusMusica") {
    const tituloMusica = document.getElementsByClassName(
      "title style-scope ytmusic-player-bar"
    )[0].textContent;

    const infoMusica = document
      .getElementsByClassName("subtitle style-scope ytmusic-player-bar")[0]
      .textContent.split("•");

    const artistaMusica = infoMusica[0].trim();

    const albumMusica = infoMusica[1].trim();

    const anoMusica = infoMusica[2].trim();

    const tempoMusica = document.getElementsByClassName(
      "time-info style-scope ytmusic-player-bar"
    )[0].textContent;

    const arteAlbum = document
      .getElementById("thumbnail")
      .getElementsByTagName("img")[0].src;

    console.log(arteAlbumHQ);

    const dadosMusica = {
      tituloMusica,
      artistaMusica,
      albumMusica,
      anoMusica,
      tempoMusica,
      arteAlbum,
    };

    chrome.runtime.sendMessage({ musicaAtual: dadosMusica });
  }

  if (message.action === "getFila") {
    const fila = document.getElementsByTagName("ytmusic-player-queue-item");
    const lista = [];
    console.log(fila.length, "resultados");
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
        const dados = {
          titulo,
          artista,
          tempo,
        };
        lista.push(dados);
      }
    }
    console.log(lista);
    chrome.runtime.sendMessage({ fila: lista });
  }
});
