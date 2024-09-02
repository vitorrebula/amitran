package com.example.todosimple.services;

import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todosimple.models.Servico;
import com.example.todosimple.models.Veiculo;
import com.example.todosimple.repositories.ServicoRepository;
import com.example.todosimple.repositories.VeiculoRepository;

import jakarta.transaction.Transactional;

@Service
public class VeiculoService {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    public Veiculo findByPlaca(String placa) {
        Optional<Veiculo> veiculo = this.veiculoRepository.findById(placa);
        return veiculo.orElseThrow(() -> new RuntimeException(
                "Veiculo não foi encontrado! Placa: " + placa + ", tipo: " + Veiculo.class.getName()));
    }
    
    public List<Veiculo> findAllV(){
        return veiculoRepository.findAll();
    }

    @Transactional
    public Veiculo create(Veiculo obj) {
        obj = this.veiculoRepository.save(obj);
        return obj;
    }

    @Transactional
    public Veiculo update(Veiculo obj) {
        Veiculo novoObj = findByPlaca(obj.getPlaca());
        novoObj.setPlaca(obj.getPlaca());
        novoObj.setTipoVeiculo(obj.getTipoVeiculo());
        novoObj.setStatus(obj.getStatus());
        novoObj.setModelo(obj.getModelo());
        novoObj.setServicos(obj.getServicos());
        return this.veiculoRepository.save(novoObj);
    }

    @Transactional
    public void delete(String placa) {
        Veiculo veiculo = findByPlaca(placa);

        List<Servico> servicos = servicoRepository.findAll();
        for (Servico servico : servicos) {
            if (servico.getVeiculos().contains(veiculo)) {
                servico.getVeiculos().remove(veiculo);
                servicoRepository.save(servico);
            }
        }

        try {
            this.veiculoRepository.deleteById(placa);
        } catch (Exception e) {
            throw new RuntimeException("Houve um erro ao deletar o Veículo");
        }
    }
}
