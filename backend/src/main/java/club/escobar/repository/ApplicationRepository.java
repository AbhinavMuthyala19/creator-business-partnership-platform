package club.escobar.repository;

import club.escobar.entity.Application;
import club.escobar.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByCreator_Id(Long creatorId, Pageable pageable);

    Page<Application> findByCampaign_IdAndStatus(Long campaignId, ApplicationStatus status, Pageable pageable);

    Page<Application> findByCampaign_Id(Long campaignId, Pageable pageable);

    Optional<Application> findByCreator_IdAndCampaign_Id(Long creatorId, Long campaignId);

    boolean existsByCreator_IdAndCampaign_IdAndStatus(Long creatorId, Long campaignId, ApplicationStatus status);

    boolean existsByCreator_IdAndCampaign_Business_Id(Long creatorId, Long businessId);
}
