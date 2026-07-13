package club.escobar.controller;

import club.escobar.dto.kyc.CreatorKycProfileResponse;
import club.escobar.dto.kyc.CreatorKycReviewDetailResponse;
import club.escobar.dto.kyc.CreatorKycReviewRequest;
import club.escobar.dto.kyc.CreatorKycSubmitRequest;
import club.escobar.security.SecurityUser;
import club.escobar.service.CreatorKycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CreatorKycController {

    private final CreatorKycService creatorKycService;

    @PostMapping("/api/kyc/me")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<CreatorKycProfileResponse> submit(
            @AuthenticationPrincipal SecurityUser user,
            @Valid @RequestBody CreatorKycSubmitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(creatorKycService.submit(user.getId(), request));
    }

    @GetMapping("/api/kyc/me")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<CreatorKycProfileResponse> getOwn(@AuthenticationPrincipal SecurityUser user) {
        return ResponseEntity.ok(creatorKycService.getOwn(user.getId()));
    }

    @GetMapping("/api/creators/{id}/kyc")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<CreatorKycReviewDetailResponse> getForReview(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id) {
        return ResponseEntity.ok(creatorKycService.getForReview(user.getId(), id));
    }

    @PatchMapping("/api/creators/{id}/kyc")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<CreatorKycReviewDetailResponse> review(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @Valid @RequestBody CreatorKycReviewRequest request) {
        return ResponseEntity.ok(creatorKycService.review(user.getId(), id, request));
    }
}
