package com.example.todosimple.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.todosimple.models.Admin;
import com.example.todosimple.models.Admin.CreateAdmin;
import com.example.todosimple.models.Admin.UpdateAdmin;
import com.example.todosimple.services.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin")
@Validated
public class AdminControler {

    @Autowired
    private AdminService adminService; 

    @GetMapping("/{id}")
    public ResponseEntity<Admin> findById(@PathVariable Long id){
        Admin obj = this.adminService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    @Validated(CreateAdmin.class)
    public ResponseEntity<Void> create(@Valid @RequestBody Admin obj){
        this.adminService.create(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/admin/{id}")
    @Validated(UpdateAdmin.class)
    public ResponseEntity<Void> update(@Valid @RequestBody Admin obj, @PathVariable Long id){
        obj.setId(id);
        this.adminService.update(obj);
        return ResponseEntity.noContent().build();
    }

}
