package com.travelPlanner.planner.exception;

public class TripCollaboratorsNotFoundException extends RuntimeException {
    public TripCollaboratorsNotFoundException() {
        super("No collaborator(s) found.");
    }
}
