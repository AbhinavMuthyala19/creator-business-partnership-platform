package club.escobar.repository;

import club.escobar.entity.CreatorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreatorProfileRepository extends JpaRepository<CreatorProfile, Long> {

    Optional<CreatorProfile> findByUser_Id(Long userId);
}
