package com.example.backend.controller;

import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
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


        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());


        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {

            if (!user.getPassword().equals(request.getOldPassword())) {
                return ResponseEntity.badRequest().body("Parola actuală este greșită!");
            }

            user.setPassword(request.getNewPassword());
        }

        userRepository.save(user);

        return ResponseEntity.ok("Updated successfully");
    }
    @GetMapping("users/all")
    public ResponseEntity<?> getAllUsersExceptAdmin() {
        try {
            List<User> users = userRepository.findAll()
                    .stream()
                    .filter(u -> u.getRole() != User.Role.MANAGER)
                    .toList();

            return ResponseEntity.ok(users);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Eroare la încărcarea utilizatorilor.");
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(user.get());
    }

    @PostMapping("/request-subscription/{id}")
    public ResponseEntity<?> requestSubscription(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setSubscriptionStatus("pending");
        userRepository.save(user);

        return ResponseEntity.ok("Cererea a fost trimisă administratorului.");
    }

    @GetMapping("/pending-subscriptions")
    public ResponseEntity<?> getPendingSubscriptions() {
        List<User> pending = userRepository.findBySubscriptionStatus("pending");
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/approve-subscription/{id}")
    public ResponseEntity<?> approveSubscription(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setSubscriptionStatus("active");
        userRepository.save(user);

        return ResponseEntity.ok("Abonament activat.");
    }

    @PostMapping("/deactivate-subscription/{id}")
    public ResponseEntity<?> deactivateSubscription(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        user.setSubscriptionStatus("inactive");
        userRepository.save(user);

        return ResponseEntity.ok("Abonament dezactivat.");
    }


}
