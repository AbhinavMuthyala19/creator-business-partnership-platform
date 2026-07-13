package club.escobar.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction over where uploaded media files physically live. The local-disk
 * implementation is used today; a future S3 (or other object store) implementation
 * can be swapped in via a new @Service bean without touching any calling code.
 */
public interface StorageService {

    StoredFile store(MultipartFile file);
}
