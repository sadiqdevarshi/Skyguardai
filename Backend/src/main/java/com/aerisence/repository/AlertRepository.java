package com.aerisence.repository;

import com.aerisence.entity.Alert;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByAcknowledgedFalseOrderByCreatedAtDesc();
    List<Alert> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByAcknowledgedFalse();
}
