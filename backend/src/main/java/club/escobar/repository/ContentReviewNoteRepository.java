package club.escobar.repository;

import club.escobar.entity.ContentReviewNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentReviewNoteRepository extends JpaRepository<ContentReviewNote, Long> {

    List<ContentReviewNote> findByContent_IdOrderByCreatedAtAsc(Long contentId);
}
