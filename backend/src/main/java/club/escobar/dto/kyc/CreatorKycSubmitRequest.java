package club.escobar.dto.kyc;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatorKycSubmitRequest(
        @NotBlank
        @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$", message = "Must be a valid 10-character PAN number (e.g. ABCDE1234F)")
        String panNumber,

        @NotBlank @Size(max = 150)
        String nameOnPan,

        @NotBlank @Size(max = 500)
        String documentUrl
) {
}
