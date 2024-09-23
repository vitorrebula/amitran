package com.example.todosimple.dtos;
import jakarta.validation.constraints.NotNull;

public record RegisterDto(@NotNull String email,@NotNull String password ) {
    
}
