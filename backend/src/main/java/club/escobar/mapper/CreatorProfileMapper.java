package club.escobar.mapper;

import club.escobar.dto.creator.CreatorProfileResponse;
import club.escobar.entity.CreatorProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CreatorProfileMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "email", source = "user.email")
    CreatorProfileResponse toResponse(CreatorProfile entity);
}
