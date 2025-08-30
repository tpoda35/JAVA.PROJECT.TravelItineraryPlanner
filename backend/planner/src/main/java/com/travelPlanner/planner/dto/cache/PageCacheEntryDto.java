package com.travelPlanner.planner.dto.cache;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageCacheEntryDto<T> implements Serializable {

    private List<T> content;
    private long totalElements;

    @Serial
    private static final long serialVersionUID = 1L;

}
