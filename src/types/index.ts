export type UserRole = 'FARMER' | 'ADMIN';

export type RiskLevel = 'NORMAL' | 'SUSPICIOUS' | 'UNAUTHORIZED' | 'CRITICAL';

export type AlertPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';

export interface SensorData {
  device_id: string;
  farm_id: string;
  timestamp: string;
  voltage: number; // in kV
  current: number; // in A
  pulse_frequency: number; // in Hz
  pulse_width: number; // in ms
  tamper: boolean;
  continuous_wave: boolean;
  relay_status: 'ON' | 'OFF';
  alarm_status: 'ACTIVE' | 'OFF';
  device_connectivity: 'ONLINE' | 'OFFLINE';
  battery_percent: number;
}

export interface RiskAnalysis {
  score: number; // 0 - 100
  level: RiskLevel;
  factors: string[];
  voltageChangePct: number;
  currentChangePct: number;
  recommendedAction: string;
}

export interface Farm {
  farm_id: string;
  farm_name: string;
  farmer_name: string;
  mobile_number: string;
  device_id: string;
  location: string;
  lat: number;
  lng: number;
  emergency_contact: string;
  supervisor_contact: string;
  status: 'ONLINE' | 'OFFLINE';
  risk_level: RiskLevel;
  risk_score: number;
  last_incident?: string;
}

export interface SmartDevice {
  device_id: string;
  farm_id: string;
  farm_name: string;
  status: 'ONLINE' | 'OFFLINE';
  last_seen: string;
  battery_level: number;
  solar_input_w: number;
  sensor_health: 'HEALTHY' | 'DEGRADED' | 'CHECK_REQUIRED';
  network_status: string;
  firmware_version: string;
  uptime_hours: number;
  buffered_packets: number;
}

export interface FenceEvent {
  event_id: string;
  device_id: string;
  farm_id: string;
  farm_name: string;
  timestamp: string;
  voltage: number;
  current: number;
  pulse_frequency: number;
  pulse_width: number;
  tamper: boolean;
  risk_score: number;
  risk_level: RiskLevel;
  relay_status: 'ON' | 'OFF';
  alarm_status: 'ACTIVE' | 'OFF';
  notification_status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  location: string;
  coordinates: { lat: number; lng: number };
  reasons: string[];
}

export interface IncidentRecord {
  incident_id: string;
  event_id: string;
  farm_id: string;
  farm_name: string;
  device_id: string;
  timestamp: string;
  risk_score: number;
  risk_level: RiskLevel;
  priority: AlertPriority;
  status: IncidentStatus;
  reasons: string[];
  action_taken: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolution_notes?: string;
  escalation_level: 1 | 2 | 3 | 4;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  mobile: string;
  notification_type: string;
  priority: string;
  escalation_tier: number;
}

export interface NotificationItem {
  id: string;
  type: 'NORMAL' | 'WARNING' | 'UNAUTHORIZED' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  read: boolean;
  farm_name?: string;
  device_id?: string;
  escalation_tier?: number;
}

export interface CriticalAlertModalData {
  isOpen: boolean;
  incidentId: string;
  eventId: string;
  farmName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  voltage: string;
  current: string;
  pulse: string;
  tamper: string;
  fenceSupply: string;
  alarm: string;
  sms: string;
  timestamp: string;
  location: string;
  reasons: string[];
  recommendedAction: string;
}

export interface TimelineEntry {
  id: string;
  time: string;
  title: string;
  type: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'COMMAND';
  details?: string;
  latency_ms?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  device_id?: string;
  result: 'SUCCESS' | 'WARNING' | 'BLOCKED' | 'TRIGGERED';
  ip_address: string;
  details: string;
}

export interface RiskRule {
  id: string;
  name: string;
  parameter: 'voltage' | 'current' | 'frequency' | 'pulse_width' | 'tamper';
  condition: '>' | '<' | '==' | 'continuous';
  threshold: number | boolean | string;
  weight: number;
  enabled: boolean;
  description: string;
}

export interface SparkAnalyticsData {
  pipeline_status: 'ONLINE' | 'PROCESSING' | 'IDLE';
  last_batch_run: string;
  total_records_processed: number;
  valid_records: number;
  invalid_records: number;
  duplicates_purged: number;
  outliers_flagged: number;
  data_quality_score: number; // e.g. 97.4%
  distribution: {
    normal_pct: number;
    suspicious_pct: number;
    unauthorized_pct: number;
    critical_pct: number;
  };
  farm_rankings: Array<{
    rank: number;
    farm_id: string;
    farm_name: string;
    avg_risk: number;
    critical_events: number;
    compliance_score: number;
  }>;
  device_rankings: Array<{
    rank: number;
    device_id: string;
    farm_name: string;
    risk_index: number;
    tamper_count: number;
    offline_frequency: number;
  }>;
  peak_incident_window: {
    hours: string;
    incident_increase_pct: number;
    primary_fault: string;
  };
  scala_execution_trace: string;
}

export interface PredictiveModelInsight {
  predicted_risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  probability_pct: number; // e.g. 87%
  expected_risk_window: string; // e.g. "Next 2 hours (10:00 PM - 12:00 AM)"
  key_indicators: Array<{
    feature: string;
    weight: string;
    direction: 'INCREASING' | 'ABNORMAL' | 'STABLE';
  }>;
  recommended_preventative_action: string;
}

export interface SystemHealthStatus {
  backend_api: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  database: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  event_stream: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';
  spark_engine: 'READY' | 'BUSY' | 'OFFLINE';
  notification_service: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  iot_gateway: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  cluster_nodes_active: number;
  events_per_sec: number;
}
