package com.travelPlanner.planner.exception;

public class MaxFoldersPerUserExceededException extends RuntimeException {
    public MaxFoldersPerUserExceededException(int maxFolders) {
        super(String.format("You have reached the maximum allowed folders (%d).", maxFolders));
    }
}
