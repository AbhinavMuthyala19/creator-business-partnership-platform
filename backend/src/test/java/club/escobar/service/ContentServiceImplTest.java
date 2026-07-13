package club.escobar.service;

import club.escobar.dto.content.ContentCreateRequest;
import club.escobar.dto.content.ContentPublishRequest;
import club.escobar.dto.content.ContentResponse;
import club.escobar.dto.content.ContentReviewRequest;
import club.escobar.dto.content.ContentUpdateRequest;
import club.escobar.entity.Application;
import club.escobar.entity.Content;
import club.escobar.entity.User;
import club.escobar.entity.enums.ApplicationStatus;
import club.escobar.entity.enums.ContentStatus;
import club.escobar.entity.enums.MediaType;
import club.escobar.entity.enums.UserRole;
import club.escobar.exception.ForbiddenActionException;
import club.escobar.exception.InvalidStateTransitionException;
import club.escobar.mapper.ContentMapper;
import club.escobar.repository.ApplicationRepository;
import club.escobar.repository.ContentRepository;
import club.escobar.repository.UserRepository;
import club.escobar.service.impl.ContentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContentServiceImplTest {

    @Mock
    private ContentRepository contentRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ContentMapper contentMapper;

    private ContentServiceImpl contentService;

    private User creator;
    private User business;
    private Application application;

    @BeforeEach
    void setUp() {
        contentService = new ContentServiceImpl(contentRepository, applicationRepository, userRepository, contentMapper);
        creator = User.builder().id(1L).email("creator@test.com").role(UserRole.CREATOR).build();
        business = User.builder().id(2L).email("business@test.com").role(UserRole.BUSINESS).build();
        application = Application.builder().id(5L).creator(creator).business(business)
                .status(ApplicationStatus.APPROVED).pitchMessage("pitch").build();
    }

    @Test
    void submit_createsContentInSubmittedStatus_whenApplicationApproved() {
        when(applicationRepository.findById(5L)).thenReturn(Optional.of(application));
        when(contentRepository.findByApplication_Id(eq(5L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));
        when(contentRepository.save(any(Content.class))).thenAnswer(inv -> inv.getArgument(0));
        when(contentMapper.toResponse(any(Content.class))).thenReturn(mock(ContentResponse.class));

        contentService.submit(1L, new ContentCreateRequest(5L, "caption", "http://x/media.png", MediaType.IMAGE));

        ArgumentCaptor<Content> captor = ArgumentCaptor.forClass(Content.class);
        verify(contentRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(ContentStatus.SUBMITTED);
        assertThat(captor.getValue().getVersion()).isEqualTo(1);
    }

    @Test
    void submit_rejectsWhenApplicationNotApproved() {
        application.setStatus(ApplicationStatus.PENDING);
        when(applicationRepository.findById(5L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> contentService.submit(1L,
                new ContentCreateRequest(5L, "caption", "http://x/media.png", MediaType.IMAGE)))
                .isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void submit_rejectsWhenCreatorDoesNotOwnApplication() {
        when(applicationRepository.findById(5L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> contentService.submit(99L,
                new ContentCreateRequest(5L, "caption", "http://x/media.png", MediaType.IMAGE)))
                .isInstanceOf(ForbiddenActionException.class);
    }

    @Test
    void resubmit_incrementsVersionAndReturnsToSubmitted_whenChangesWereRequested() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.CHANGES_REQUESTED).version(1).build();
        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));
        when(contentRepository.save(any(Content.class))).thenAnswer(inv -> inv.getArgument(0));
        when(contentMapper.toResponse(any(Content.class))).thenReturn(mock(ContentResponse.class));

        contentService.resubmit(1L, 20L, new ContentUpdateRequest("new caption", "new.png", MediaType.IMAGE));

        assertThat(content.getVersion()).isEqualTo(2);
        assertThat(content.getStatus()).isEqualTo(ContentStatus.SUBMITTED);
        assertThat(content.getMediaUrl()).isEqualTo("new.png");
    }

    @Test
    void resubmit_rejectsWhenStatusIsNotChangesRequested() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.SUBMITTED).version(1).build();
        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));

        assertThatThrownBy(() -> contentService.resubmit(1L, 20L,
                new ContentUpdateRequest("new caption", "new.png", MediaType.IMAGE)))
                .isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void review_rejectsReviewingDraftContent() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.DRAFT).version(1).build();
        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));

        assertThatThrownBy(() -> contentService.review(2L, 20L,
                new ContentReviewRequest(ContentStatus.APPROVED, "looks good")))
                .isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void review_appendsNoteToHistory_withoutOverwritingPriorNotes() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.SUBMITTED).version(2).build();
        content.addReviewNote(club.escobar.entity.ContentReviewNote.builder()
                .authoredBy(business).contentVersion(1).decision(ContentStatus.CHANGES_REQUESTED).noteText("fix lighting").build());

        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));
        when(userRepository.getReferenceById(2L)).thenReturn(business);
        when(contentRepository.save(any(Content.class))).thenAnswer(inv -> inv.getArgument(0));
        when(contentMapper.toResponse(any(Content.class))).thenReturn(mock(ContentResponse.class));

        contentService.review(2L, 20L, new ContentReviewRequest(ContentStatus.APPROVED, "great work"));

        assertThat(content.getStatus()).isEqualTo(ContentStatus.APPROVED);
        assertThat(content.getReviewNotes()).hasSize(2);
        assertThat(content.getReviewNotes().get(0).getNoteText()).isEqualTo("fix lighting");
        assertThat(content.getReviewNotes().get(1).getNoteText()).isEqualTo("great work");
    }

    @Test
    void review_rejectsWhenContentNotOwnedByBusiness() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.SUBMITTED).version(1).build();
        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));

        assertThatThrownBy(() -> contentService.review(999L, 20L,
                new ContentReviewRequest(ContentStatus.APPROVED, "ok")))
                .isInstanceOf(ForbiddenActionException.class);
    }

    @Test
    void publish_transitionsApprovedToPublished_andStoresUrlAndTimestamp() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.APPROVED).version(1).build();
        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));
        when(contentRepository.save(any(Content.class))).thenAnswer(inv -> inv.getArgument(0));
        when(contentMapper.toResponse(any(Content.class))).thenReturn(mock(ContentResponse.class));

        contentService.publish(1L, 20L, new ContentPublishRequest("https://www.instagram.com/p/Cabc123/"));

        assertThat(content.getStatus()).isEqualTo(ContentStatus.PUBLISHED);
        assertThat(content.getPostUrl()).isEqualTo("https://www.instagram.com/p/Cabc123/");
        assertThat(content.getPublishedAt()).isNotNull();
    }

    @Test
    void publish_rejectsWhenNotApproved() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.SUBMITTED).version(1).build();
        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));

        assertThatThrownBy(() -> contentService.publish(1L, 20L,
                new ContentPublishRequest("https://www.instagram.com/p/Cabc123/")))
                .isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void publish_rejectsWhenNotOwnedByCreator() {
        Content content = Content.builder().id(20L).application(application).creator(creator).business(business)
                .mediaUrl("old.png").mediaType(MediaType.IMAGE).status(ContentStatus.APPROVED).version(1).build();
        when(contentRepository.findById(20L)).thenReturn(Optional.of(content));

        assertThatThrownBy(() -> contentService.publish(999L, 20L,
                new ContentPublishRequest("https://www.instagram.com/p/Cabc123/")))
                .isInstanceOf(ForbiddenActionException.class);
    }
}
