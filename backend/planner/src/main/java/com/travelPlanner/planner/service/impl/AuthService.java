package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.service.IAuthService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
// Add logging
public class AuthService implements IAuthService {

    // Do the testing and repair the Trip creation

    @Override
    public Map<String, Object> getToken(String username, String password) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", "planner-app");
        formData.add("username", username);
        formData.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        try {
            var response = restTemplate.postForEntity(
                    "http://localhost:8080/realms/planner-app/protocol/openid-connect/token",
                    request,
                    Map.class
            );

            return response.getBody();
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            throw new RuntimeException("Keycloak authentication error: " + ex.getResponseBodyAsString(), ex);
        }
    }
}
