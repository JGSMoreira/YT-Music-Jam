import asyncio
import websockets

# Lista para armazenar todas as conexões ativas
conexoes = set()


async def handler(websocket, path):
    print(f"Nova conexão estabelecida: {path}")

    # Adiciona a nova conexão à lista
    conexoes.add(websocket)

    try:
        while True:
            # Aguarde mensagens do cliente
            mensagem = await websocket.recv()
            print(f"Recebido de {path}: {mensagem}")

            # Envie a mensagem para todos os outros clientes
            for conexao in conexoes:
                if conexao != websocket:
                    await conexao.send(f"{path}: {mensagem}")

    except websockets.exceptions.ConnectionClosed:
        print(f"Conexão fechada por {path}")
        # Remove a conexão fechada da lista
        conexoes.remove(websocket)


async def main():
    # Inicie o servidor WebSocket
    server = await websockets.serve(handler, "localhost", 8765)
    print("Servidor WebSocket iniciado em ws://localhost:8765")

    # Mantenha o servidor em execução
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
