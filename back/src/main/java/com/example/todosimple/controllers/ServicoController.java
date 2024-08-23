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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.todosimple.models.Servico;
import com.example.todosimple.models.Servico.CreateServico;
import com.example.todosimple.models.Servico.UpdateServico;
import com.example.todosimple.services.ServicoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/servico")
@Validated
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping("/{id}")
    public ResponseEntity<Servico> findById(@PathVariable Long id) {
        Servico obj = this.servicoService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @GetMapping()
    public ResponseEntity<List<Servico>> findAll() {
        List<Servico> servicos = servicoService.findAll();
        return ResponseEntity.ok().body(servicos);
    }

    @PostMapping
    @Validated(CreateServico.class)
    public ResponseEntity<Servico> create(@Valid @RequestBody Servico obj) {
        obj = this.servicoService.create(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @PostMapping("/{servicoId}/funcionario/{funcionarioId}")
    public ResponseEntity<Servico> addFuncionarioToServico(@PathVariable Long servicoId, @PathVariable Long funcionarioId) {
        Servico obj = servicoService.addFuncionarioToServico(servicoId, funcionarioId);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping("/{servicoId}/veiculo/{veiculoId}")
    public ResponseEntity<Servico> addVeiculoToServico(@PathVariable Long servicoId, @PathVariable String veiculoId) {
        Servico obj = servicoService.addVeiculoToServico(servicoId, veiculoId);
        return ResponseEntity.ok().body(obj);
    }

    @PutMapping
    @Validated(UpdateServico.class)
    public ResponseEntity<Servico> update(@Valid @RequestBody Servico obj) {
        obj = this.servicoService.update(obj);
        return ResponseEntity.ok().body(obj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.servicoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
