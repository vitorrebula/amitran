package com.example.todosimple.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.todosimple.models.Admin;
import com.example.todosimple.repositories.AdminRepository;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    public Admin findById(Long id){
        Optional<Admin> admin = this.adminRepository.findById(id);
        return admin.orElseThrow(() -> new RuntimeException(
            "Admin não encontrado para o ID: " + id
        ));
    }

    @Transactional
    public Admin create(Admin obj){
        obj.setId(null);
        obj = this.adminRepository.save(obj);
        return obj;
    }

    @Transactional
    public Admin update(Admin obj){
        Admin newObj = findById(obj.getId());
        newObj.setPassword(obj.getPassword());
        return this.adminRepository.save(newObj);
    }

    public void delete(Long id){
        findById(id);
        try{
            this.adminRepository.deleteById(id);
        }catch(Exception e){
            throw new RuntimeException("Não e possivel pois a entidades relacionadas!");
        }
    }
}
