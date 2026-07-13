package club.escobar.dto.payout;

import jakarta.validation.constraints.Size;

public record PayoutMarkPaidRequest(
        @Size(max = 2000) String paidNote
) {
}
