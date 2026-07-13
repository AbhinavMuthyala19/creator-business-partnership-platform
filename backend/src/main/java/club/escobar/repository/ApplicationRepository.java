package club.escobar.repository;

import club.escobar.entity.Application;
import club.escobar.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByCreator_Id(Long creatorId, Pageable pageable);

    Page<Application> findByBusiness_IdAndStatus(Long businessId, ApplicationStatus status, Pageable pageable);

    Page<Application> findByBusiness_Id(Long businessId, Pageable pageable);

    Optional<Application> findByCreator_IdAndBusiness_Id(Long creatorId, Long businessId);

    boolean existsByCreator_IdAndBusiness_IdAndStatus(Long creatorId, Long businessId, ApplicationStatus status);
}
