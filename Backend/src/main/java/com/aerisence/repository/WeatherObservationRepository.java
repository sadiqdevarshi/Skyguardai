package com.aerisence.repository;

import com.aerisence.entity.WeatherObservation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherObservationRepository extends JpaRepository<WeatherObservation, Long> {
    
    List<WeatherObservation> findByWeatherStationIdOrderByTimestampDesc(Long weatherStationId, Pageable pageable);

    @Query("SELECT o FROM WeatherObservation o WHERE o.weatherStation.id = :stationId AND o.timestamp BETWEEN :start AND :end ORDER BY o.timestamp ASC")
    List<WeatherObservation> findByStationAndDateRange(@Param("stationId") Long stationId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT o FROM WeatherObservation o WHERE o.weatherStation.id = :stationId ORDER BY o.timestamp DESC")
    List<WeatherObservation> findTop50ByStationIdOrderByTimestampDesc(@Param("stationId") Long stationId);

    Optional<WeatherObservation> findFirstByWeatherStationIdOrderByTimestampDesc(Long weatherStationId);

    @Query("SELECT AVG(o.temperature), AVG(o.atmosphericPressure), AVG(o.relativeHumidity) FROM WeatherObservation o WHERE o.timestamp >= :since")
    List<Object[]> getNetworkAverages(@Param("since") LocalDateTime since);
}
