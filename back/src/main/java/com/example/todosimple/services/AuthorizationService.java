package com.example.todosimple.services;

import org.springframework.context.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.todosimple.dtos.AuthetinticationDto;
import com.example.todosimple.dtos.LoginResponseDto;
import com.example.todosimple.models.Admin;
import com.example.todosimple.repositories.AdminRepository;
import com.example.todosimple.security.TokenService;

import jakarta.validation.Valid;

@Service
public class AuthorizationService implements UserDetailsService{
    @Autowired
    private ApplicationContext context;
    
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TokenService tokenService;

    private AuthenticationManager authenticationManager;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return adminRepository.findByEmail(email);
    } 

    public ResponseEntity<Object> login(@RequestBody @Valid AuthetinticationDto data){
        authenticationManager = context.getBean( AuthenticationManager.class);

        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((Admin) auth.getPrincipal());
        return ResponseEntity.ok(new LoginResponseDto(token));
    }
    
}