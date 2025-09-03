package com.travelPlanner.planner.exception;

public class MaxTripsPerFolderExceededException extends RuntimeException {
    public MaxTripsPerFolderExceededException(int maxTrips) {
        super(String.format("You have reached the maximum allowed trips (%d) in this folder.", maxTrips));
    }
}
