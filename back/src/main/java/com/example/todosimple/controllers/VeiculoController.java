package com.example.todosimple.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.todosimple.models.Veiculo;
import com.example.todosimple.models.Veiculo.ICreateVeiculo;
import com.example.todosimple.models.Veiculo.IUpdateVeiculo;
import com.example.todosimple.services.VeiculoService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/veiculo")
@Validated
public class VeiculoController {

    @Autowired
    private VeiculoService veiculoService;

    @GetMapping("/{placa}")
    public ResponseEntity<Veiculo> findByPlaca(@PathVariable String placa) {
        Veiculo obj = this.veiculoService.findByPlaca(placa);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping()
    public ResponseEntity<List<Veiculo>> findAllV(){
        List<Veiculo> funcionarios = veiculoService.findAllV();
        return ResponseEntity.ok().body(funcionarios);
    }

    @PostMapping
    @Validated(ICreateVeiculo.class)
    public ResponseEntity<Veiculo> create(@Valid @RequestBody Veiculo obj) {
        this.veiculoService.create(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{placa}").buildAndExpand(obj.getPlaca())
                .toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @PutMapping("/{placa}")
    @Validated(IUpdateVeiculo.class)
    public ResponseEntity<Veiculo> update(@Valid @RequestBody Veiculo obj, @PathVariable String placa) {
        obj.setPlaca(placa);
        this.veiculoService.update(obj);
        return ResponseEntity.ok().body(obj);
    }

    @DeleteMapping("/{placa}")
    public ResponseEntity<Void> delete(@PathVariable String placa) {
        this.veiculoService.delete(placa);
        return ResponseEntity.noContent().build();
    }
}