package club.escobar.repository;

import club.escobar.entity.Payout;
import club.escobar.entity.enums.PayoutStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PayoutRepository extends JpaRepository<Payout, Long> {

    Optional<Payout> findByContent_Id(Long contentId);

    Page<Payout> findByCreator_Id(Long creatorId, Pageable pageable);

    Page<Payout> findByBusiness_Id(Long businessId, Pageable pageable);

    Page<Payout> findByBusiness_IdAndStatus(Long businessId, PayoutStatus status, Pageable pageable);
}
