package club.escobar.service;

import club.escobar.dto.common.PageResponse;
import club.escobar.dto.metrics.ContentMetricsSnapshotResponse;
import club.escobar.dto.metrics.LeaderboardEntryResponse;
import org.springframework.data.domain.Pageable;

public interface ContentMetricsService {

    ContentMetricsSnapshotResponse syncMetrics(Long requestingUserId, Long contentId);

    PageResponse<ContentMetricsSnapshotResponse> getMetricsHistory(Long requestingUserId, Long contentId, Pageable pageable);

    PageResponse<LeaderboardEntryResponse> businessLeaderboard(Long requestingBusinessUserId, Long businessId, Pageable pageable);

    PageResponse<LeaderboardEntryResponse> globalLeaderboard(Pageable pageable);
}
