import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './ListaServicos.styles';
import { Button, Drawer, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Servico } from '../../ServicosPage';
import { saveAs } from 'file-saver';

dayjs.extend(isBetween);

interface ListaServicosProps {
    selectedValue: Dayjs;
    openListaServicos: boolean;
    setOpenListaServicos: Dispatch<SetStateAction<boolean>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
}

function ListaServicos(props: ListaServicosProps) {
    const {listaServico, setListaServico, openListaServicos, setOpenListaServicos, selectedValue} = props;
    const dataSelecionada = selectedValue.format('DD/MM/YYYY');

    const downloadEscala = () => {
        let escalaContent = `Escala do dia: ${dataSelecionada}\n----------------------------------------------------\n`;
    
        const filteredServicos = listaServico.filter(servico => {
            const dataInicio = dayjs(servico.dataInicio);
            const dataTermino = servico.dataTermino ? dayjs(servico.dataTermino).endOf('day') : dataInicio;
    
            return selectedValue.isBetween(dataInicio, dataTermino, null, '[]');
        });
    
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
            <Drawer title={dataSelecionada} onClose={() => setOpenListaServicos(false)} open={openListaServicos}         extra={
          <Space>
            <Button type="primary" onClick={downloadEscala}>
              Baixar Escala
            </Button>
          </Space>
        }></Drawer>
        </styled.ListaServicosContainer>
    );
}

export default ListaServicos;