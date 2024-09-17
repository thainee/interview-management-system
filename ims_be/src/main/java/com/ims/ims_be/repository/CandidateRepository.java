package com.ims.ims_be.repository;

import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.enums.CandidateStatus;
import com.ims.ims_be.utils.AppConstants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    @Query("SELECT c FROM Candidate c LEFT JOIN FETCH c.recruiter r LEFT JOIN FETCH r.account WHERE c.id = :id")
    Optional<Candidate> findByIdWithRecruiter(@Param("id") Integer id);

    @Query("SELECT c FROM Candidate c WHERE c.fullName LIKE %:searchTerm% OR c.email LIKE %:searchTerm% OR c.phoneNumber LIKE %:searchTerm% AND c.status = :status "
            + AppConstants.ORDER_BY_CANDIDATE_STATUS_AND_CREATED_AT)
    Page<Candidate> findByFullNameContainingOrEmailContainingOrPhoneNumberContainingAndStatus(@Param("searchTerm") String searchTerm,
                                                      @Param("status") CandidateStatus status,
                                                      Pageable pageable);

    @Query("SELECT c FROM Candidate c WHERE c.fullName LIKE %:searchTerm% OR c.email LIKE %:searchTerm% OR c.phoneNumber LIKE %:searchTerm% "
            + AppConstants.ORDER_BY_CANDIDATE_STATUS_AND_CREATED_AT)
    Page<Candidate> findByFullNameContainingOrEmailContainingOrPhoneNumberContaining(@Param("searchTerm") String searchTerm,
                                             Pageable pageable);

    @Query("SELECT c FROM Candidate c WHERE c.status = :status "
            + AppConstants.ORDER_BY_CANDIDATE_STATUS_AND_CREATED_AT)
    Page<Candidate> findByStatus(@Param("status") CandidateStatus status,
                                 Pageable pageable);

    @Query("SELECT c FROM Candidate c "
            + AppConstants.ORDER_BY_CANDIDATE_STATUS_AND_CREATED_AT)
    Page<Candidate> findAll(Pageable pageable);

    @Query(value = "select c.* from candidate c\n" +
            "WHERE c.status IN ('PASSED_INTERVIEW','REJECTED_OFFER','DECLINED_OFFER','CANCELLED_OFFER')", nativeQuery = true)
    List<Candidate> findCandidatesForCreateOffer();

    @Query(value = "select c.* from candidate c\n" +
            "WHERE c.status IN ('OPEN')", nativeQuery = true)
    List<Candidate> findCandidateForSchedule();

    Optional<Candidate> findByFullName(String FullName);

    Candidate findByEmail(String email);

}
