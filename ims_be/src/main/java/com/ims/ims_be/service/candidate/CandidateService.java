package com.ims.ims_be.service.candidate;

import com.ims.ims_be.dto.candidate.CandidateDetailDto;
import com.ims.ims_be.dto.candidate.CandidateDto;
import com.ims.ims_be.dto.candidate.CandidateListResponse;
import com.ims.ims_be.dto.candidate.CandidateRequestDto;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.enums.CandidateStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

public interface CandidateService {
    CandidateListResponse getCandidates(String searchTerm, String status, int pageNumber);
    CandidateDetailDto getCandidateById(Integer id);
    Candidate getDefaultCandidateById(Integer id);
    CandidateRequestDto getEditCandidateById(Integer id);
    CandidateDetailDto createCandidate(CandidateRequestDto candidateRequestDto, MultipartFile file) throws IOException, GeneralSecurityException;
    CandidateDetailDto updateCandidate(Integer id, CandidateRequestDto candidateRequestDto, MultipartFile file) throws IOException, GeneralSecurityException;
    void deleteCandidate(Integer id);
    CandidateDetailDto banCandidate(Integer id);
    void updateCandidateStatus(Integer id, CandidateStatus status);
    List<CandidateDetailDto> getListCandidateForSchedule();
}
