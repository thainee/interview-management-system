package com.ims.ims_be.service.file;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

public interface FileService {
    ResponseEntity<Resource> downloadFile(String fileName);
}
