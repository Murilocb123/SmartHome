import io from 'socket.io-client';
import { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';



export default function Quarto() {
      const socket = io('http://localhost:4000');

      interface EstadoInicial {
            luzOn: false,
            ventiladorOn: false,
            ventiladorVelocidade: 0,
            cortinasOn: false
      }

      interface EstadoLuz {
            luzOn: boolean,
      }

      interface EstadoVentilador {
            ventiladorOn: boolean
      }

      interface EstadoCortinas {
            cortinasOn: boolean
      }

      interface EstadoVentiladorVelocidade {
            ventiladorVelocidade: number
      }


      const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
            luzOn: false,
            ventiladorOn: false,
            ventiladorVelocidade: 0,
            cortinasOn: false
      });

      const [estadoLuz, setEstadoLuz] = useState<EstadoLuz>({
            luzOn: false
      });

      const [estadoVentilador, setEstadoVentilador] = useState<EstadoVentilador>({
            ventiladorOn: false
      });

      const [estadoCortinas, setEstadoCortinas] = useState<EstadoCortinas>({
            cortinasOn: false
      });

      const [estadoVentiladorVelocidade, setEstadoVentiladorVelocidade] = useState<EstadoVentiladorVelocidade>({
            ventiladorVelocidade: 0
      });



      //conectar ao backend e receber o estado inicial
      useEffect(() => {
            socket.on('acenderLuzQuarto', (novoEstado: EstadoLuz) => {
                  setEstadoLuz(novoEstado);
            });
            socket.on('ligarVentiladorQuarto', (novoEstado: EstadoVentilador) => {
                  setEstadoVentilador(novoEstado);
            });

            socket.on('ligarCortinasQuarto', (novoEstado: EstadoCortinas) => {
                  setEstadoCortinas(novoEstado);
            });

            socket.on('alterarVelocidadeVentilador', (novoEstado: EstadoVentiladorVelocidade) => {
                  setEstadoVentiladorVelocidade(novoEstado);
            });

            socket.on('estadoInicialQuarto', (estadoInicial: EstadoInicial) => {
                  setEstadoInicial(estadoInicial);
                  setEstadoLuz({ luzOn: estadoInicial.luzOn });
                  setEstadoVentilador({ ventiladorOn: estadoInicial.ventiladorOn });
                  setEstadoCortinas({ cortinasOn: estadoInicial.cortinasOn });
                  setEstadoVentiladorVelocidade({ ventiladorVelocidade: estadoInicial.ventiladorVelocidade });
            });

            return () => {
                  socket.off('estadoInicialQuarto');
                  socket.off('acenderLuzQuarto');
                  socket.off('ligarGeladeiraCozinha');
                  socket.off('ligarFogaoCozinha');
                  socket.off('alterarTemperaturaGeladeira');
                  socket.off('alterarPotenciaFogao');
            }
      }, []);

      //funcao para alterar o estado dos dispositivo
      const ligarLuz = () => {
            socket.emit('acenderLuzQuarto');
      }

      const ligarVentilador = () => {
            socket.emit('ligarVentiladorQuarto');
      }

      const ligarCortinas = () => {
            socket.emit('ligarCortinasQuarto');
      }

      const alterarVelocidadeVentilador = (velocidade: number) => {
            socket.emit('alterarVelocidadeVentilador', velocidade);
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
                  <Card title="Ventilador" footer={footerCard({ estado: estadoVentilador.ventiladorOn, function: ligarVentilador })}
                        className="flex md:w-25rem justify-content-center align-content-center	text-center shadow-7">
                        <img alt="Card" src={estadoVentilador.ventiladorOn ? 'img/ventilador-on.png' : 'img/ventilador-off.png'} className={
                              estadoVentilador.ventiladorOn ? 'fadein animation-duration-200 card-img' : 'card-img'
                        } />
                        <div className='flex flex-col gap-5'>
                              <InputNumber value={estadoVentilador.ventiladorOn ? estadoVentiladorVelocidade.ventiladorVelocidade: null} placeholder='Velocidade'
                              disabled={!estadoVentilador.ventiladorOn} 
                              onValueChange={(e: InputNumberValueChangeEvent) => alterarVelocidadeVentilador(e.value ?? 0)} mode="decimal" min={1} max={3} step={1}
                              showButtons />
                        </div>
                  </Card>

                  <Card title="Cortinas" footer={footerCard({ estado: estadoCortinas.cortinasOn, function: ligarCortinas })}
                        className="flex md:w-25rem justify-content-center align-content-center	text-center shadow-7" >
                        <img alt="Card" src={estadoCortinas.cortinasOn ? 'img/cortinas-on.png' : 'img/cortinas-off.png'} className={
                              estadoCortinas.cortinasOn ? 'fadein animation-duration-200 card-img' : 'card-img'
                        } />
                  </Card>
            </div>
      )
}
