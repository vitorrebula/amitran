package com.example.todosimple.services;

import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todosimple.models.Funcionario;
import com.example.todosimple.models.Servico;
import com.example.todosimple.models.Veiculo;
import com.example.todosimple.repositories.FuncionarioRepository;
import com.example.todosimple.repositories.ServicoRepository;
import com.example.todosimple.repositories.VeiculoRepository;

import jakarta.transaction.Transactional;

@Service
public class ServicoService {
    
    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    public Servico findById(Long id) {
        Optional<Servico> servico = this.servicoRepository.findById(id);
        return servico.orElseThrow(() -> new RuntimeException(
            "Servico não encontrado para o ID: " + id
        ));
    }

    public List<Servico> findAll() {
        return servicoRepository.findAll();
    }

    @Transactional
    public Servico create(Servico obj) {
        obj.setId(null);
        obj = this.servicoRepository.save(obj);
        return obj;
    }

    @Transactional
    public Servico update(Servico obj) {
        Servico newObj = findById(obj.getId());
        newObj.setNomeCliente(obj.getNomeCliente());
        newObj.setEnderecoOrigem(obj.getEnderecoOrigem());
        newObj.setEnderecoEntrega(obj.getEnderecoEntrega());
        newObj.setDataInicio(obj.getDataInicio());
        newObj.setDataTermino(obj.getDataTermino());
        newObj.setValor(obj.getValor());
        newObj.setDescricao(obj.getDescricao());
        newObj.setFuncionarios(obj.getFuncionarios());
        newObj.setVeiculos(obj.getVeiculos());
        return this.servicoRepository.save(newObj);
    }

    public void delete(Long id) {
        findById(id);
        try {
            this.servicoRepository.deleteById(id);
        } catch(Exception e) {
            throw new RuntimeException("Não é possível excluir o serviço pois há entidades relacionadas!");
        }
    }

    public Servico addFuncionarioToServico(Long servicoId, Long funcionarioId) {
        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
            .orElseThrow(() -> new RuntimeException("Funcionario não encontrado com ID: " + funcionarioId));
        
        Servico servico = findById(servicoId);
        servico.getFuncionarios().add(funcionario);

        return servicoRepository.save(servico);
    }

    public Servico addVeiculoToServico(Long servicoId, String veiculoId) {
        Veiculo veiculo = veiculoRepository.findById(veiculoId)
            .orElseThrow(() -> new RuntimeException("Veiculo não encontrado com Placa: " + veiculoId));
        
        Servico servico = findById(servicoId);
        servico.getVeiculos().add(veiculo);

        return servicoRepository.save(servico);
    }
}