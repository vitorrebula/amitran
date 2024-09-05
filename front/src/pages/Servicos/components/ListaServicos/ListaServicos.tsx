import React, { Dispatch, SetStateAction, useMemo } from 'react';
import * as styled from './ListaServicos.styles';
import { Button, Drawer, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Servico } from '../../ServicosPage';
import { saveAs } from 'file-saver';
import { CardServicos } from './CardServicos';
import { Funcionario } from '../../../Funcionarios/Funcionarios';
import { Veiculo } from '../../../Veiculos/Veiculos';

dayjs.extend(isBetween);

interface ListaServicosProps {
    selectedValue: Dayjs;
    openListaServicos: boolean;
    setOpenListaServicos: Dispatch<SetStateAction<boolean>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    listaFuncionario: Funcionario[];
    listaVeiculo: Veiculo[];
}

function ListaServicos(props: ListaServicosProps) {
    const { listaServico, setListaServico, openListaServicos, setOpenListaServicos, selectedValue, listaFuncionario, listaVeiculo } = props;
    const dataSelecionada = selectedValue.format('DD/MM/YYYY');

    const filteredServicos = useMemo(() => {
        return listaServico.filter(servico => {
            const dataInicio = dayjs(servico.dataInicio);
            const dataTermino = dayjs(servico.dataTermino).endOf('day');
    
            return selectedValue.isBetween(dataInicio, dataTermino, null, '[]');
        });
    }, [listaServico, selectedValue]);

    const downloadEscala = () => {
        let escalaContent = `Escala do dia: ${dataSelecionada}\n----------------------------------------------------\n`;

        filteredServicos.forEach(servico => {
            const funcionarios = servico.funcionarios
                .map(f => `${f.cargo}: ${f.username}`)
                .join('\n');

            const veiculos = servico.veiculos?.map(v => v.placa).join(', ') || '';

            escalaContent += `Serviço: ${servico.nomeCliente}\n`;
            escalaContent += `Origem: ${servico.enderecoOrigem}\n`;
            escalaContent += `Destino: ${servico.enderecoEntrega}\n\n`;
            escalaContent += `Equipe:\n${funcionarios}\n\n`;
            escalaContent += `Veículo(s): ${veiculos}\n\n`;
            escalaContent += `Obs: ${servico.descricao || ''}\n\n`;
            escalaContent += '----------------------------------------------------\n';
        });

        const blob = new Blob([escalaContent], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `escala_${dataSelecionada}.txt`);
    };

    return (
        <styled.ListaServicosContainer>
            <Drawer
                title={dataSelecionada}
                onClose={() => setOpenListaServicos(false)}
                open={openListaServicos}
                extra={
                    <Space>
                        <Button type="primary" onClick={downloadEscala}>
                            Baixar Escala
                        </Button>
                    </Space>
                }
            >
                {filteredServicos.length > 0 ? (
                    <CardServicos
                        listaServico={listaServico}
                        setListaServico={setListaServico}
                        servicos={filteredServicos}
                        selectedValue={selectedValue}
                        listaVeiculo={listaVeiculo}
                        listaFuncionario={listaFuncionario}
                    />
                ) : (
                    <h3 style={{textAlign: 'center'}}>Não há serviços cadastrados na data Selecionada</h3>
                )}
            </Drawer>
        </styled.ListaServicosContainer>
    );
}

export default ListaServicos;
