package com.travelPlanner.planner.startup;

import com.travelPlanner.planner.mapper.AppUserMapper;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserSyncStartup implements ApplicationRunner {

    private final Keycloak keycloak;
    private final String realm;
    private final UserRepository userRepository;

    @Value("${app.sync.keycloak-batch-size:100}")
    private int keycloakBatchSize;

    @Value("${app.sync.db-batch-size:50}")
    private int dbBatchSize;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        log.info("Starting user sync from Keycloak...");

        try {
            syncUsers();
            log.info("User sync completed successfully");
        } catch (Exception e) {
            log.error("Error during user sync", e);
            throw e;
        }
    }

    private void syncUsers() {
        int first = 0;
        int totalProcessed = 0;
        List<UserRepresentation> users;

        do {
            users = fetchKeycloakUsers(first, keycloakBatchSize);

            if (!users.isEmpty()) {
                List<AppUser> appUsers = users.stream()
                        .map(AppUserMapper::fromKeycloakUserToAppUser)
                        .toList();

                saveBatch(appUsers);

                totalProcessed += users.size();
                log.info("Processed {} users (total: {})", users.size(), totalProcessed);
            }

            first += keycloakBatchSize;

        } while (!users.isEmpty());
    }

    private List<UserRepresentation> fetchKeycloakUsers(int first, int max) {
        try {
            return keycloak.realm(realm).users().list(first, max);
        } catch (Exception e) {
            log.error("Error fetching users from Keycloak at offset {}", first, e);
            throw new RuntimeException("Failed to fetch users from Keycloak", e);
        }
    }

    private void saveBatch(List<AppUser> users) {
        for (int i = 0; i < users.size(); i += dbBatchSize) {
            int endIndex = Math.min(i + dbBatchSize, users.size());
            List<AppUser> batch = users.subList(i, endIndex);

            try {
                userRepository.saveAll(batch);
                log.debug("Saved batch of {} users", batch.size());
            } catch (Exception e) {
                log.error("Error saving user batch, falling back to individual operations", e);
                saveIndividually(batch);
            }
        }
    }

    private void saveIndividually(List<AppUser> users) {
        for (AppUser user : users) {
            try {
                userRepository.save(user);
            } catch (Exception e) {
                log.error("Failed to save user: {} ({})", user.getUsername(), user.getId(), e);
            }
        }
    }
}
