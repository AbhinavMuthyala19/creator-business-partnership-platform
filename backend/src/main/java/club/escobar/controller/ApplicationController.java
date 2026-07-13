package club.escobar.controller;

import club.escobar.dto.application.ApplicationCreateRequest;
import club.escobar.dto.application.ApplicationResponse;
import club.escobar.dto.application.ApplicationStatusUpdateRequest;
import club.escobar.dto.common.PageResponse;
import club.escobar.entity.enums.ApplicationStatus;
import club.escobar.security.SecurityUser;
import club.escobar.service.ApplicationService;
import jakarta.validation.Valid;
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
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/api/applications")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<ApplicationResponse> apply(
            @AuthenticationPrincipal SecurityUser user,
            @Valid @RequestBody ApplicationCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.create(user.getId(), request));
    }

    @GetMapping("/api/applications/me")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<PageResponse<ApplicationResponse>> myApplications(
            @AuthenticationPrincipal SecurityUser user,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(applicationService.listForCreator(user.getId(), pageable));
    }

    @GetMapping("/api/businesses/{id}/applications")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<PageResponse<ApplicationResponse>> inbox(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @RequestParam(required = false) ApplicationStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(applicationService.listForBusiness(user.getId(), id, status, pageable));
    }

    @PatchMapping("/api/applications/{id}/status")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(user.getId(), id, request));
    }
}
