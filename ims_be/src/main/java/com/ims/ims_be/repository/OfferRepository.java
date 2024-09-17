package com.ims.ims_be.repository;

import com.ims.ims_be.entity.Offer;
import com.ims.ims_be.enums.Department;
import com.ims.ims_be.enums.OfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Integer> {

    @Query(value = "SELECT s.title FROM schedule s WHERE s.candidate_id = :candidateId", nativeQuery = true)
    String findInterviewTitleByCandidateId(@Param("candidateId") int candidateId);

    @Query(value = "SELECT a.username FROM schedule_interviewer si " +
            "INNER JOIN schedule s ON s.id = si.schedule_id " +
            "INNER JOIN user u ON u.id = si.interviewer_id " +
            "INNER JOIN account a ON a.id = u.account_id " +
            "WHERE s.candidate_id = :candidateId", nativeQuery = true)
    List<String> findInterviewerUsernameByCandidateId(@Param("candidateId") int candidateId);

    @Query(value = "SELECT s.note FROM schedule s WHERE s.candidate_id = :candidateId",nativeQuery = true)
    String findInterviewerNoteByCandidateId(@Param("candidateId") int id);

    @Query("SELECT o FROM Offer o " +
            "JOIN o.candidate c " +
            "WHERE c.fullName LIKE %:keyword%")
    Page<Offer> findOffersByCandidateFullNameContains(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT o FROM Offer o " +
            "JOIN o.candidate c " +
            "WHERE c.fullName LIKE %:keyword% " +
            "AND o.department = :department")
    Page<Offer> findOffersByCandidateFullNameContainsAndDepartment(@Param("keyword") String keyword, @Param("department") Department department, Pageable pageable);

    @Query("SELECT o FROM Offer o " +
            "JOIN o.candidate c " +
            "WHERE c.fullName LIKE %:keyword% " +
            "AND o.status = :status")
    Page<Offer> findOffersByCandidateFullNameContainsAndStatus(@Param("keyword") String keyword, @Param("status") OfferStatus status, Pageable pageable);

    @Query("SELECT o FROM Offer o " +
            "JOIN o.candidate c " +
            "WHERE c.fullName LIKE %:keyword% " +
            "AND o.department = :department " +
            "AND o.status = :status")
    Page<Offer> findOffersByCandidateFullNameContainsAndDepartmentAndStatus(@Param("keyword") String keyword, @Param("department") Department department, @Param("status") OfferStatus status, Pageable pageable);



}
