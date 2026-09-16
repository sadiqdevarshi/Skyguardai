package com.aerisence.dto;

import java.util.Map;

public class AnalyticsSummaryDto {
    private long totalStations;
    private long onlineStations;
    private long degradedStations;
    private long offlineStations;
    private long totalAnomalies;
    private long openAnomalies;
    private long criticalAnomalies;
    private long unacknowledgedAlerts;
    private double networkAvgTemperature;
    private double networkAvgPressure;
    private double networkAvgHumidity;
    private double networkHealthPercentage;
    private Map<String, Long> anomaliesByParameter;
    private Map<String, Long> anomaliesByType;

    public AnalyticsSummaryDto() {}

    public long getTotalStations() { return totalStations; }
    public void setTotalStations(long totalStations) { this.totalStations = totalStations; }

    public long getOnlineStations() { return onlineStations; }
    public void setOnlineStations(long onlineStations) { this.onlineStations = onlineStations; }

    public long getDegradedStations() { return degradedStations; }
    public void setDegradedStations(long degradedStations) { this.degradedStations = degradedStations; }

    public long getOfflineStations() { return offlineStations; }
    public void setOfflineStations(long offlineStations) { this.offlineStations = offlineStations; }

    public long getTotalAnomalies() { return totalAnomalies; }
    public void setTotalAnomalies(long totalAnomalies) { this.totalAnomalies = totalAnomalies; }

    public long getOpenAnomalies() { return openAnomalies; }
    public void setOpenAnomalies(long openAnomalies) { this.openAnomalies = openAnomalies; }

    public long getCriticalAnomalies() { return criticalAnomalies; }
    public void setCriticalAnomalies(long criticalAnomalies) { this.criticalAnomalies = criticalAnomalies; }

    public long getUnacknowledgedAlerts() { return unacknowledgedAlerts; }
    public void setUnacknowledgedAlerts(long unacknowledgedAlerts) { this.unacknowledgedAlerts = unacknowledgedAlerts; }

    public double getNetworkAvgTemperature() { return networkAvgTemperature; }
    public void setNetworkAvgTemperature(double networkAvgTemperature) { this.networkAvgTemperature = networkAvgTemperature; }

    public double getNetworkAvgPressure() { return networkAvgPressure; }
    public void setNetworkAvgPressure(double networkAvgPressure) { this.networkAvgPressure = networkAvgPressure; }

    public double getNetworkAvgHumidity() { return networkAvgHumidity; }
    public void setNetworkAvgHumidity(double networkAvgHumidity) { this.networkAvgHumidity = networkAvgHumidity; }

    public double getNetworkHealthPercentage() { return networkHealthPercentage; }
    public void setNetworkHealthPercentage(double networkHealthPercentage) { this.networkHealthPercentage = networkHealthPercentage; }

    public Map<String, Long> getAnomaliesByParameter() { return anomaliesByParameter; }
    public void setAnomaliesByParameter(Map<String, Long> anomaliesByParameter) { this.anomaliesByParameter = anomaliesByParameter; }

    public Map<String, Long> getAnomaliesByType() { return anomaliesByType; }
    public void setAnomaliesByType(Map<String, Long> anomaliesByType) { this.anomaliesByType = anomaliesByType; }
}
