package club.escobar.mapper;

import club.escobar.dto.kyc.CreatorKycProfileResponse;
import club.escobar.dto.kyc.CreatorKycReviewDetailResponse;
import club.escobar.entity.CreatorKycProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CreatorKycMapper {

    @Mapping(target = "creatorId", source = "creator.id")
    @Mapping(target = "panNumberMasked", expression = "java(maskPan(entity.getPanNumber()))")
    CreatorKycProfileResponse toResponse(CreatorKycProfile entity);

    @Mapping(target = "creatorId", source = "creator.id")
    CreatorKycReviewDetailResponse toReviewDetailResponse(CreatorKycProfile entity);

    default String maskPan(String panNumber) {
        if (panNumber == null || panNumber.length() != 10) {
            return panNumber;
        }
        return "XXXXXX" + panNumber.substring(6);
    }
}
