package club.escobar.service;

import club.escobar.dto.auth.AuthResponse;
import club.escobar.dto.auth.LoginRequest;
import club.escobar.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);
}
