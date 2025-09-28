package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.overview.list.OverviewListDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.note.OverviewWsDto;

public interface IOverviewListWebSocketService {
    OverviewWsDto create(Long overviewId);
    OverviewWsDto update(Long listId, OverviewListDetailsDtoV3 list);
    OverviewWsDto delete(Long listId);
}
