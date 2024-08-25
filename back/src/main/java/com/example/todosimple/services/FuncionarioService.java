package com.example.todosimple.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.todosimple.models.Funcionario;
import com.example.todosimple.repositories.FuncionarioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {
    
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Funcionario findById(Long id){
        Optional<Funcionario> funcionario = this.funcionarioRepository.findById(id);
        return funcionario.orElseThrow(() -> new RuntimeException(
            "Funcionario não encontrado! Id: " + id + ", Type: " + Funcionario.class.getName()
        ));
    }
    
    public List<Funcionario> findAll(){
        return funcionarioRepository.findAll();
    }

    @Transactional
    public Funcionario create(Funcionario obj){
        obj.setId(null);
        obj = this.funcionarioRepository.save(obj);
        return obj;
    }

    @Transactional
    public Funcionario update(Funcionario obj){
        Funcionario newObj = findById(obj.getId());
        newObj.setCpf(obj.getCpf());
        newObj.setDataAdmissao(obj.getDataAdmissao());
        newObj.setTipoCNH(obj.getTipoCNH());
        newObj.setCargo(obj.getCargo());
        newObj.setUsername(obj.getUsername());
        newObj.setStatus(obj.getStatus());
        newObj.setObservacoes(obj.getObservacoes());
        newObj.setServicos(obj.getServicos());
        return this.funcionarioRepository.save(newObj);
    }
    
    public void delete(Long id){
        findById(id);
        try {
            this.funcionarioRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Funcionario não pode ser deletado, pois tem entidades dependentes relacionadas!");
        }
    }
}