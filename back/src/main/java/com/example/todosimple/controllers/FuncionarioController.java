package com.example.todosimple.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.net.URI;
import java.util.List;
import jakarta.validation.Valid;

import com.example.todosimple.models.Funcionario.IUpdateFuncionario;
import com.example.todosimple.models.Funcionario.ICreateFuncionario;
import com.example.todosimple.models.Funcionario;
import com.example.todosimple.services.FuncionarioService;

@RestController
@RequestMapping("/Funcionario")
@Validated
public class FuncionarioController {
    
    @Autowired
    private FuncionarioService FuncionarioService;

    @GetMapping("/{id}")
    public ResponseEntity <Funcionario> findById(@PathVariable Long id){
        Funcionario obj = this.FuncionarioService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping()
    public ResponseEntity<List<Funcionario>> findAll(){
        List<Funcionario> funcionarios = FuncionarioService.findAll();
        return ResponseEntity.ok().body(funcionarios);
    }

    @PostMapping
    @Validated(ICreateFuncionario.class)
    public ResponseEntity<Funcionario> create(@Valid @RequestBody Funcionario obj){
        this.FuncionarioService.create(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @PutMapping
    @Validated(IUpdateFuncionario.class)
    public ResponseEntity<Funcionario> update(@Valid @RequestBody Funcionario obj){
        this.FuncionarioService.update(obj);
        return ResponseEntity.ok().body(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        this.FuncionarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    
}
