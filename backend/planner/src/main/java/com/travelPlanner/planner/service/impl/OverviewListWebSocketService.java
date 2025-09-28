package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.overview.list.OverviewListDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.note.OverviewWsDto;
import com.travelPlanner.planner.exception.OverviewListNotFoundException;
import com.travelPlanner.planner.exception.TripOverviewNotFound;
import com.travelPlanner.planner.mapper.OverviewWsMapper;
import com.travelPlanner.planner.model.OverviewList;
import com.travelPlanner.planner.model.TripOverview;
import com.travelPlanner.planner.repository.OverviewListRepository;
import com.travelPlanner.planner.repository.TripOverviewRepository;
import com.travelPlanner.planner.service.IOverviewListWebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.travelPlanner.planner.enums.OverviewWsType.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OverviewListWebSocketService implements IOverviewListWebSocketService {

    private final TripOverviewRepository tripOverviewRepository;
    private final OverviewListRepository overviewListRepository;

    @Override
    @Transactional
    public OverviewWsDto create(Long overviewId) {
        String logPrefix = "WsListCreate";

        OverviewList newList = OverviewWsMapper.createListOverviewWsDto(findTripOverviewById(logPrefix, overviewId));

        log.info("{} :: Creating new List.", logPrefix);
        return OverviewWsMapper.createListOverviewWsDto(LIST_CREATED, overviewListRepository.save(newList));
    }

    @Override
    @Transactional
    public OverviewWsDto update(Long listId, OverviewListDetailsDtoV3 list) {
        String logPrefix = "WsListUpdate";

        OverviewList overviewList = findOverviewListById(logPrefix, listId);
        overviewList.setTitle(list.getTitle());

        log.info("{} :: Updated List title with id {} to {}.", logPrefix, listId, list.getTitle());

        return OverviewWsMapper.createListOverviewWsDto(LIST_UPDATED_TITLE, overviewList);
    }

    @Override
    @Transactional
    public OverviewWsDto delete(Long listId) {
        String logPrefix = "WsNoteDelete";

        overviewListRepository.delete(
                findOverviewListById(logPrefix, listId)
        );

        log.info("{} :: Deleted List with id {}.", logPrefix, listId);

        return OverviewWsMapper.createDeleteListOverviewWsDto(listId);
    }

    private TripOverview findTripOverviewById(String logPrefix, Long overviewId) {
        return tripOverviewRepository.findById(overviewId)
                .orElseThrow(() -> {
                    log.info("{} :: Overview not found with the id {}.", logPrefix, overviewId);
                    return new TripOverviewNotFound("Overview not found.");
                });
    }

    private OverviewList findOverviewListById(String logPrefix, Long listId) {
        return overviewListRepository.findById(listId)
                .orElseThrow(() -> {
                    log.info("{} :: List not found with the id {}.", logPrefix, listId);
                    return new OverviewListNotFoundException("List not found.");
                });
    }
}
