package club.escobar.controller;

import club.escobar.dto.common.PageResponse;
import club.escobar.dto.metrics.LeaderboardEntryResponse;
import club.escobar.security.SecurityUser;
import club.escobar.service.ContentMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LeaderboardController {

    private final ContentMetricsService contentMetricsService;

    @GetMapping("/api/businesses/{id}/leaderboard")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<PageResponse<LeaderboardEntryResponse>> businessLeaderboard(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(contentMetricsService.businessLeaderboard(user.getId(), id, pageable));
    }

    @GetMapping("/api/leaderboard/global")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PageResponse<LeaderboardEntryResponse>> globalLeaderboard(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(contentMetricsService.globalLeaderboard(pageable));
    }
}
