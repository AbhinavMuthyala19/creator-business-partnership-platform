package club.escobar.controller;

import club.escobar.dto.common.PageResponse;
import club.escobar.dto.payout.PayoutMarkPaidRequest;
import club.escobar.dto.payout.PayoutResponse;
import club.escobar.entity.enums.PayoutStatus;
import club.escobar.security.SecurityUser;
import club.escobar.service.PayoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PayoutController {

    private final PayoutService payoutService;

    @GetMapping("/api/content/{id}/payout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PayoutResponse> getForContent(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id) {
        return ResponseEntity.ok(payoutService.getForContent(user.getId(), id));
    }

    @GetMapping("/api/businesses/{id}/payouts")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<PageResponse<PayoutResponse>> listForBusiness(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @RequestParam(required = false) PayoutStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(payoutService.listForBusiness(user.getId(), id, status, pageable));
    }

    @PatchMapping("/api/content/{id}/payout/paid")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<PayoutResponse> markPaid(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @Valid @RequestBody PayoutMarkPaidRequest request) {
        return ResponseEntity.ok(payoutService.markPaid(user.getId(), id, request));
    }
}
