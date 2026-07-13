package club.escobar.controller;

import club.escobar.dto.common.MediaUploadResponse;
import club.escobar.storage.StorageService;
import club.escobar.storage.StoredFile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class MediaController {

    private final StorageService storageService;

    @PostMapping(value = "/api/media/upload", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MediaUploadResponse> upload(@RequestParam("file") MultipartFile file) {
        StoredFile stored = storageService.store(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MediaUploadResponse(stored.url(), stored.contentType(), stored.sizeBytes()));
    }
}
