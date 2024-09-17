import React from 'react';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { Servico } from '../../pages/Servicos/ServicosPage';

interface ModalDelecaoProps {
  title: string;
  item: string;
  futureServicos?: Servico[];
  modalVisible: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
}

function ModalDelecao(props: ModalDelecaoProps) {
  const { title, item, futureServicos, modalVisible, handleConfirm, handleCancel } = props;
  return (
    <Modal
      title={title}
      open={modalVisible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="Confirmar"
      cancelText="Cancelar"
    >
      {futureServicos && futureServicos.length > 0 ? (
        <>
          <h3>Ao confirmar, o {item} será retirado dos seguintes serviços:</h3>
          <ul style={{ listStyle: 'none' }}>
            {futureServicos.map(servico => (
              <li key={servico.id}>
                {`${servico.nomeCliente}: ${dayjs(servico.dataInicio).format('DD/MM/YYYY')} > ${dayjs(servico.dataTermino).format('DD/MM/YYYY')}`}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
        </>
      )}
    </Modal>
  );
};

export default ModalDelecao;
