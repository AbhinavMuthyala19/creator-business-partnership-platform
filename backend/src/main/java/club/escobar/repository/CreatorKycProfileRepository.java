package club.escobar.repository;

import club.escobar.entity.CreatorKycProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreatorKycProfileRepository extends JpaRepository<CreatorKycProfile, Long> {

    Optional<CreatorKycProfile> findByCreator_Id(Long creatorId);
}
