package com.ims.ims_be.repository;

import com.ims.ims_be.entity.job.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Integer> {

    @Query("SELECT j FROM Job j WHERE j.title LIKE %:searchTerm% ORDER BY " +
            "CASE WHEN j.status = 'Open' THEN 1 " +
            "WHEN j.status = 'Draft' THEN 2 " +
            "WHEN j.status = 'Closed' THEN 3 " +
            "ELSE 4 END, " +
            "j.startDate DESC")
    Page<Job> findByTitleContaining(@Param("searchTerm") String searchTerm, Pageable pageable);
    @Query("SELECT j FROM Job j WHERE j.title LIKE %:searchTerm% AND j.status = :status ORDER BY " +
            "CASE WHEN j.status = 'Open' THEN 1 " +
            "WHEN j.status = 'Draft' THEN 2 " +
            "WHEN j.status = 'Closed' THEN 3 " +
            "ELSE 4 END, " +
            "j.startDate DESC")
    Page<Job> findByTitleContainingAndStatus(@Param("searchTerm") String searchTerm, @Param("status") String status, Pageable pageable);
    Page<Job> findByStatus(String status, Pageable pageable);
    @Query("SELECT j FROM Job j ORDER BY " +
            "CASE WHEN j.status = 'Open' THEN 1 " +
            "WHEN j.status = 'Draft' THEN 2 " +
            "WHEN j.status = 'Closed' THEN 3 " +
            "ELSE 4 END, " +
            "j.startDate DESC")
    Page<Job> findAllSortedByStatusAndCreatedDate(Pageable pageable);
    boolean existsByTitleIgnoreCase(String title); //etc
    Optional<Job> findByTitle(String title);

}
