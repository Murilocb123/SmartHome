import { useEffect, useState } from "react";
import io from 'socket.io-client';
import './style.css';
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Message } from "primereact/message";

export default function Cozinha() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: false,
        geladeiraOn: false,
        geladeiraTemp: 0,
        fogaoOn: false,
        fogaoPotencia: 0
    }

    interface EstadoLuz {
        luzOn: boolean,
    }

    interface EstadoGeladeira {
        geladeiraOn: boolean,
    }

    interface EstadoFogao {
        fogaoOn: boolean,
    }

    interface EstadoGeladeiraTemp {
        geladeiraTemp: number
    }

    interface EstadoFogaoPotencia {
        fogaoPotencia: number
    }


    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
        luzOn: false,
        geladeiraOn: false,
        geladeiraTemp: 0,
        fogaoOn: false,
        fogaoPotencia: 0
    });

    const [estadoLuz, setEstadoLuz] = useState<EstadoLuz>({
        luzOn: false
    });

    const [estadoGeladeira, setEstadoGeladeira] = useState<EstadoGeladeira>({
        geladeiraOn: false
    });

    const [estadoGeladeiraTemp, setEstadoGeladeiraTemp] = useState<EstadoGeladeiraTemp>({
        geladeiraTemp: 0
    });

    const [estadoFogao, setEstadoFogao] = useState<EstadoFogao>({
        fogaoOn: false
    });

    const [estadoFogaoPotencia, setEstadoFogaoPotencia] = useState<EstadoFogaoPotencia>({
        fogaoPotencia: 0
    });



    //conectar ao backend e receber o estado inicial
    useEffect(() => {
        socket.on('acenderLuzCozinha', (novoEstado: EstadoLuz) => {
            setEstadoLuz(novoEstado);
        });
        socket.on('ligarGeladeiraCozinha', (novoEstado: EstadoGeladeira) => {
            setEstadoGeladeira(novoEstado);
        });
        socket.on('ligarFogaoCozinha', (novoEstado: EstadoFogao) => {
            setEstadoFogao(novoEstado);
        });
        socket.on('alterarTemperaturaGeladeira', (novaTemperatura: EstadoGeladeiraTemp) => {
            setEstadoGeladeiraTemp(novaTemperatura);
        });
        socket.on('alterarPotenciaFogao', (novaPotencia: EstadoFogaoPotencia) => {
            setEstadoFogaoPotencia(novaPotencia);
        });
        socket.on('estadoInicialCozinha', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
            setEstadoLuz({ luzOn: estadoInicial.luzOn });
            setEstadoGeladeira({ geladeiraOn: estadoInicial.geladeiraOn });
            setEstadoGeladeiraTemp({ geladeiraTemp: estadoInicial.geladeiraTemp });
            setEstadoFogao({ fogaoOn: estadoInicial.fogaoOn });
            setEstadoFogaoPotencia({ fogaoPotencia: estadoInicial.fogaoPotencia});
        });

        return () => {
            socket.off('estadoInicialCozinha');
            socket.off('acenderLuzCozinha');
            socket.off('ligarGeladeiraCozinha');
            socket.off('ligarFogaoCozinha');
            socket.off('alterarTemperaturaGeladeira');
            socket.off('alterarPotenciaFogao');
        }
    }, []);

    //funcao para alterar o estado dos dispositivo
    const ligarLuz = () => {
        socket.emit('acenderLuzCozinha');
    }
    const ligarGeladeira = () => {
        socket.emit('ligarGeladeiraCozinha');
    }
    const ligarFogao = () => {
        socket.emit('ligarFogaoCozinha');
    }
    const alterarTemperaturaGeladeira = (novaTemperatura: number) => {
        socket.emit('alterarTemperaturaGeladeira', novaTemperatura);
    }
    const alterarPotenciaFogao = (novaPotencia: number) => {
        socket.emit('alterarPotenciaFogao', novaPotencia);
    }

    const footerCard = (action: { estado: boolean, function: any}) => {

        let button: any;
        if (!action.estado) {
            button = (
                <Button label='On' severity='success' onClick={action.function} />

            )
        } else {
            button = (
                <Button label='Off' severity='danger' onClick={action.function} />
            )
        }
        return button;
    }


    return (
        <div className='flex flex-wrap justify-content-center gap-5'>
            <Card title="Luz" footer={footerCard({ estado: estadoLuz.luzOn, function: ligarLuz })}
                className="flex md:w-25rem justify-content-center align-content-center	text-center shadow-7" >
                <img alt="Card" src={estadoLuz.luzOn ? 'img/lampada-on.png' : 'img/lampada-off.png'} className={
                    estadoLuz.luzOn ? 'fadein animation-duration-200 card-img' : 'card-img'
                } />

            </Card>
            <Card title="Geladeira" footer={footerCard({ estado: estadoGeladeira.geladeiraOn, function: ligarGeladeira })}
                className="flex md:w-25rem justify-content-center align-content-center	text-center shadow-7" >
                    
                <Message severity="warn" text="Temperatura acima de 5℃" className={
                    estadoGeladeiraTemp.geladeiraTemp > 5 ? 'fadein animation-duration-200 mb-2' : 'hidden'} />
                <img alt="Card" src={estadoGeladeira.geladeiraOn ? 'img/geladeira-on.png' : 'img/geladeira-off.png'} className={
                    estadoGeladeira.geladeiraOn ? 'fadein animation-duration-200 card-img' : 'card-img'
                } />
                <div className='flex justify-content-center'>
                    <InputNumber value={estadoGeladeiraTemp.geladeiraTemp}  disabled={true} suffix="℃"/>
                </div>
            </Card>
            <Card title="Fogão" footer={footerCard({ estado: estadoFogao.fogaoOn, function: ligarFogao })}
                className="flex md:w-25rem justify-content-center align-content-center	text-center shadow-7" >
                <img alt="Card" src={estadoFogao.fogaoOn ? 'img/fogao-on.png' : 'img/fogao-off.png'} className={
                    estadoFogao.fogaoOn ? 'fadein animation-duration-200 card-img' : 'card-img'
                } />
                <div className='flex justify-content-center'>
                    <InputNumber value={estadoFogao.fogaoOn?estadoFogaoPotencia.fogaoPotencia:null} onValueChange={(e: InputNumberValueChangeEvent) => alterarPotenciaFogao(e.value ?? 0)}
                     mode="decimal" showButtons min={1} max={5} disabled={!estadoFogao.fogaoOn} placeholder="Potência"/>
                </div>
            </Card>
        </div>
    )
}