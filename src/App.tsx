import React, { useState } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { Header } from './components/Header';
import { RiskGauge } from './components/RiskGauge';
import { SensorCards } from './components/SensorCards';
import { CriticalAlertModal } from './components/CriticalAlertModal';
import { LiveWaveformScope } from './components/LiveWaveformScope';
import { LiveTimeline } from './components/LiveTimeline';
import { IncidentHistoryTable } from './components/IncidentHistoryTable';
import { EmergencyContactsManager } from './components/EmergencyContactsManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DeviceMonitoring } from './components/DeviceMonitoring';
import { AdminControlCenter } from './components/AdminControlCenter';
import { FarmRegistrationModal } from './components/FarmRegistrationModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Esp32IntegrationTab } from './components/Esp32IntegrationTab';
import { DigitalTwinView } from './components/DigitalTwinView';
import { SparkScalaCenter } from './components/SparkScalaCenter';
import { PredictiveIntelligence } from './components/PredictiveIntelligence';
import { IncidentManagementView } from './components/IncidentManagementView';
import { LiveFarmMap } from './components/LiveFarmMap';
import { AuditLogsView } from './components/AuditLogsView';
import { RiskIntelligenceConfig } from './components/RiskIntelligenceConfig';
import { SystemHealthView } from './components/SystemHealthView';
import { SimulationControlBar } from './components/SimulationControlBar';
import {
  UserRole,
  RiskLevel,
  SensorData,
  Farm,
  SmartDevice,
  FenceEvent,
  EmergencyContact,
  NotificationItem,
  CriticalAlertModalData,
  TimelineEntry,
  IncidentRecord,
  AuditLogEntry,
  RiskRule,
  SparkAnalyticsData,
  PredictiveModelInsight,
  SystemHealthStatus,
  RiskAnalysis,
} from './types';
import {
  setAudioEnabled,
  isAudioEnabled,
  playRelayCutoffSound,
  playEmergencyAlarmBeep,
} from './utils/audio';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [activeTab, setActiveTab] = useState<string>('command');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);

  // Modals state
  const [isFarmRegOpen, setIsFarmRegOpen] = useState<boolean>(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [isSparkProcessing, setIsSparkProcessing] = useState<boolean>(false);
  const [isMlCalculating, setIsMlCalculating] = useState<boolean>(false);

  // Farms
  const [farms, setFarms] = useState<Farm[]>([
    {
      farm_id: 'FARM-001',
      farm_name: 'Udhaya Organic Farm & Orchard',
      farmer_name: 'Udhayanithi A.',
      mobile_number: '+91 94420 54120',
      device_id: 'SF-001',
      location: 'Sathyamangalam Reserve Corridor, Block A',
      lat: 11.4916,
      lng: 76.9022,
      emergency_contact: '+91 98421 77319',
      supervisor_contact: '+91 94458 98012',
      status: 'ONLINE',
      risk_level: 'NORMAL',
      risk_score: 14,
    },
    {
      farm_id: 'FARM-002',
      farm_name: 'Western Ghats Agro Estate',
      farmer_name: 'Karthik Raja',
      mobile_number: '+91 98432 11094',
      device_id: 'SF-002',
      location: 'Wayanad Forest Fringe Boundary, Sector 2',
      lat: 11.6854,
      lng: 76.132,
      emergency_contact: '+91 98430 44551',
      supervisor_contact: '+91 94470 12345',
      status: 'ONLINE',
      risk_level: 'NORMAL',
      risk_score: 18,
    },
    {
      farm_id: 'FARM-003',
      farm_name: 'Nilgiri Foothills Plantation',
      farmer_name: 'Selvanathan P.',
      mobile_number: '+91 94433 88120',
      device_id: 'SF-003',
      location: 'Mudumalai Tiger Reserve Buffer Zone',
      lat: 11.5621,
      lng: 76.5342,
      emergency_contact: '+91 97890 12345',
      supervisor_contact: '+91 94422 66778',
      status: 'ONLINE',
      risk_level: 'NORMAL',
      risk_score: 15,
    },
  ]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('FARM-001');

  // Devices Fleet
  const [devices, setDevices] = useState<SmartDevice[]>([
    {
      device_id: 'SF-001',
      farm_id: 'FARM-001',
      farm_name: 'Udhaya Organic Farm & Orchard',
      status: 'ONLINE',
      last_seen: 'Just now',
      battery_level: 96,
      solar_input_w: 12.4,
      sensor_health: 'HEALTHY',
      network_status: '4G LTE + LoRa MESH',
      firmware_version: 'v2.4.1-esp32',
      uptime_hours: 432,
      buffered_packets: 0,
    },
    {
      device_id: 'SF-002',
      farm_id: 'FARM-002',
      farm_name: 'Western Ghats Agro Estate',
      status: 'ONLINE',
      last_seen: 'Just now',
      battery_level: 91,
      solar_input_w: 10.8,
      sensor_health: 'HEALTHY',
      network_status: 'Wi-Fi + GSM',
      firmware_version: 'v2.4.1-esp32',
      uptime_hours: 216,
      buffered_packets: 0,
    },
    {
      device_id: 'SF-003',
      farm_id: 'FARM-003',
      farm_name: 'Nilgiri Foothills Plantation',
      status: 'ONLINE',
      last_seen: 'Just now',
      battery_level: 88,
      solar_input_w: 9.6,
      sensor_health: 'HEALTHY',
      network_status: 'LoRaWAN Gateway',
      firmware_version: 'v2.4.0-esp32',
      uptime_hours: 180,
      buffered_packets: 0,
    },
  ]);

  // Live Sensor Reading
  const [sensorData, setSensorData] = useState<SensorData>({
    device_id: 'SF-001',
    farm_id: 'FARM-001',
    timestamp: new Date().toISOString(),
    voltage: 6.8, // 6.8 kV standard pulse
    current: 0.42, // 0.42 A peak
    pulse_frequency: 0.9, // 0.9 Hz (~1.1s gap)
    pulse_width: 0.8, // 0.8 ms
    tamper: false,
    continuous_wave: false,
    relay_status: 'ON',
    alarm_status: 'OFF',
    device_connectivity: 'ONLINE',
    battery_percent: 96,
  });

  const [riskScore, setRiskScore] = useState<number>(14);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('NORMAL');
  const [riskFactors, setRiskFactors] = useState<string[]>([
    'IEC 60335-2-76 certified pulse envelope (6.8kV / 0.9Hz)',
    'Zero continuous current draw',
    'Enclosure tamper lock verified',
  ]);

  // Configurable Risk Rules (Section 3 & 14)
  const [rules, setRules] = useState<RiskRule[]>([
    {
      id: 'RULE-01',
      name: 'Continuous 50Hz Mains Detection',
      parameter: 'frequency',
      condition: 'continuous',
      threshold: '50 Hz AC Sinusoid',
      weight: 55,
      enabled: true,
      description: 'Lethal non-pulsed AC connection tap. Triggers sub-8ms emergency cutoff.',
    },
    {
      id: 'RULE-02',
      name: 'Severe Continuous Current (>0.8A)',
      parameter: 'current',
      condition: '>',
      threshold: 0.8,
      weight: 30,
      enabled: true,
      description: 'Cardiac ventricular fibrillation threshold in megafauna and humans.',
    },
    {
      id: 'RULE-03',
      name: 'Enclosure Tamper Switch Open',
      parameter: 'tamper',
      condition: '==',
      threshold: true,
      weight: 25,
      enabled: true,
      description: 'Physical junction box door opened or bypassed in the field.',
    },
    {
      id: 'RULE-04',
      name: 'Overclocked Pulse Frequency (>2Hz)',
      parameter: 'frequency',
      condition: '>',
      threshold: 2.0,
      weight: 35,
      enabled: true,
      description: 'Energizer timer IC altered to increase shock recurrence frequency.',
    },
    {
      id: 'RULE-05',
      name: 'Abnormal Voltage Spike (>10kV)',
      parameter: 'voltage',
      condition: '>',
      threshold: 10.0,
      weight: 25,
      enabled: true,
      description: 'Dangerous step-up transformer or energizer capacitor overclock.',
    },
  ]);

  // Critical Alert Modal State
  const [alertModalData, setAlertModalData] = useState<CriticalAlertModalData>({
    isOpen: false,
    incidentId: 'SF-INC-20261008-01',
    eventId: 'SF-EVT-20261008-00091',
    farmName: 'Udhaya Organic Farm & Orchard',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    voltage: '0.23 kV (230V Mains)',
    current: '0.88 A (Lethal)',
    pulse: '50.0 Hz (Continuous Sine)',
    tamper: 'TAMPERED',
    fenceSupply: 'CUT OFF',
    alarm: 'ACTIVE',
    sms: 'SENT',
    timestamp: '10:34:21 AM',
    location: 'Sathyamangalam Reserve Corridor, Block A',
    reasons: [
      'Current increased by +320% (0.88A continuous)',
      'Continuous 50Hz mains connection (non-pulsed lethal AC)',
      'Enclosure physical tamper switch open',
    ],
    recommendedAction: 'Safety isolation activated. Substation feeder DT-04 flagged for lockout.',
  });

  // Emergency Contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: 'CNT-01',
      name: 'Udhayanithi (Farmer)',
      role: 'Farm Owner',
      mobile: '+91 94420 54120',
      notification_type: 'SMS + Push',
      priority: 'PRIMARY (P1)',
      escalation_tier: 1,
    },
    {
      id: 'CNT-02',
      name: 'Ramu K. (Supervisor)',
      role: 'Field Supervisor',
      mobile: '+91 98421 77319',
      notification_type: 'SMS',
      priority: 'HIGH (P2)',
      escalation_tier: 2,
    },
    {
      id: 'CNT-03',
      name: 'Range Forest Officer Sathyamangalam',
      role: 'Wildlife Safety Flying Squad',
      mobile: '+91 94458 98012',
      notification_type: 'SMS + Webhook',
      priority: 'URGENT (P1)',
      escalation_tier: 3,
    },
    {
      id: 'CNT-04',
      name: 'TANGEDCO Substation Feeder DT-04',
      role: 'Grid Feeder Engineer',
      mobile: '+91 4295 220110',
      notification_type: 'SCADA Alert',
      priority: 'EMERGENCY (P1)',
      escalation_tier: 4,
    },
  ]);

  // Incidents
  const [incidents, setIncidents] = useState<IncidentRecord[]>([
    {
      incident_id: 'SF-INC-20261008-01',
      event_id: 'SF-EVT-20261008-00091',
      farm_id: 'FARM-001',
      farm_name: 'Udhaya Organic Farm & Orchard',
      device_id: 'SF-001',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      risk_score: 94,
      risk_level: 'CRITICAL',
      priority: 'CRITICAL',
      status: 'OPEN',
      reasons: [
        'Continuous 50Hz mains connection (non-pulsed lethal AC)',
        'Severe continuous current draw (0.88A)',
        'Enclosure physical tamper switch open',
      ],
      action_taken: 'ESP32 dual-pole latch relay released in 6.2ms. Perimeter wire de-energized to 0.00V.',
      escalation_level: 2,
    },
  ]);

  // Events History
  const [events, setEvents] = useState<FenceEvent[]>([
    {
      event_id: 'SF-EVT-20261008-00091',
      device_id: 'SF-001',
      farm_id: 'FARM-001',
      farm_name: 'Udhaya Organic Farm & Orchard',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      voltage: 0.23,
      current: 0.88,
      pulse_frequency: 50.0,
      pulse_width: 1000.0,
      tamper: true,
      risk_score: 94,
      risk_level: 'CRITICAL',
      relay_status: 'OFF',
      alarm_status: 'ACTIVE',
      notification_status: 'DELIVERED',
      location: 'Sathyamangalam Reserve Corridor, Block A',
      coordinates: { lat: 11.4916, lng: 76.9022 },
      reasons: ['Continuous 50Hz mains hook', 'Lethal current draw', 'Enclosure tamper'],
    },
    {
      event_id: 'SF-EVT-20261008-00090',
      device_id: 'SF-001',
      farm_id: 'FARM-001',
      farm_name: 'Udhaya Organic Farm & Orchard',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      voltage: 6.8,
      current: 0.42,
      pulse_frequency: 0.9,
      pulse_width: 0.8,
      tamper: false,
      risk_score: 14,
      risk_level: 'NORMAL',
      relay_status: 'ON',
      alarm_status: 'OFF',
      notification_status: 'DELIVERED',
      location: 'Sathyamangalam Reserve Corridor, Block A',
      coordinates: { lat: 11.4916, lng: 76.9022 },
      reasons: ['Certified IEC 60335-2-76 impulse'],
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-01',
      type: 'CRITICAL',
      title: '🚨 CRITICAL INTERVENTION: 230V Mains Tap Detected',
      message: 'Udhaya Farm SF-001 isolated in 6.2ms. Emergency SMS dispatched to 4 recipients.',
      timestamp: '10:34 AM',
      status: 'DELIVERED',
      read: false,
      escalation_tier: 2,
    },
  ]);

  // Execution Timeline
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([
    {
      id: 'TL-1',
      time: '10:34:20.421 AM',
      title: 'Sensor packet received',
      type: 'NORMAL',
      details: 'ESP32 edge payload validated with zero packet loss',
      latency_ms: 4.2,
    },
    {
      id: 'TL-2',
      time: '10:34:20.433 AM',
      title: 'Sensor validation completed',
      type: 'NORMAL',
      details: 'Analog voltage & current CT measurements calibrated',
      latency_ms: 12.0,
    },
    {
      id: 'TL-3',
      time: '10:34:20.451 AM',
      title: 'Pulse anomaly detected',
      type: 'WARNING',
      details: 'Continuous 50Hz sine waveform detected (non-pulsed)',
      latency_ms: 18.0,
    },
    {
      id: 'TL-4',
      time: '10:34:20.460 AM',
      title: 'Risk score calculated: 94 / 100',
      type: 'WARNING',
      details: 'Exceeded statutory safety limits (IEC 60335-2-76 violation)',
      latency_ms: 9.0,
    },
    {
      id: 'TL-5',
      time: '10:34:20.470 AM',
      title: 'Critical classification',
      type: 'CRITICAL',
      details: 'Cardiac ventricular fibrillation threat verified',
      latency_ms: 10.0,
    },
    {
      id: 'TL-6',
      time: '10:34:20.480 AM',
      title: 'Safety isolation command issued',
      type: 'COMMAND',
      details: 'ESP32 bare-metal ISR executed dual-pole latch cut in 6.2ms',
      latency_ms: 10.0,
    },
    {
      id: 'TL-7',
      time: '10:34:20.520 AM',
      title: 'Relay status OFF (Wire Dead)',
      type: 'COMMAND',
      details: 'High-voltage perimeter physically isolated to 0.00 V',
      latency_ms: 40.0,
    },
    {
      id: 'TL-8',
      time: '10:34:20.700 AM',
      title: 'Alarm ACTIVE',
      type: 'CRITICAL',
      details: 'Perimeter acoustic and visual strobe activated',
      latency_ms: 180.0,
    },
    {
      id: 'TL-9',
      time: '10:34:21.100 AM',
      title: 'Farmer notification SENT',
      type: 'COMMAND',
      details: 'Automated 4G GSM SMS delivered to registered farmer',
      latency_ms: 400.0,
    },
    {
      id: 'TL-10',
      time: '10:34:21.400 AM',
      title: 'Incident stored in database',
      type: 'NORMAL',
      details: 'Incident ID: SF-INC-20261008-01 archived for statutory audit',
      latency_ms: 300.0,
    },
  ]);

  // Security Audit Logs (Section 27)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'AUD-0091',
      timestamp: new Date().toISOString(),
      user: 'SYSTEM_DAEMON',
      role: 'ESP32_EDGE',
      action: 'SAFETY_CUTOFF_COMMAND',
      entity: 'SF-001 (Relay Solenoid)',
      device_id: 'SF-001',
      result: 'TRIGGERED',
      ip_address: '192.168.4.1 (LoRa Gateway)',
      details: 'Dual-pole latching relay opened in 6.2ms following 50Hz continuous sine detection.',
    },
    {
      id: 'AUD-0090',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'Udhayanithi A.',
      role: 'FARMER',
      action: 'USER_LOGIN',
      entity: 'AuthSession',
      device_id: 'SF-001',
      result: 'SUCCESS',
      ip_address: '49.37.192.42',
      details: 'Farmer authenticated session initialized via JWT Bearer.',
    },
  ]);

  // Apache Spark & Scala Analytics Engine Data (Section 14-21)
  const [sparkAnalytics, setSparkAnalytics] = useState<SparkAnalyticsData>({
    pipeline_status: 'ONLINE',
    last_batch_run: 'Today, 10:30 AM (Batch #1,402)',
    total_records_processed: 142850,
    valid_records: 139135,
    invalid_records: 2105,
    duplicates_purged: 1610,
    outliers_flagged: 430,
    data_quality_score: 97.4,
    distribution: {
      normal_pct: 82.4,
      suspicious_pct: 11.2,
      unauthorized_pct: 4.8,
      critical_pct: 1.6,
    },
    farm_rankings: [
      {
        rank: 1,
        farm_id: 'FARM-001',
        farm_name: 'Udhaya Organic Farm & Orchard',
        avg_risk: 72.4,
        critical_events: 3,
        compliance_score: 84.2,
      },
      {
        rank: 2,
        farm_id: 'FARM-002',
        farm_name: 'Western Ghats Agro Estate',
        avg_risk: 48.2,
        critical_events: 1,
        compliance_score: 92.8,
      },
      {
        rank: 3,
        farm_id: 'FARM-003',
        farm_name: 'Nilgiri Foothills Plantation',
        avg_risk: 31.7,
        critical_events: 0,
        compliance_score: 98.1,
      },
    ],
    device_rankings: [
      {
        rank: 1,
        device_id: 'SF-001',
        farm_name: 'Udhaya Organic Farm',
        risk_index: 82.1,
        tamper_count: 2,
        offline_frequency: 1,
      },
      {
        rank: 2,
        device_id: 'SF-002',
        farm_name: 'Western Ghats Agro',
        risk_index: 68.7,
        tamper_count: 0,
        offline_frequency: 0,
      },
      {
        rank: 3,
        device_id: 'SF-003',
        farm_name: 'Nilgiri Foothills',
        risk_index: 21.4,
        tamper_count: 0,
        offline_frequency: 0,
      },
    ],
    peak_incident_window: {
      hours: '10:00 PM – 12:00 AM',
      incident_increase_pct: 28,
      primary_fault: 'Illegal Agricultural Pump Feeder Taps',
    },
    scala_execution_trace: 'DAG execution finished in 1.42s on 4 worker executors (YARN cluster mode).',
  });

  // Machine Learning Predictive Intelligence (Section 22)
  const [mlInsight, setMlInsight] = useState<PredictiveModelInsight>({
    predicted_risk_level: 'HIGH',
    probability_pct: 87,
    expected_risk_window: 'Next 2 hours (10:00 PM - 12:00 AM)',
    key_indicators: [
      { feature: 'Nocturnal Feeder Grid Energization', weight: '+42%', direction: 'INCREASING' },
      { feature: 'Vegetation Dew Condensation Bleed', weight: '+26%', direction: 'INCREASING' },
      { feature: 'Elephant Corridor Migration Activity', weight: '+19%', direction: 'ABNORMAL' },
    ],
    recommended_preventative_action:
      'Pre-emptively inspect Sector 3 boundary; alert Range Forest Officer flying squad for nocturnal patrol.',
  });

  // System Health Status (Section 32)
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus>({
    backend_api: 'ONLINE',
    database: 'ONLINE',
    event_stream: 'CONNECTED',
    spark_engine: 'READY',
    notification_service: 'ONLINE',
    iot_gateway: 'ONLINE',
    cluster_nodes_active: 4,
    events_per_sec: 142,
  });

  // Simulation Mode Trigger (Section 28 & 35)
  const handleSimulateState = (level: RiskLevel) => {
    const activeFarm = farms.find((f) => f.farm_id === selectedFarmId) || farms[0];
    const nowTime = new Date().toLocaleTimeString();

    if (level === 'NORMAL') {
      setSensorData((prev) => ({
        ...prev,
        voltage: 6.8,
        current: 0.42,
        pulse_frequency: 0.9,
        pulse_width: 0.8,
        tamper: false,
        continuous_wave: false,
        relay_status: 'ON',
        alarm_status: 'OFF',
      }));
      setRiskScore(14);
      setRiskLevel('NORMAL');
      setRiskFactors([
        'IEC 60335-2-76 certified pulse envelope (6.8kV / 0.9Hz)',
        'Zero continuous current draw',
        'Enclosure tamper lock verified',
      ]);
    } else if (level === 'SUSPICIOUS') {
      setSensorData((prev) => ({
        ...prev,
        voltage: 4.8,
        current: 0.58,
        pulse_frequency: 1.6,
        pulse_width: 1.2,
        tamper: false,
        continuous_wave: false,
        relay_status: 'ON',
        alarm_status: 'OFF',
      }));
      setRiskScore(48);
      setRiskLevel('SUSPICIOUS');
      setRiskFactors([
        'Voltage attenuation detected (4.8 kV)',
        'Elevated line current draw (0.58 A)',
        'Pulse repetition interval shortened',
      ]);
    } else if (level === 'UNAUTHORIZED') {
      setSensorData((prev) => ({
        ...prev,
        voltage: 2.1,
        current: 0.74,
        pulse_frequency: 3.4,
        pulse_width: 4.2,
        tamper: true,
        continuous_wave: false,
        relay_status: 'OFF',
        alarm_status: 'ACTIVE',
      }));
      setRiskScore(76);
      setRiskLevel('UNAUTHORIZED');
      setRiskFactors([
        'Pulse timer bypassed (3.4 Hz rapid firing)',
        'Enclosure tamper switch OPEN',
        'Abnormal current draw (0.74 A)',
      ]);
      playRelayCutoffSound();
    } else if (level === 'CRITICAL') {
      // Emergency workflow
      const newScore = 94;
      setSensorData((prev) => ({
        ...prev,
        voltage: 0.23, // 230V direct mains
        current: 0.88, // 880mA continuous lethal
        pulse_frequency: 50.0, // 50 Hz continuous AC
        pulse_width: 1000.0,
        tamper: true,
        continuous_wave: true,
        relay_status: 'OFF', // Safety isolation
        alarm_status: 'ACTIVE',
      }));
      setRiskScore(newScore);
      setRiskLevel('CRITICAL');
      setRiskFactors([
        'Current increased by +320% (0.88 A continuous)',
        'Continuous 50Hz mains connection (non-pulsed lethal AC)',
        'Enclosure physical tamper switch open',
      ]);

      // Sound audio siren & relay click
      playEmergencyAlarmBeep();
      playRelayCutoffSound();

      const newEventId = `SF-EVT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(events.length + 1).padStart(5, '0')}`;
      const newIncId = `SF-INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(incidents.length + 1).padStart(2, '0')}`;

      // Create new incident
      const newInc: IncidentRecord = {
        incident_id: newIncId,
        event_id: newEventId,
        farm_id: activeFarm.farm_id,
        farm_name: activeFarm.farm_name,
        device_id: activeFarm.device_id,
        timestamp: new Date().toISOString(),
        risk_score: newScore,
        risk_level: 'CRITICAL',
        priority: 'CRITICAL',
        status: 'OPEN',
        reasons: [
          'Current increased by +320% (0.88 A continuous)',
          'Continuous 50Hz mains connection (non-pulsed lethal AC)',
          'Enclosure physical tamper switch open',
        ],
        action_taken: 'Approved safety isolation command executed in 6.2ms. Wire voltage dead (0.00V).',
        escalation_level: 2,
      };

      setIncidents((prev) => [newInc, ...prev]);

      // Add to event history
      const newEvent: FenceEvent = {
        event_id: newEventId,
        device_id: activeFarm.device_id,
        farm_id: activeFarm.farm_id,
        farm_name: activeFarm.farm_name,
        timestamp: new Date().toISOString(),
        voltage: 0.23,
        current: 0.88,
        pulse_frequency: 50.0,
        pulse_width: 1000.0,
        tamper: true,
        risk_score: newScore,
        risk_level: 'CRITICAL',
        relay_status: 'OFF',
        alarm_status: 'ACTIVE',
        notification_status: 'DELIVERED',
        location: activeFarm.location,
        coordinates: { lat: activeFarm.lat, lng: activeFarm.lng },
        reasons: newInc.reasons,
      };

      setEvents((prev) => [newEvent, ...prev]);

      // Add to notification center
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          type: 'CRITICAL',
          title: `🚨 CRITICAL EMERGENCY: 230V Mains Tap Detected on ${activeFarm.farm_name}`,
          message:
            'Non-pulsed continuous alternating current detected. Sub-8ms safety cutoff engaged. SMS dispatched.',
          timestamp: nowTime,
          status: 'DELIVERED',
          read: false,
          escalation_tier: 2,
        },
        ...prev,
      ]);

      // Add to audit log
      setAuditLogs((prev) => [
        {
          id: `AUD-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString(),
          user: 'ESP32_CORE_ISR',
          role: 'HARDWARE_INTERRUPT',
          action: 'AUTOMATED_SAFETY_ISOLATION',
          entity: `${activeFarm.device_id} (Dual-Pole Relay)`,
          device_id: activeFarm.device_id,
          result: 'TRIGGERED',
          ip_address: '10.0.1.42 (Edge Bus)',
          details: `Trip executed in 6.2ms following continuous 50Hz sinusoid detection. Risk score: ${newScore}`,
        },
        ...prev,
      ]);

      // Open Critical Alert Modal
      setAlertModalData({
        isOpen: true,
        incidentId: newIncId,
        eventId: newEventId,
        farmName: activeFarm.farm_name,
        riskScore: newScore,
        riskLevel: 'CRITICAL',
        voltage: '0.23 kV (230V Mains)',
        current: '0.88 A (Lethal)',
        pulse: '50.0 Hz (Continuous Sine)',
        tamper: 'TAMPERED',
        fenceSupply: 'CUT OFF',
        alarm: 'ACTIVE',
        sms: 'SENT',
        timestamp: nowTime,
        location: activeFarm.location,
        reasons: newInc.reasons,
        recommendedAction: 'Safety isolation activated. Feeder DT-04 flagged for lockout.',
      });
    }
  };

  // Specific Fault Injection (Section 28)
  const handleInjectFault = (faultType: string) => {
    if (faultType === 'VOLTAGE_SPIKE') {
      setSensorData((prev) => ({ ...prev, voltage: 11.2, current: 0.65 }));
      setRiskScore(68);
      setRiskLevel('UNAUTHORIZED');
      setRiskFactors(['Voltage exceeded 10.5 kV rating', 'Capacitor bank abnormal charging']);
    } else if (faultType === 'CURRENT_SPIKE') {
      setSensorData((prev) => ({ ...prev, current: 0.95 }));
      setRiskScore(75);
      setRiskLevel('UNAUTHORIZED');
      setRiskFactors(['Current increased by +340%', 'Ground fault impedance collapse']);
    } else if (faultType === 'PULSE_FAILURE') {
      handleSimulateState('CRITICAL');
    } else if (faultType === 'TAMPER') {
      setSensorData((prev) => ({ ...prev, tamper: true }));
      setRiskScore(55);
      setRiskLevel('SUSPICIOUS');
      setRiskFactors(['Enclosure tamper switch OPEN']);
    } else if (faultType === 'MULTIPLE_FAULT') {
      handleSimulateState('CRITICAL');
    } else if (faultType === 'DEVICE_OFFLINE') {
      setSensorData((prev) => ({ ...prev, device_connectivity: 'OFFLINE' }));
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          type: 'WARNING',
          title: '⚠️ DEVICE OFFLINE: SF-001',
          message: 'SmartFence node has lost connectivity. Buffer memory logging activated.',
          timestamp: new Date().toLocaleTimeString(),
          status: 'DELIVERED',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const handleResetRelay = () => {
    handleSimulateState('NORMAL');
    setAlertModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRunSparkBatch = () => {
    setIsSparkProcessing(true);
    setTimeout(() => {
      setIsSparkProcessing(false);
      setSparkAnalytics((prev) => ({
        ...prev,
        last_batch_run: `Just now (${new Date().toLocaleTimeString()})`,
        total_records_processed: prev.total_records_processed + 1,
        valid_records: prev.valid_records + 1,
      }));
    }, 1200);
  };

  const handleRefreshPrediction = () => {
    setIsMlCalculating(true);
    setTimeout(() => {
      setIsMlCalculating(false);
    }, 1000);
  };

  const handleAcknowledgeIncident = (incId: string, notes: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.incident_id === incId
          ? {
              ...inc,
              status: 'ACKNOWLEDGED',
              acknowledged_by: 'Udhayanithi A. (Operator)',
              acknowledged_at: new Date().toISOString(),
              resolution_notes: notes,
            }
          : inc
      )
    );
  };

  const handleResolveIncident = (incId: string, notes: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.incident_id === incId
          ? {
              ...inc,
              status: 'RESOLVED',
              resolution_notes: notes,
            }
          : inc
      )
    );
  };

  const currentRiskAnalysis: RiskAnalysis = {
    score: riskScore,
    level: riskLevel,
    factors: riskFactors,
    voltageChangePct: -12.4,
    currentChangePct: sensorData.current > 0.6 ? 320 : 0,
    recommendedAction:
      riskLevel === 'CRITICAL'
        ? 'Automatic safety cutoff active. Inspect fence lead lines immediately.'
        : 'Normal operation. No manual action required.',
  };

  const activeFarm = farms.find((f) => f.farm_id === selectedFarmId) || farms[0];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const openIncidents = incidents.filter((i) => i.status === 'OPEN').length;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex overflow-x-hidden ${
        isDarkMode ? 'bg-[#06080F] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Ambient background glow */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className={`absolute -top-40 left-1/3 w-[900px] h-[500px] rounded-full blur-[140px] transition-all duration-700 ${
              riskLevel === 'CRITICAL' ? 'bg-rose-500/25' : 'bg-cyan-500/10'
            }`}
          />
          <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[140px]" />
        </div>
      )}

      {/* Modern Collapsible Sidebar Navigation (Section 33) */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        unreadCount={unreadCount}
        openIncidentsCount={openIncidents}
        currentRole={currentRole}
        isDarkMode={isDarkMode}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAudioOn={isAudioOn}
          toggleAudio={() => {
            const next = !isAudioOn;
            setIsAudioOn(next);
            setAudioEnabled(next);
          }}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          farms={farms}
          selectedFarmId={selectedFarmId}
          onSelectFarm={setSelectedFarmId}
          unreadNotificationsCount={unreadCount}
          onOpenNotifications={() => setIsNotifDrawerOpen(true)}
          onSimulateState={handleSimulateState}
          currentRiskLevel={riskLevel}
          onOpenFarmRegistration={() => setIsFarmRegOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Simulation & Fault Injection Control Bar (Always accessible) */}
          <SimulationControlBar
            currentRiskLevel={riskLevel}
            onSimulateState={handleSimulateState}
            onInjectFault={handleInjectFault}
            isDarkMode={isDarkMode}
          />

          {/* Tab 1: Command Center */}
          {activeTab === 'command' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-7">
                  <RiskGauge
                    score={riskScore}
                    level={riskLevel}
                    factors={riskFactors}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="lg:col-span-5">
                  <LiveWaveformScope
                    sensorData={sensorData}
                    riskLevel={riskLevel}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* 8 Sensor Metrics */}
              <SensorCards
                sensorData={sensorData}
                riskLevel={riskLevel}
                isDarkMode={isDarkMode}
              />

              {/* Digital Twin View */}
              <DigitalTwinView
                sensorData={sensorData}
                riskLevel={riskLevel}
                riskScore={riskScore}
                isDarkMode={isDarkMode}
              />

              {/* Real-Time Second-by-Second Execution Timeline */}
              <LiveTimeline entries={timelineEntries} isDarkMode={isDarkMode} />
            </div>
          )}

          {/* Tab 2: Live Monitoring & Digital Twin */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <DigitalTwinView
                sensorData={sensorData}
                riskLevel={riskLevel}
                riskScore={riskScore}
                isDarkMode={isDarkMode}
              />
              <LiveWaveformScope
                sensorData={sensorData}
                riskLevel={riskLevel}
                isDarkMode={isDarkMode}
              />
              <SensorCards
                sensorData={sensorData}
                riskLevel={riskLevel}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* Tab 3: Emergency Alerts */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <IncidentManagementView
                incidents={incidents}
                onAcknowledgeIncident={handleAcknowledgeIncident}
                onResolveIncident={handleResolveIncident}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* Tab 4: Incident Management */}
          {activeTab === 'incidents' && (
            <div className="space-y-6">
              <IncidentManagementView
                incidents={incidents}
                onAcknowledgeIncident={handleAcknowledgeIncident}
                onResolveIncident={handleResolveIncident}
                isDarkMode={isDarkMode}
              />
              <IncidentHistoryTable events={events} isDarkMode={isDarkMode} />
            </div>
          )}

          {/* Tab 5: Devices & Telemetry */}
          {activeTab === 'devices' && (
            <DeviceMonitoring
              devices={devices}
              onToggleDeviceOffline={(dId) => {
                setDevices((prev) =>
                  prev.map((d) => (d.device_id === dId ? { ...d, status: d.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' } : d))
                );
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Tab 6: Farms & Registration */}
          {activeTab === 'farms' && (
            <AdminControlCenter
              farms={farms}
              onSelectFarm={(fId) => {
                setSelectedFarmId(fId);
                setActiveTab('command');
              }}
              selectedFarmId={selectedFarmId}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Tab 7: Live Boundary Map */}
          {activeTab === 'map' && (
            <LiveFarmMap
              farms={farms}
              selectedFarmId={selectedFarmId}
              onSelectFarm={setSelectedFarmId}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Tab 8: Risk Intelligence & Explainability Engine */}
          {activeTab === 'risk' && (
            <RiskIntelligenceConfig
              rules={rules}
              onToggleRule={(rId) => {
                setRules((prev) => prev.map((r) => (r.id === rId ? { ...r, enabled: !r.enabled } : r)));
              }}
              onUpdateWeight={(rId, w) => {
                setRules((prev) => prev.map((r) => (r.id === rId ? { ...r, weight: w } : r)));
              }}
              currentRiskAnalysis={currentRiskAnalysis}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Tab 9: Spark & Scala Analytics Center */}
          {activeTab === 'spark' && (
            <SparkScalaCenter
              analyticsData={sparkAnalytics}
              onRunBatchJob={handleRunSparkBatch}
              isProcessing={isSparkProcessing}
              eventsCount={events.length}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Tab 10: Predictive ML Intelligence */}
          {activeTab === 'predictive' && (
            <PredictiveIntelligence
              insight={mlInsight}
              onRefreshPrediction={handleRefreshPrediction}
              isCalculating={isMlCalculating}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Tab 11: Emergency Contacts & Notifications */}
          {activeTab === 'notifications' && (
            <EmergencyContactsManager
              contacts={contacts}
              onAddContact={(c) => {
                setContacts((prev) => [...prev, { id: `CNT-${Date.now()}`, ...c, escalation_tier: 1 }]);
              }}
              onDeleteContact={(id) => setContacts((prev) => prev.filter((c) => c.id !== id))}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Tab 12: Reports & Analytics */}
          {activeTab === 'reports' && (
            <AnalyticsDashboard events={events} isDarkMode={isDarkMode} />
          )}

          {/* Tab 13: Security Audit Logs */}
          {activeTab === 'audit' && (
            <AuditLogsView logs={auditLogs} isDarkMode={isDarkMode} />
          )}

          {/* Tab 14: Settings, System Health & ESP32 API */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <SystemHealthView health={systemHealth} isDarkMode={isDarkMode} />
              <Esp32IntegrationTab />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl py-6 px-6 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">SMARTFENCE X</span>
              <span>·</span>
              <span>Industrial IoT Safety, Emergency Response &amp; Big Data Platform</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
              <span>Apache Spark 3.5.1 / Scala</span>
              <span>·</span>
              <span>IEC 60335-2-76 Certified</span>
              <span>·</span>
              <span>WLPA 1972 Section 9</span>
              <span>·</span>
              <span>Sub-8ms Latching Isolation</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Critical Alert Full-Screen Modal (Section 6) */}
      <CriticalAlertModal
        data={alertModalData}
        onAcknowledge={() => setAlertModalData((prev) => ({ ...prev, isOpen: false }))}
        onViewIncident={() => {
          setAlertModalData((prev) => ({ ...prev, isOpen: false }));
          setActiveTab('incidents');
        }}
        onViewLocation={() => {
          setAlertModalData((prev) => ({ ...prev, isOpen: false }));
          setActiveTab('map');
        }}
        onResetRelay={handleResetRelay}
      />

      {/* Farm Registration Modal (Section 3) */}
      <FarmRegistrationModal
        isOpen={isFarmRegOpen}
        onClose={() => setIsFarmRegOpen(false)}
        onRegisterFarm={(f) => {
          setFarms((prev) => [...prev, { ...f, status: 'ONLINE', risk_level: 'NORMAL', risk_score: 12 }]);
        }}
      />

      {/* Notifications Drawer (Section 7) */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
