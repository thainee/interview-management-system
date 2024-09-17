package com.ims.ims_be.controller;

import com.ims.ims_be.dto.candidate.CandidateCreateOfferResponseDto;
import com.ims.ims_be.dto.offer.OfferCreateUpdateRequestDto;
import com.ims.ims_be.dto.offer.OfferListResponseDto;
import com.ims.ims_be.dto.offer.OfferUpdateDetailResponseDto;
import com.ims.ims_be.dto.user.UserOptionResponseDto;
import com.ims.ims_be.entity.Offer;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.enums.CandidateStatus;
import com.ims.ims_be.enums.OfferStatus;
import com.ims.ims_be.mapper.OfferMapper;
import com.ims.ims_be.service.candidate.CandidateService;
import com.ims.ims_be.service.offer.OfferService;
import com.ims.ims_be.service.offer.OfferServiceImpl;
import com.ims.ims_be.service.user.UserServiceImpl;
import com.ims.ims_be.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {
    private final OfferMapper offerMapper;
    private final CandidateService candidateService;
    private final UserServiceImpl userServiceImpl;
    private final OfferService offerService;

    @GetMapping("/candidates")
    public List<CandidateCreateOfferResponseDto> getCandidates() {
        return offerService.getListCandidateToCreateOffer();
    }

    @GetMapping("/managers")
    public List<UserOptionResponseDto> getManagers() {
        return offerService.getManagers();
    }

    @GetMapping
    public OfferListResponseDto getOfferListResponseDto(
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNumber,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status
    ) {
        return offerService.getOfferListResponseDto(searchTerm, department, status, pageNumber);
    }

    @PostMapping
    public Offer createOffer(@RequestBody OfferCreateUpdateRequestDto offerCreateUpdateRequestDto) {
        return offerService.createOfferByRequestDto(offerCreateUpdateRequestDto);
    }

    @GetMapping("/{id}")
    public OfferUpdateDetailResponseDto viewEditDetailOffer(@PathVariable int id) {
        return offerService.getOfferUpdateDetailResponseDtoByOfferId(id);
    }

    @PutMapping("/{id}")
    public Offer editOffer(@PathVariable int id, @RequestBody OfferCreateUpdateRequestDto offerCreateUpdateRequestDto) {
        if(checkOfferStatusToEditApprovalReject(id)){
            return offerService.updateOfferByRequestDto(id,offerCreateUpdateRequestDto);
        }else {
            throw new RuntimeException("Cannot edit this offer");
        }
    }

    @PutMapping("/approve/{id}")
    public OfferUpdateDetailResponseDto approveOffer(@PathVariable int id) {
        if(checkOfferStatusToEditApprovalReject(id)){
            return offerService.editOfferStatusByOfferId(id, OfferStatus.APPROVED, CandidateStatus.APPROVED_OFFER);
        }else {
            throw new RuntimeException("Cannot approve this offer");
        }
    }

    @PutMapping("/reject/{id}")
    public OfferUpdateDetailResponseDto rejectOffer(@PathVariable int id) {
        if(checkOfferStatusToEditApprovalReject(id)){
            return offerService.editOfferStatusByOfferId(id, OfferStatus.REJECTED, CandidateStatus.REJECTED_OFFER);
        }else {
            throw new RuntimeException("Cannot reject this offer");
        }
    }

    @PutMapping("/sent/{id}")
    public OfferUpdateDetailResponseDto sentOffer(@PathVariable int id) {
            if(checkOfferStatusToSendToCandidate(id)){
            return offerService.editOfferStatusByOfferId(id, OfferStatus.WAITING_FOR_RESPONSE, CandidateStatus.WAITING_FOR_RESPONSE);
        }else {
            throw new RuntimeException("Cannot send this offer");
        }
    }

    @PutMapping("/accept/{id}")
    public OfferUpdateDetailResponseDto acceptOffer(@PathVariable int id) {
        if(checkOfferStatusToAcceptDecline(id)){
            return offerService.editOfferStatusByOfferId(id, OfferStatus.ACCEPTED_OFFER, CandidateStatus.ACCEPTED_OFFER);
        }else {
            throw new RuntimeException("Cannot accept this offer");
        }
    }

    @PutMapping("/decline/{id}")
    public OfferUpdateDetailResponseDto declineOffer(@PathVariable int id) {
        if(checkOfferStatusToAcceptDecline(id)){
            return offerService.editOfferStatusByOfferId(id, OfferStatus.DECLINED_OFFER, CandidateStatus.DECLINED_OFFER);
        }else {
            throw new RuntimeException("Cannot decline this offer");
        }
    }

    @PutMapping("/cancel/{id}")
    public OfferUpdateDetailResponseDto cancelOffer(@PathVariable int id) {
        if(checkOfferStatusToCancel(id)){
            return offerService.editOfferStatusByOfferId(id, OfferStatus.CANCELLED, CandidateStatus.CANCELLED_OFFER);
        }else {
            throw new RuntimeException("Cannot cancel this offer");
        }
    }

    //validate
    private boolean checkOfferStatusToEditApprovalReject(Integer id) {
        return offerService.getOfferById(id).getStatus() == OfferStatus.WAITING_FOR_APPROVAL;
    }

    private boolean checkOfferStatusToSendToCandidate(Integer id) {
        return offerService.getOfferById(id).getStatus() == OfferStatus.APPROVED;
    }

    private boolean checkOfferStatusToAcceptDecline(Integer id) {
        return offerService.getOfferById(id).getStatus() == OfferStatus.WAITING_FOR_RESPONSE;
    }

    private boolean checkOfferStatusToCancel(Integer id) {
        return offerService.getOfferById(id).getStatus() != OfferStatus.CANCELLED;
    }

}
