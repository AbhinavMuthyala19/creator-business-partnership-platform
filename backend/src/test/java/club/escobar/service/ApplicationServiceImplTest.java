package club.escobar.service;

import club.escobar.dto.application.ApplicationCreateRequest;
import club.escobar.dto.application.ApplicationResponse;
import club.escobar.dto.application.ApplicationStatusUpdateRequest;
import club.escobar.entity.Application;
import club.escobar.entity.User;
import club.escobar.entity.enums.ApplicationStatus;
import club.escobar.entity.enums.UserRole;
import club.escobar.exception.DuplicateResourceException;
import club.escobar.exception.ForbiddenActionException;
import club.escobar.exception.InvalidStateTransitionException;
import club.escobar.exception.ResourceNotFoundException;
import club.escobar.mapper.ApplicationMapper;
import club.escobar.repository.ApplicationRepository;
import club.escobar.repository.UserRepository;
import club.escobar.service.impl.ApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceImplTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ApplicationMapper applicationMapper;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private User creator;
    private User business;

    @BeforeEach
    void setUp() {
        creator = User.builder().id(1L).email("creator@test.com").role(UserRole.CREATOR).active(true).build();
        business = User.builder().id(2L).email("business@test.com").role(UserRole.BUSINESS).active(true).build();
    }

    @Test
    void create_savesPendingApplication_whenNoneExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(creator));
        when(userRepository.findById(2L)).thenReturn(Optional.of(business));
        when(applicationRepository.findByCreator_IdAndBusiness_Id(1L, 2L)).thenReturn(Optional.empty());
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));
        when(applicationMapper.toResponse(any())).thenReturn(mock(ApplicationResponse.class));

        applicationService.create(1L, new ApplicationCreateRequest(2L, "Great fit for your brand"));

        var captor = org.mockito.ArgumentCaptor.forClass(Application.class);
        verify(applicationRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(ApplicationStatus.PENDING);
        assertThat(captor.getValue().getCreator()).isEqualTo(creator);
        assertThat(captor.getValue().getBusiness()).isEqualTo(business);
    }

    @Test
    void create_rejectsDuplicateApplication() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(creator));
        when(userRepository.findById(2L)).thenReturn(Optional.of(business));
        when(applicationRepository.findByCreator_IdAndBusiness_Id(1L, 2L))
                .thenReturn(Optional.of(new Application()));

        assertThatThrownBy(() -> applicationService.create(1L, new ApplicationCreateRequest(2L, "Hello")))
                .isInstanceOf(DuplicateResourceException.class);

        verify(applicationRepository, never()).save(any());
    }

    @Test
    void create_rejectsWhenApplicantIsNotACreator() {
        User businessApplicant = User.builder().id(3L).email("b2@test.com").role(UserRole.BUSINESS).active(true).build();
        when(userRepository.findById(3L)).thenReturn(Optional.of(businessApplicant));

        assertThatThrownBy(() -> applicationService.create(3L, new ApplicationCreateRequest(2L, "Hello")))
                .isInstanceOf(ForbiddenActionException.class);
    }

    @Test
    void updateStatus_transitionsPendingToApproved() {
        Application application = Application.builder()
                .id(10L).creator(creator).business(business).status(ApplicationStatus.PENDING)
                .pitchMessage("pitch").build();
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(inv -> inv.getArgument(0));
        when(applicationMapper.toResponse(any())).thenReturn(mock(ApplicationResponse.class));

        applicationService.updateStatus(2L, 10L, new ApplicationStatusUpdateRequest(ApplicationStatus.APPROVED, "Welcome aboard"));

        assertThat(application.getStatus()).isEqualTo(ApplicationStatus.APPROVED);
        assertThat(application.getReviewNote()).isEqualTo("Welcome aboard");
        assertThat(application.getReviewedAt()).isNotNull();
    }

    @Test
    void updateStatus_rejectsWhenAlreadyDecided() {
        Application application = Application.builder()
                .id(10L).creator(creator).business(business).status(ApplicationStatus.APPROVED)
                .pitchMessage("pitch").build();
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(2L, 10L,
                new ApplicationStatusUpdateRequest(ApplicationStatus.REJECTED, null)))
                .isInstanceOf(InvalidStateTransitionException.class);
    }

    @Test
    void updateStatus_rejectsWhenNotOwningBusiness() {
        Application application = Application.builder()
                .id(10L).creator(creator).business(business).status(ApplicationStatus.PENDING)
                .pitchMessage("pitch").build();
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(99L, 10L,
                new ApplicationStatusUpdateRequest(ApplicationStatus.APPROVED, null)))
                .isInstanceOf(ForbiddenActionException.class);
    }

    @Test
    void create_throwsWhenBusinessNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(creator));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.create(1L, new ApplicationCreateRequest(2L, "Hello")))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
