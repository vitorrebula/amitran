package com.example.todosimple.controllers;


import com.example.todosimple.dtos.FuncionarioDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

import com.example.todosimple.services.FuncionarioService;

@RestController
@RequestMapping("funcionario")

public class FuncionarioController {
    
    @Autowired
    private FuncionarioService FuncionarioService;


    @GetMapping("/buscarFuncionarios")
    public List<FuncionarioDto> getAllFuncionarios(){
        return  FuncionarioService.listarFuncionarios();
    }

    @GetMapping("/buscarFuncionario")
    public FuncionarioDto getFuncionarioById(@RequestParam Long  id){
        return  FuncionarioService.buscarFuncionarioPorId(id);
    }

    @PostMapping(value = "/adicionarFuncionario/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String>  adicionarFuncionario(@Valid @RequestBody FuncionarioDto funcionarioDto){
        return FuncionarioService.cadastrarFuncionario(funcionarioDto);
    }

    @PutMapping(value = "/atualizarFuncionario/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> atualizarFuncionario(@PathVariable Long id, @Valid @RequestBody FuncionarioDto funcionarioDto) {
         return FuncionarioService.atualizarFuncionario(id, funcionarioDto);
    }

    @PostMapping(value = "/excluirFuncionario",produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> deleteFuncionario(@RequestParam Long id){
        return FuncionarioService.excluirFuncionario(id);
    }

}
