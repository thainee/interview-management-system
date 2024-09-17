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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OfferService {
    // Create
    Offer createOffer(Offer offer);

    Offer createOfferByRequestDto(OfferCreateUpdateRequestDto offerCreateUpdateRequestDto);

    // Read
    Offer getOfferById(int offerId);

    List<OfferListEntityResponseDto> getAllOffers();

    OfferUpdateDetailResponseDto getOfferUpdateDetailResponseDtoByOfferId(Integer id);

    OfferListResponseDto getOfferListResponseDto(String searchTerm, String departmentString, String offerStatusString, int pageNumber);

    String getInterviewInfo(Candidate candidate);

    String getInterviewNote(Candidate candidate);

    List<CandidateCreateOfferResponseDto> getListCandidateToCreateOffer();

    List<UserOptionResponseDto> getManagers();

    // Update
    Offer updateOffer(Offer offer);

    OfferUpdateDetailResponseDto editOfferStatusByOfferId(Integer offerId, OfferStatus offerStatus, CandidateStatus candidateStatus);

    Offer updateOfferByRequestDto(Integer id,OfferCreateUpdateRequestDto offerCreateUpdateRequestDto);

}
