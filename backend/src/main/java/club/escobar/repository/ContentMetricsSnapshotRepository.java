package club.escobar.repository;

import club.escobar.entity.ContentMetricsSnapshot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContentMetricsSnapshotRepository extends JpaRepository<ContentMetricsSnapshot, Long> {

    Optional<ContentMetricsSnapshot> findTopByContent_IdOrderByFetchedAtDesc(Long contentId);

    Page<ContentMetricsSnapshot> findByContent_IdOrderByFetchedAtDesc(Long contentId, Pageable pageable);
}
