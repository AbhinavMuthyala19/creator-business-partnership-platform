package club.escobar.service.impl;

import club.escobar.dto.campaign.CampaignCreateRequest;
import club.escobar.dto.campaign.CampaignResponse;
import club.escobar.dto.campaign.CampaignUpdateRequest;
import club.escobar.dto.common.PageResponse;
import club.escobar.entity.Campaign;
import club.escobar.entity.User;
import club.escobar.entity.enums.CampaignStatus;
import club.escobar.entity.enums.UserRole;
import club.escobar.exception.ForbiddenActionException;
import club.escobar.exception.InvalidStateTransitionException;
import club.escobar.exception.ResourceNotFoundException;
import club.escobar.mapper.CampaignMapper;
import club.escobar.repository.CampaignRepository;
import club.escobar.repository.UserRepository;
import club.escobar.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {

    private static final Logger log = LoggerFactory.getLogger(CampaignServiceImpl.class);

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final CampaignMapper campaignMapper;

    @Override
    @Transactional
    public CampaignResponse create(Long businessUserId, CampaignCreateRequest request) {
        User business = userRepository.findById(businessUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (business.getRole() != UserRole.BUSINESS) {
            throw new ForbiddenActionException("Only businesses can create campaigns");
        }
        if (request.endDate().isBefore(request.startDate())) {
            throw new InvalidStateTransitionException("Campaign end date cannot be before its start date");
        }

        Campaign campaign = campaignRepository.save(Campaign.builder()
                .business(business)
                .title(request.title())
                .description(request.description())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .ratePerThousandViewsInr(request.ratePerThousandViewsInr())
                .status(CampaignStatus.DRAFT)
                .build());

        log.info("Business id={} created campaign id={}", businessUserId, campaign.getId());
        return campaignMapper.toResponse(campaign);
    }

    @Override
    @Transactional
    public CampaignResponse update(Long businessUserId, Long campaignId, CampaignUpdateRequest request) {
        Campaign campaign = findById(campaignId);
        if (!campaign.getBusiness().getId().equals(businessUserId)) {
            throw new ForbiddenActionException("You may only edit your own campaigns");
        }
        if (request.endDate().isBefore(request.startDate())) {
            throw new InvalidStateTransitionException("Campaign end date cannot be before its start date");
        }

        campaign.setTitle(request.title());
        campaign.setDescription(request.description());
        campaign.setStartDate(request.startDate());
        campaign.setEndDate(request.endDate());
        campaign.setRatePerThousandViewsInr(request.ratePerThousandViewsInr());
        campaign.setStatus(request.status());

        Campaign saved = campaignRepository.save(campaign);
        log.info("Business id={} updated campaign id={} (status={})", businessUserId, campaignId, request.status());
        return campaignMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CampaignResponse> listPublic(String search, Pageable pageable) {
        String normalizedSearch = StringUtils.hasText(search) ? search.trim() : null;
        Page<CampaignResponse> page = campaignRepository.searchPublic(normalizedSearch, pageable)
                .map(campaignMapper::toResponse);
        return PageResponse.of(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CampaignResponse> listMine(Long businessUserId, Pageable pageable) {
        Page<CampaignResponse> page = campaignRepository.findByBusiness_Id(businessUserId, pageable)
                .map(campaignMapper::toResponse);
        return PageResponse.of(page);
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignResponse getById(Long campaignId) {
        return campaignMapper.toResponse(findById(campaignId));
    }

    private Campaign findById(Long campaignId) {
        return campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id " + campaignId));
    }
}
