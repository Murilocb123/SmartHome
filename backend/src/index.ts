import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
//criar servidor http
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", //URL do Front-End React
        methods: ["GET", "POST"],
    }
});

//estado inicial dos dispositivos
let dispositivosSala = {
    luzOn: false,
    tvOn: false,
    arOn: false,
    numeroCanal: 0,
    arTemp: 0
}
let dispositivosCozinha = {
    luzOn: false,
    geladeiraOn: false,
    geladeiraTemp: 0,
    fogaoOn: false,
    fogaoPotencia: 0
}
let dispositivosQuarto = {
    luzOn: false,
    ventiladorOn: false,
    ventiladorVelocidade: 0,
    cortinasOn: false
}

//escuta os eventos de conexao do socket
io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id)

    //enviando o estado inicial dos dispositivos para o cliente
    socket.emit('estadoInicialSala', dispositivosSala);
    socket.emit('estadoInicialCozinha', dispositivosCozinha);
    socket.emit('estadoInicialQuarto', dispositivosQuarto);


    //manipulando os eventos e mudançcas do estado dos dispositivos
    // ---------------sala---------------
    socket.on('acenderLuzSala', () => {
        dispositivosSala.luzOn = !dispositivosSala.luzOn;
        io.emit('acenderLuzSala', dispositivosSala);
    });
    socket.on('ligarTvSala', () => {
        dispositivosSala.tvOn = !dispositivosSala.tvOn;
        io.emit('ligarTvSala', dispositivosSala);
    });
    socket.on('ligarArSala', () => {
        dispositivosSala.arOn = !dispositivosSala.arOn;
        io.emit('ligarArSala', dispositivosSala);
    });
    socket.on('alterarCanal', (numero: number) => {
        dispositivosSala.numeroCanal = numero;
        io.emit('alterarCanal', dispositivosSala);
    });
    socket.on('alterarTemperatura', (temp: number) => {
        dispositivosSala.arTemp = temp;
        io.emit('alterarTemperatura', dispositivosSala);
    });

    // ---------------cozinha---------------
    socket.on('acenderLuzCozinha', () => {
        dispositivosCozinha.luzOn = !dispositivosCozinha.luzOn;
        console.log(dispositivosCozinha.luzOn);
        io.emit('acenderLuzCozinha', dispositivosCozinha);
    });

    socket.on('ligarGeladeiraCozinha', () => {
        dispositivosCozinha.geladeiraOn = !dispositivosCozinha.geladeiraOn;
        io.emit('ligarGeladeiraCozinha', dispositivosCozinha);
        if (dispositivosCozinha.geladeiraOn) {
            enviarTemperaturaGeladeira();
        } else {
            dispositivosCozinha.geladeiraTemp = 0;
            io.emit('alterarTemperaturaGeladeira', dispositivosCozinha);
        }
    });



    async function enviarTemperaturaGeladeira() {
        let verificacao = Math.random() - 0.2;
        console.log(verificacao);
        console.log(dispositivosCozinha.geladeiraTemp);
        console.log(dispositivosCozinha.geladeiraOn);
        while (dispositivosCozinha.geladeiraOn) {
            const isSoma = Math.random() > verificacao;
            if (isSoma) {
                dispositivosCozinha.geladeiraTemp += 1;
            } else {
                dispositivosCozinha.geladeiraTemp -= 1;
            }   
            if (dispositivosCozinha.geladeiraTemp > 20) {
                verificacao = Math.random();
            } else if (dispositivosCozinha.geladeiraTemp < -10) {
                verificacao = Math.random() - 0.2;
            }
            dispositivosCozinha.geladeiraTemp;
            console.log(dispositivosCozinha.geladeiraTemp);
            io.emit('alterarTemperaturaGeladeira', dispositivosCozinha);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }



    socket.on('ligarFogaoCozinha', () => {
        dispositivosCozinha.fogaoOn = !dispositivosCozinha.fogaoOn;
        io.emit('ligarFogaoCozinha', dispositivosCozinha);
    });

    socket.on('alterarPotenciaFogao', (potencia: number) => {
        dispositivosCozinha.fogaoPotencia = potencia;
        io.emit('alterarPotenciaFogao', dispositivosCozinha);
    });

    socket.on('alterarTemperaturaGeladeira', (temp: number) => {
        dispositivosCozinha.geladeiraTemp = temp;
        io.emit('alterarTemperaturaGeladeira', dispositivosCozinha);
    });

    // ---------------quarto---------------
    socket.on('acenderLuzQuarto', () => {
        dispositivosQuarto.luzOn = !dispositivosQuarto.luzOn;
        io.emit('acenderLuzQuarto', dispositivosQuarto);
    });

    socket.on('ligarVentiladorQuarto', () => {
        dispositivosQuarto.ventiladorOn = !dispositivosQuarto.ventiladorOn;
        io.emit('ligarVentiladorQuarto', dispositivosQuarto);
    });

    socket.on('ligarCortinasQuarto', () => {
        dispositivosQuarto.cortinasOn = !dispositivosQuarto.cortinasOn;
        io.emit('ligarCortinasQuarto', dispositivosQuarto);
    });

    socket.on('alterarVelocidadeVentilador', (velocidade: number) => {
        dispositivosQuarto.ventiladorVelocidade = velocidade;
        io.emit('alterarVelocidadeVentilador', dispositivosQuarto);
    });
});


//Iniciar Servidor npm start
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});