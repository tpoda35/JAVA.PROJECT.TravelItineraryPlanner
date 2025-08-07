package com.travelPlanner.planner.dto.cache;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageCacheEntryDto<T> {

    private List<T> content;
    private long totalElements;

}
