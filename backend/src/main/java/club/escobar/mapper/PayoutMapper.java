package club.escobar.mapper;

import club.escobar.dto.payout.PayoutResponse;
import club.escobar.entity.Payout;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PayoutMapper {

    @Mapping(target = "contentId", source = "content.id")
    @Mapping(target = "creatorId", source = "creator.id")
    @Mapping(target = "campaignId", source = "campaign.id")
    @Mapping(target = "businessId", source = "business.id")
    PayoutResponse toResponse(Payout entity);
}
