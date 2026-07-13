package club.escobar.mapper;

import club.escobar.dto.business.BusinessProfileResponse;
import club.escobar.entity.BusinessProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BusinessProfileMapper {

    @Mapping(target = "userId", source = "user.id")
    BusinessProfileResponse toResponse(BusinessProfile entity);
}
