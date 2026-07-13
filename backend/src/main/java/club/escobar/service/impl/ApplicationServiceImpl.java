package club.escobar.service.impl;

import club.escobar.dto.application.ApplicationCreateRequest;
import club.escobar.dto.application.ApplicationResponse;
import club.escobar.dto.application.ApplicationStatusUpdateRequest;
import club.escobar.dto.common.PageResponse;
import club.escobar.entity.Application;
import club.escobar.entity.Campaign;
import club.escobar.entity.User;
import club.escobar.entity.enums.ApplicationStatus;
import club.escobar.entity.enums.UserRole;
import club.escobar.exception.DuplicateResourceException;
import club.escobar.exception.ForbiddenActionException;
import club.escobar.exception.InvalidStateTransitionException;
import club.escobar.exception.ResourceNotFoundException;
import club.escobar.mapper.ApplicationMapper;
import club.escobar.repository.ApplicationRepository;
import club.escobar.repository.CampaignRepository;
import club.escobar.repository.UserRepository;
import club.escobar.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationServiceImpl.class);

    private final ApplicationRepository applicationRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final ApplicationMapper applicationMapper;

    @Override
    @Transactional
    public ApplicationResponse create(Long creatorUserId, ApplicationCreateRequest request) {
        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (creator.getRole() != UserRole.CREATOR) {
            throw new ForbiddenActionException("Only creators can submit applications");
        }

        Campaign campaign = campaignRepository.findById(request.campaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id " + request.campaignId()));
        if (!campaign.isAcceptingApplications()) {
            throw new InvalidStateTransitionException(
                    "This campaign is not currently accepting applications (status: " + campaign.getStatus() + ")");
        }

        if (applicationRepository.findByCreator_IdAndCampaign_Id(creator.getId(), campaign.getId()).isPresent()) {
            throw new DuplicateResourceException("You have already applied to this campaign");
        }

        Application application = applicationRepository.save(Application.builder()
                .creator(creator)
                .campaign(campaign)
                .pitchMessage(request.pitchMessage())
                .status(ApplicationStatus.PENDING)
                .build());

        log.info("Creator id={} applied to campaign id={} (application id={})", creator.getId(), campaign.getId(), application.getId());
        return applicationMapper.toResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> listForCreator(Long creatorUserId, Pageable pageable) {
        Page<ApplicationResponse> page = applicationRepository.findByCreator_Id(creatorUserId, pageable)
                .map(applicationMapper::toResponse);
        return PageResponse.of(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> listForCampaign(Long requestingUserId, Long campaignId,
                                                              ApplicationStatus status, Pageable pageable) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id " + campaignId));
        if (!campaign.getBusiness().getId().equals(requestingUserId)) {
            throw new ForbiddenActionException("You may only view applications for your own campaign");
        }

        Page<Application> page = status != null
                ? applicationRepository.findByCampaign_IdAndStatus(campaignId, status, pageable)
                : applicationRepository.findByCampaign_Id(campaignId, pageable);

        return PageResponse.of(page.map(applicationMapper::toResponse));
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(Long businessUserId, Long applicationId, ApplicationStatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + applicationId));

        if (!application.getCampaign().getBusiness().getId().equals(businessUserId)) {
            throw new ForbiddenActionException("You may only review applications submitted to your own business");
        }
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new InvalidStateTransitionException(
                    "Cannot change status of an application that is already " + application.getStatus());
        }
        if (request.status() == ApplicationStatus.PENDING) {
            throw new InvalidStateTransitionException("Cannot set application status back to PENDING");
        }

        application.setStatus(request.status());
        application.setReviewNote(request.reviewNote());
        application.setReviewedAt(Instant.now());

        Application saved = applicationRepository.save(application);
        log.info("Application id={} reviewed by business id={}: {}", applicationId, businessUserId, request.status());
        return applicationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getById(Long applicationId) {
        return applicationMapper.toResponse(applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + applicationId)));
    }
}
