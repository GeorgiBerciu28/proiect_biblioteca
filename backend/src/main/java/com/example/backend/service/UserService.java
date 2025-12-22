package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {

        if (request.getEmail().toLowerCase().contains("@library")) {
            return new AuthResponse(
                    null, null, null, null, null, null,
                    "Domeniul @library este rezervat exclusiv pentru administratori!"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, null, null, null,"Email deja înregistrat!");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(User.Role.USER);
        user.setSubscriptionStatus("inactive");

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getSubscriptionStatus(),
                "Registration successful!"
        );
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return new AuthResponse(null, null, null, null, null,  null, "Email sau parolă greșită!");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(null, null, null, null, null, null, "Email sau parolă greșită!");
        }

        return new AuthResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                user.getSubscriptionStatus(),
                "Successful authentication!"
        );
    }
}