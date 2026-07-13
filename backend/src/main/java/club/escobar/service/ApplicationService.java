package club.escobar.service;

import club.escobar.dto.application.ApplicationCreateRequest;
import club.escobar.dto.application.ApplicationResponse;
import club.escobar.dto.application.ApplicationStatusUpdateRequest;
import club.escobar.dto.common.PageResponse;
import club.escobar.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Pageable;

public interface ApplicationService {

    ApplicationResponse create(Long creatorUserId, ApplicationCreateRequest request);

    PageResponse<ApplicationResponse> listForCreator(Long creatorUserId, Pageable pageable);

    PageResponse<ApplicationResponse> listForBusiness(Long requestingUserId, Long businessId,
                                                       ApplicationStatus status, Pageable pageable);

    ApplicationResponse updateStatus(Long businessUserId, Long applicationId, ApplicationStatusUpdateRequest request);

    ApplicationResponse getById(Long applicationId);
}
