package com.aerisence.repository;

import com.aerisence.entity.Anomaly;
import com.aerisence.entity.AnomalySeverity;
import com.aerisence.entity.AnomalyStatus;
import com.aerisence.entity.SensorParameter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnomalyRepository extends JpaRepository<Anomaly, Long> {
    
    List<Anomaly> findByStatusOrderByDetectedAtDesc(AnomalyStatus status);
    
    List<Anomaly> findByWeatherStationIdOrderByDetectedAtDesc(Long weatherStationId);

    @Query("SELECT a FROM Anomaly a WHERE " +
           "(:stationId IS NULL OR a.weatherStation.id = :stationId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:severity IS NULL OR a.severity = :severity) AND " +
           "(:parameter IS NULL OR a.parameter = :parameter) " +
           "ORDER BY a.detectedAt DESC")
    List<Anomaly> searchAnomalies(
            @Param("stationId") Long stationId,
            @Param("status") AnomalyStatus status,
            @Param("severity") AnomalySeverity severity,
            @Param("parameter") SensorParameter parameter,
            Pageable pageable
    );

    long countByStatus(AnomalyStatus status);
    
    long countBySeverity(AnomalySeverity severity);

    @Query("SELECT COUNT(a) FROM Anomaly a WHERE a.status = 'OPEN'")
    long countActiveAnomalies();

    @Query("SELECT a.parameter, COUNT(a) FROM Anomaly a GROUP BY a.parameter")
    List<Object[]> countByParameterGroup();

    @Query("SELECT a.anomalyType, COUNT(a) FROM Anomaly a GROUP BY a.anomalyType")
    List<Object[]> countByAnomalyTypeGroup();
}
