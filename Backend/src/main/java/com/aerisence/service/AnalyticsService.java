package com.aerisence.service;

import com.aerisence.dto.AnalyticsSummaryDto;
import com.aerisence.entity.AnomalySeverity;
import com.aerisence.entity.AnomalyStatus;
import com.aerisence.repository.AlertRepository;
import com.aerisence.repository.AnomalyRepository;
import com.aerisence.repository.WeatherObservationRepository;
import com.aerisence.repository.WeatherStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private WeatherStationRepository stationRepository;

    @Autowired
    private AnomalyRepository anomalyRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private WeatherObservationRepository observationRepository;

    @Transactional(readOnly = true)
    public AnalyticsSummaryDto getSystemAnalyticsSummary() {
        AnalyticsSummaryDto dto = new AnalyticsSummaryDto();

        long totalStations = stationRepository.count();
        long online = stationRepository.countOnlineStations();
        long degraded = stationRepository.countDegradedStations();
        long offline = stationRepository.countOfflineStations();

        dto.setTotalStations(totalStations);
        dto.setOnlineStations(online);
        dto.setDegradedStations(degraded);
        dto.setOfflineStations(offline);

        dto.setTotalAnomalies(anomalyRepository.count());
        dto.setOpenAnomalies(anomalyRepository.countActiveAnomalies());
        dto.setCriticalAnomalies(anomalyRepository.countBySeverity(AnomalySeverity.CRITICAL));
        dto.setUnacknowledgedAlerts(alertRepository.countByAcknowledgedFalse());

        // Averages in last 24h
        List<Object[]> averages = observationRepository.getNetworkAverages(LocalDateTime.now().minusHours(24));
        if (!averages.isEmpty() && averages.get(0) != null && averages.get(0)[0] != null) {
            Object[] row = averages.get(0);
            dto.setNetworkAvgTemperature(row[0] != null ? Math.round(((Double) row[0]) * 10.0) / 10.0 : 18.5);
            dto.setNetworkAvgPressure(row[1] != null ? Math.round(((Double) row[1]) * 10.0) / 10.0 : 1012.8);
            dto.setNetworkAvgHumidity(row[2] != null ? Math.round(((Double) row[2]) * 10.0) / 10.0 : 62.4);
        } else {
            dto.setNetworkAvgTemperature(18.5);
            dto.setNetworkAvgPressure(1012.8);
            dto.setNetworkAvgHumidity(62.4);
        }

        // Network Health Index Calculation
        double healthIndex = 100.0;
        if (totalStations > 0) {
            double onlineRatio = (double) online / totalStations;
            double anomalyPenalty = Math.min(30.0, dto.getOpenAnomalies() * 3.5);
            healthIndex = Math.max(0.0, (onlineRatio * 100.0) - anomalyPenalty);
        }
        dto.setNetworkHealthPercentage(Math.round(healthIndex * 10.0) / 10.0);

        // Group counts
        Map<String, Long> byParam = new HashMap<>();
        List<Object[]> paramCounts = anomalyRepository.countByParameterGroup();
        for (Object[] pc : paramCounts) {
            if (pc[0] != null) byParam.put(pc[0].toString(), (Long) pc[1]);
        }
        dto.setAnomaliesByParameter(byParam);

        Map<String, Long> byType = new HashMap<>();
        List<Object[]> typeCounts = anomalyRepository.countByAnomalyTypeGroup();
        for (Object[] tc : typeCounts) {
            if (tc[0] != null) byType.put(tc[0].toString(), (Long) tc[1]);
        }
        dto.setAnomaliesByType(byType);

        return dto;
    }
}
