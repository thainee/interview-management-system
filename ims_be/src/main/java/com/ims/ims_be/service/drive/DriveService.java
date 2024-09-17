package com.ims.ims_be.service.drive;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.FileContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
public class DriveService {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    private static final String SERVICE_ACCOUNT_KEY_PATH = getPathToGoogleCredentials();

    private static String getPathToGoogleCredentials() {
        String currentDirectory = System.getProperty("user.dir");
        Path filePath = Paths.get(currentDirectory, "DriveManage.json");
        return filePath.toString();
    }

    public Res uploadFileToDrive(File file, String contentType, String originalFileName) throws GeneralSecurityException, IOException {
        Res res = new Res();

        try {
            String folderId = "11xIjY8TY7rjNrsOOkYhnrea3btjVz838";
            Drive drive = createDriveService();
            com.google.api.services.drive.model.File fileMetaData = new com.google.api.services.drive.model.File();
            fileMetaData.setName(originalFileName);
            fileMetaData.setParents(Collections.singletonList(folderId));
            FileContent fileContent = new FileContent(contentType, file);
            com.google.api.services.drive.model.File uploadFile = drive.files().create(fileMetaData, fileContent)
                    .setFields("id")
                    .execute();
            String imageUrl = "https://drive.google.com/uc?export=view&id=" + uploadFile.getId();
            file.delete();
            res.setStatus(200);
            res.setMessage("File successfully uploaded to Drive");
            res.setUrl(imageUrl);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            res.setStatus(500);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    private Drive createDriveService() throws GeneralSecurityException, IOException {
        GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream(SERVICE_ACCOUNT_KEY_PATH))
                .createScoped(Collections.singleton(DriveScopes.DRIVE));
        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                credential)
                .build();
    }
}
