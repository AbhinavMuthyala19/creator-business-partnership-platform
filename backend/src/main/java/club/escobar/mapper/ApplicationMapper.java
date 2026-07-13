package club.escobar.mapper;

import club.escobar.dto.application.ApplicationResponse;
import club.escobar.entity.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {

    @Mapping(target = "creatorId", source = "creator.id")
    @Mapping(target = "creatorDisplayName", source = "creator.creatorProfile.displayName")
    @Mapping(target = "businessId", source = "business.id")
    @Mapping(target = "businessCompanyName", source = "business.businessProfile.companyName")
    ApplicationResponse toResponse(Application entity);
}
