import { useEffect, useState } from "react";

import './style.css';
import io from 'socket.io-client';
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";

export default function Sala() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: boolean,
        tvOn: boolean,
        numeroCanal: number,
        arTemp: number,
        arOn: boolean
    }

    interface EstadoLuz {
        luzOn: boolean,
    }

    interface EstadoTv {
        tvOn: boolean
    }

    interface EstadoCanal {
        numeroCanal: number
    }

    interface EstadoAr {
        arOn: boolean
    }

    interface EstadoArTemp {
        arTemp: number
    }

    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
        luzOn: false,
        tvOn: false,
        arTemp: 0,
        arOn: false,
        numeroCanal: 0
    });

    const [estadoTv, setEstadoTv] = useState<EstadoTv>({
        tvOn: false
    });

    const [estadoCanal, setEstadoCanal] = useState<EstadoCanal>({
        numeroCanal: 0
    });


    const [estadoAr, setEstadoAr] = useState<EstadoAr>({
        arOn: false
    });

    const [estadoArTemp, setEstadoArTemp] = useState<EstadoArTemp>({
        arTemp: 0
    });

    const [estadoLuz, setEstadoLuz] = useState<EstadoLuz>({
        luzOn: false
    });



    //conectar ao backend e receber o estado inicial
    useEffect(() => {
        socket.on('ligarTvSala', (novoEstado: EstadoTv) => {
            setEstadoTv(novoEstado);
        });
        socket.on('ligarArSala', (novoEstado: EstadoAr) => {
            setEstadoAr(novoEstado);
        });
        socket.on('acenderLuzSala', (novoEstado: EstadoLuz) => {
            setEstadoLuz(novoEstado);
        });
        socket.on('alterarCanal', (novoEstado: EstadoCanal) => {
            setEstadoCanal(novoEstado);
        });
        socket.on('alterarTemperatura', (novoEstado: EstadoArTemp) => {
            setEstadoArTemp(novoEstado);
        });
        socket.on('estadoInicialSala', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
            setEstadoTv({ tvOn: estadoInicial.tvOn });
            setEstadoAr({ arOn: estadoInicial.arOn });
            setEstadoLuz({ luzOn: estadoInicial.luzOn });
            setEstadoCanal({ numeroCanal: estadoInicial.numeroCanal });
            setEstadoArTemp({ arTemp: estadoInicial.arTemp});
        });

        return () => {
            socket.off('estadoInicialSala');
            socket.off('ligarTvSala');
            socket.off('ligarArSala');
            socket.off('acenderLuzSala');
            socket.off('alterarCanal');
            socket.off('alterarTemperatura');
        }
    }, []);

    //funcao para alterar o estado dos dispositivo
    const ligarTv = () => {
        socket.emit('ligarTvSala');
    }
    const ligarAr = () => {
        socket.emit('ligarArSala');
    }
    const ligarLuz = () => {
        socket.emit('acenderLuzSala');
    }
    const alterarCanal = (numero: number) => {
        socket.emit('alterarCanal', numero);
    }
    const alterarTemperatura = (temperatura: number) => {
        socket.emit('alterarTemperatura', temperatura);
    }

    const footerCard = (action: { estado: boolean, function: any }) => {

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
            <Card title="TV" footer={footerCard({ estado: estadoTv.tvOn, function: ligarTv })}
                className="flex md:w-25rem justify-content-center align-content-center	text-center shadow-7">
                <div>
                    <img alt="Card" src={estadoTv.tvOn ? 'img/tv-on.png' : 'img/tv-off.png'} className={
                        estadoTv.tvOn ? 'fadein animation-duration-200 card-img' : 'card-img'
                    } />
                </div>
                <div>
                    <Dropdown disabled={!estadoTv.tvOn} value={estadoTv.tvOn ? estadoCanal.numeroCanal : null}
                        options={[{ label: 'Globo', value: 1 }, { label: 'SBT', value: 2 }, { label: 'Record', value: 3 }]}
                        onChange={(e) => alterarCanal(e.value)} placeholder="Selecione o canal" />
                </div>
            </Card>
            <Card title="Ar Condicionado" footer={footerCard({ estado: estadoAr.arOn, function: ligarAr })}
                className="flex md:w-25rem justify-content-center align-content-center	text-center shadow-7" >
                <div>
                    <img alt="Card" src={estadoAr.arOn ? 'img/ar-condicionado-on.png' : 'img/ar-condicionado-off.png'} className={
                        estadoAr.arOn ? 'fadein animation-duration-200 card-img' : 'card-img'
                    } />
                </div>
                <div>
                    <InputNumber disabled={!estadoAr.arOn} value={estadoAr.arOn?estadoArTemp.arTemp: null}
                        onValueChange={(e: InputNumberValueChangeEvent) => alterarTemperatura(e.value ?? 18)} showButtons buttonLayout="horizontal" step={1}
                        decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                        suffix=" ℃" min={18} max={30} placeholder="Temperatura"/>
                </div>

            </Card>
        </div>
    )
}