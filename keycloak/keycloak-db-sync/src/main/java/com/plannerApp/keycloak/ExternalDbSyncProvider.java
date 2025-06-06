package com.plannerApp.keycloak;

import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ExternalDbSyncProvider implements EventListenerProvider {

    private final String _realmId = "your-realm-id";
    private final String _dbUrl = "jdbc:postgresql://localhost:5432/your-db";
    private final String _dbUser = "your-db-username";
    private final String _dbPassword = "your-db-password";
    private final String _dbSql = "INSERT INTO app_user (id, username) VALUES (?, ?)";

    @Override
    public void onEvent(Event event) {
        System.out.println("Event detected from Keycloak. RealmId: " + event.getRealmId());

        if (event.getRealmId().equals(_realmId) && event.getType() == EventType.REGISTER) {
            System.out.println("Register event detected at the right realm.");

            try (Connection conn = DbConnect();
                 PreparedStatement pstmt = conn.prepareStatement(_dbSql)) {

                pstmt.setObject(1, event.getUserId());
                pstmt.setString(2, event.getDetails().get("username"));

                int affectedRows = pstmt.executeUpdate();
                System.out.println("Inserted " + affectedRows + " row(s)");
            }
            catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {

    }

    @Override
    public void close() {

    }

    private Connection DbConnect() {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(_dbUrl, _dbUser, _dbPassword);
            System.out.println("Connected to the PostgreSQL server successfully.");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return conn;
    }
}
