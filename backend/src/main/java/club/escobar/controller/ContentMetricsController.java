package club.escobar.controller;

import club.escobar.dto.common.PageResponse;
import club.escobar.dto.metrics.ContentMetricsSnapshotResponse;
import club.escobar.security.SecurityUser;
import club.escobar.service.ContentMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ContentMetricsController {

    private final ContentMetricsService contentMetricsService;

    @PostMapping("/api/content/{id}/metrics/sync")
    @PreAuthorize("hasAnyRole('CREATOR','BUSINESS')")
    public ResponseEntity<ContentMetricsSnapshotResponse> sync(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contentMetricsService.syncMetrics(user.getId(), id));
    }

    @GetMapping("/api/content/{id}/metrics")
    @PreAuthorize("hasAnyRole('CREATOR','BUSINESS')")
    public ResponseEntity<PageResponse<ContentMetricsSnapshotResponse>> history(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(contentMetricsService.getMetricsHistory(user.getId(), id, pageable));
    }
}
