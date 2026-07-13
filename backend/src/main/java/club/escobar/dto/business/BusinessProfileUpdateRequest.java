package club.escobar.dto.business;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BusinessProfileUpdateRequest(
        @NotBlank @Size(max = 150) String companyName,
        @Size(max = 80) String industry,
        @Size(max = 4000) String description,
        @Size(max = 500) String logoUrl,
        @Size(max = 300) String website
) {
}
