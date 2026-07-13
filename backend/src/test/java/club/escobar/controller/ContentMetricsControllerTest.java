package club.escobar.controller;

import club.escobar.dto.common.PageResponse;
import club.escobar.dto.metrics.ContentMetricsSnapshotResponse;
import club.escobar.entity.User;
import club.escobar.entity.enums.UserRole;
import club.escobar.exception.RateLimitExceededException;
import club.escobar.security.JwtAuthenticationFilter;
import club.escobar.security.SecurityUser;
import club.escobar.service.ContentMetricsService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ContentMetricsController.class)
@AutoConfigureMockMvc(addFilters = false)
class ContentMetricsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContentMetricsService contentMetricsService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUpSecurityContext() {
        User user = User.builder().id(1L).email("creator@test.com").role(UserRole.CREATOR).active(true).build();
        SecurityUser principal = new SecurityUser(user);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities()));
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void sync_returns201_withSnapshotBody() throws Exception {
        when(contentMetricsService.syncMetrics(any(), any())).thenReturn(
                new ContentMetricsSnapshotResponse(1L, 20L, 10L, 2L, 100L, Instant.now()));

        mockMvc.perform(post("/api/content/20/metrics/sync"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.likeCount").value(10))
                .andExpect(jsonPath("$.viewCount").value(100));
    }

    @Test
    void sync_propagates429_whenServiceThrowsRateLimitExceeded() throws Exception {
        when(contentMetricsService.syncMetrics(any(), any()))
                .thenThrow(new RateLimitExceededException("Metrics were synced recently"));

        mockMvc.perform(post("/api/content/20/metrics/sync"))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void history_returns200_withPagedSnapshots() throws Exception {
        var snapshot = new ContentMetricsSnapshotResponse(1L, 20L, 10L, 2L, 100L, Instant.now());
        when(contentMetricsService.getMetricsHistory(any(), any(), any()))
                .thenReturn(new PageResponse<>(List.of(snapshot), 0, 20, 1, 1, true));

        mockMvc.perform(get("/api/content/20/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].likeCount").value(10));
    }
}
