package com.ims.ims_be.service.file;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    @Override
    public ResponseEntity<Resource> downloadFile(String fileName) {
        // Đường dẫn đến thư mục lưu trữ file

        String relativePath = "src/main/java/com/ims/ims_be/uploads"; // Đường dẫn tương đối
        Path absolutePath = Paths.get(System.getProperty("user.dir"), relativePath);
        String fullPath = absolutePath.toString();

        // Tạo đối tượng Resource từ file
        File file = new File(fullPath + File.separator + fileName);
        Resource resource = new FileSystemResource(file);

        // Thiết lập các thông tin header cho phản hồi
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }
}
