package club.escobar.mapper;

import club.escobar.dto.metrics.ContentMetricsSnapshotResponse;
import club.escobar.entity.ContentMetricsSnapshot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ContentMetricsMapper {

    @Mapping(target = "contentId", source = "content.id")
    ContentMetricsSnapshotResponse toResponse(ContentMetricsSnapshot entity);
}
