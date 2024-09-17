package com.ims.ims_be.service.offer;

import com.ims.ims_be.dto.candidate.CandidateCreateOfferResponseDto;
import com.ims.ims_be.dto.offer.OfferCreateUpdateRequestDto;
import com.ims.ims_be.dto.offer.OfferListEntityResponseDto;
import com.ims.ims_be.dto.offer.OfferListResponseDto;
import com.ims.ims_be.dto.offer.OfferUpdateDetailResponseDto;
import com.ims.ims_be.dto.user.UserOptionResponseDto;
import com.ims.ims_be.entity.Offer;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.enums.CandidateStatus;
import com.ims.ims_be.enums.Department;
import com.ims.ims_be.enums.OfferStatus;
import com.ims.ims_be.enums.Role;
import com.ims.ims_be.exception.InvalidInputException;
import com.ims.ims_be.mapper.CandidateMapper;
import com.ims.ims_be.mapper.OfferMapper;
import com.ims.ims_be.mapper.UserMapper;
import com.ims.ims_be.repository.CandidateRepository;
import com.ims.ims_be.repository.OfferRepository;
import com.ims.ims_be.repository.UserRepository;
import com.ims.ims_be.service.candidate.CandidateService;
import com.ims.ims_be.service.user.UserServiceImpl;
import com.ims.ims_be.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferServiceImpl implements OfferService {
    private final OfferRepository offerRepository;
    private final OfferMapper offerMapper;
    private final CandidateMapper candidateMapper;
    private final CandidateRepository candidateRepository;
    private final CandidateService candidateService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserServiceImpl userService;

    // Create
    @Override
    public Offer createOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    @Override
    public Offer createOfferByRequestDto(OfferCreateUpdateRequestDto offerCreateUpdateRequestDto) {
        if (checkCandidateToCreateOffer(Integer.valueOf(offerCreateUpdateRequestDto.getCandidateId()))) {
            Offer newOffer = offerMapper.offerCreateUpdateRequestDtoToOffer(offerCreateUpdateRequestDto);

            Candidate newCandidate = candidateService.getDefaultCandidateById(Integer.parseInt(offerCreateUpdateRequestDto.getCandidateId()));
            newCandidate.setRecruiter(userService.findUserByUserId(offerCreateUpdateRequestDto.getRecruiterId()));
            newCandidate.setStatus(CandidateStatus.WAITING_FOR_APPROVAL);

            User newApprovedBy = userService.findUserByUserId(offerCreateUpdateRequestDto.getApprovedById());

            newOffer.setCandidate(newCandidate);
            newOffer.setApprovedBy(newApprovedBy);
            newOffer.setStatus(OfferStatus.WAITING_FOR_APPROVAL);
            newOffer.setUpdatedBy(userRepository.getById(getUserIdAuthentication()));
            return createOffer(newOffer);
        } else {
            throw new RuntimeException("Candidate is not available to create");
        }
    }

    // Read
    @Override
    public Offer getOfferById(int offerId) {
        return offerRepository.findById(offerId).orElseThrow(() -> new RuntimeException("Offer not found"));
    }

    @Override
    public List<OfferListEntityResponseDto> getAllOffers() {
        return offerMapper.offersToOfferListEntityResponseDtos(offerRepository.findAll());
    }

    @Override
    public OfferUpdateDetailResponseDto getOfferUpdateDetailResponseDtoByOfferId(Integer id) {
        Offer offer = getOfferById(id);
        OfferUpdateDetailResponseDto offerUpdateDetailResponseDto = offerMapper.offerToOfferUpdateDetailResponseDto(offer);
        offerUpdateDetailResponseDto.setInterviewInfo(getInterviewInfo(offer.getCandidate()));
        offerUpdateDetailResponseDto.setInterviewerNote(getInterviewNote(offer.getCandidate()));
        return offerUpdateDetailResponseDto;
    }

    @Override
    public OfferListResponseDto getOfferListResponseDto(String searchTerm, String departmentString, String offerStatusString, int pageNumber) {
        Department department = validateDepartmentStatus(departmentString);
        OfferStatus offerStatus = validateOfferStatus(offerStatusString);
        Pageable pageable = PageRequest.of(pageNumber, AppConstants.DEFAULT_PAGE_SIZE);
        Page<Offer> offers = fetchOffers(searchTerm, department, offerStatus, pageable);
        return offerMapper.offersToOfferListResponseDto(offers);
    }

    private Page<Offer> fetchOffers(String searchTerm, Department department, OfferStatus offerStatus, Pageable pageable) {
        if (searchTerm == null) {
            searchTerm = "";
        }
        if (department == null) {
            return (offerStatus == null) ? offerRepository.findOffersByCandidateFullNameContains(searchTerm, pageable) : offerRepository.findOffersByCandidateFullNameContainsAndStatus(searchTerm, offerStatus, pageable);
        } else {
            return (offerStatus == null) ? offerRepository.findOffersByCandidateFullNameContainsAndDepartment(searchTerm, department, pageable) : offerRepository.findOffersByCandidateFullNameContainsAndDepartmentAndStatus(searchTerm, department, offerStatus, pageable);
        }
    }

    @Override
    public String getInterviewInfo(Candidate candidate) {
        int candidateId = candidate.getId();
        String interviewTitle = offerRepository.findInterviewTitleByCandidateId(candidateId);
        List<String> interviewerUsernames = offerRepository.findInterviewerUsernameByCandidateId(candidateId);

        StringBuilder result = new StringBuilder();
        result.append(interviewTitle).append("\n");
        if (!interviewerUsernames.isEmpty()) {
            String interviewerList = interviewerUsernames.stream().collect(Collectors.joining(", "));
            result.append("Interviewer: ").append(interviewerList);
        }
        return result.toString();
    }

    @Override
    public String getInterviewNote(Candidate candidate) {
        return offerRepository.findInterviewerNoteByCandidateId(candidate.getId());
    }

    @Override
    public List<CandidateCreateOfferResponseDto> getListCandidateToCreateOffer() {
        List<CandidateCreateOfferResponseDto> candidateCreateOfferResponseDtos = new ArrayList<>();
        List<Candidate> candidates = candidateRepository.findCandidatesForCreateOffer();
        for (Candidate candidate : candidates) {
            CandidateCreateOfferResponseDto newCandidateCreateOfferResponseDto = candidateMapper.candidateToCandidateCreateOfferResponseDto(candidate);
            newCandidateCreateOfferResponseDto.setInterviewInfo(getInterviewInfo(candidate));
            newCandidateCreateOfferResponseDto.setInterviewNote(getInterviewNote(candidate));
            candidateCreateOfferResponseDtos.add(newCandidateCreateOfferResponseDto);
        }
        return candidateCreateOfferResponseDtos;
    }

    @Override
    public List<UserOptionResponseDto> getManagers() {
        List<User> users = userRepository.findAllUsersWithAccountsByRole(Role.MANAGER);
        return userMapper.usersToRecruiterDtos(users);
    }

    // Update
    @Override
    public Offer updateOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    @Override
    public Offer updateOfferByRequestDto(Integer id, OfferCreateUpdateRequestDto offerCreateUpdateRequestDto) {
        if (checkCandidateToUpdateOffer(id, Integer.valueOf(offerCreateUpdateRequestDto.getCandidateId()))) {
            Offer oldoffer = getOfferById(id);
            Offer newOffer = offerMapper.offerCreateUpdateRequestDtoToOffer(offerCreateUpdateRequestDto);

            Candidate newCandidate = oldoffer.getCandidate();
            newCandidate.setRecruiter(userService.findUserByUserId(offerCreateUpdateRequestDto.getRecruiterId()));

            User newApprovedBy = userService.findUserByUserId(offerCreateUpdateRequestDto.getApprovedById());

            newOffer.setId(id);
            newOffer.setCandidate(newCandidate);
            newOffer.setApprovedBy(newApprovedBy);
            newOffer.setStatus(oldoffer.getStatus());
            newOffer.setCreatedAt(getOfferById(id).getCreatedAt());
            newOffer.setUpdatedBy(userRepository.getById(getUserIdAuthentication()));

            return updateOffer(newOffer);
        } else {
            throw new RuntimeException("Candidate cannot be updated");
        }
    }

    @Override
    public OfferUpdateDetailResponseDto editOfferStatusByOfferId(Integer offerId, OfferStatus offerStatus, CandidateStatus candidateStatus) {

        Offer offer = getOfferById(offerId);
        Candidate candidate = candidateService.getDefaultCandidateById(offer.getCandidate().getId());
        candidate.setStatus(candidateStatus);
        offer.setCandidate(candidate);
        offer.setStatus(offerStatus);
        offer.setUpdatedBy(userRepository.getById(getUserIdAuthentication()));

        return getOfferUpdateDetailResponseDtoByOfferId(offerRepository.save(offer).getId());
    }


    //Validate
    private OfferStatus validateOfferStatus(String offerStatus) {
        if (offerStatus == null || offerStatus.isBlank()) {
            return null;
        }
        try {
            return OfferStatus.valueOf(offerStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("OfferStatus", offerStatus);
        }
    }

    private Department validateDepartmentStatus(String department) {
        if (department == null || department.isBlank()) {
            return null;
        }
        try {
            return Department.valueOf(department.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Department", department);
        }
    }

    private boolean checkCandidateToCreateOffer(Integer candidateId) {
        return candidateRepository.findCandidatesForCreateOffer().stream().anyMatch(candidate -> candidate.getId().equals(candidateId));
    }

    private boolean checkCandidateToUpdateOffer(Integer offerId, Integer candidateId) {
        return getOfferById(offerId).getCandidate().getId() == candidateId;
    }

    private int getUserIdAuthentication(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return Integer.parseInt(jwt.getClaimAsString("userId"));
        } else {
            throw new RuntimeException("User is not authenticated");
        }
    }

}
