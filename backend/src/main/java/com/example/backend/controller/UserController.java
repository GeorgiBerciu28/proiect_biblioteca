package com.example.backend.controller;

import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // dacă folosești vite
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();

        // schimbare nume / prenume / email
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        // schimbare parola
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {

            if (!user.getPassword().equals(request.getOldPassword())) {
                return ResponseEntity.badRequest().body("Parola actuală este greșită!");
            }

            user.setPassword(request.getNewPassword());
        }

        userRepository.save(user);

        return ResponseEntity.ok("Updated successfully");
    }
}
