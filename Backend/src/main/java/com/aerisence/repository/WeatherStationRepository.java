package com.aerisence.repository;

import com.aerisence.entity.StationStatus;
import com.aerisence.entity.WeatherStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherStationRepository extends JpaRepository<WeatherStation, Long> {
    Optional<WeatherStation> findByStationCode(String stationCode);
    List<WeatherStation> findByStatus(StationStatus status);
    List<WeatherStation> findByRegionIgnoreCase(String region);
    
    @Query("SELECT COUNT(s) FROM WeatherStation s WHERE s.status = 'ONLINE'")
    long countOnlineStations();

    @Query("SELECT COUNT(s) FROM WeatherStation s WHERE s.status = 'OFFLINE'")
    long countOfflineStations();

    @Query("SELECT COUNT(s) FROM WeatherStation s WHERE s.status = 'DEGRADED'")
    long countDegradedStations();
}
