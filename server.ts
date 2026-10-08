import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database State for SmartFence Platform
interface SensorReading {
  device_id: string;
  farm_id: string;
  timestamp: string;
  voltage: number; // in kV
  current: number; // in A
  pulse_frequency: number; // in Hz
  pulse_width: number; // in ms
  tamper: boolean;
  continuous_wave: boolean;
}

interface FenceEvent {
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
  risk_level: 'NORMAL' | 'SUSPICIOUS' | 'UNAUTHORIZED' | 'CRITICAL';
  relay_status: 'ON' | 'OFF';
  alarm_status: 'ACTIVE' | 'OFF';
  notification_status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  location: string;
  coordinates: { lat: number; lng: number };
}

interface AlertItem {
  alert_id: string;
  event_id: string;
  device_id: string;
  farm_name: string;
  risk_score: number;
  risk_level: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
}

// Initial Mock DB State
let dbFarms = [
  {
    farm_id: 'FARM-001',
    farm_name: 'Udhaya Organic Farm & Orchard',
    farmer_name: 'Udhayanithi A.',
    mobile_number: '+91 94420 54120',
    device_id: 'SF-001',
    location: 'Sathyamangalam Corridor, Tamil Nadu',
    lat: 11.4916,
    lng: 76.9022,
    emergency_contact: '+91 98421 77319',
    supervisor_contact: '+91 94458 98012',
    status: 'ONLINE',
  },
  {
    farm_id: 'FARM-002',
    farm_name: 'Western Ghats Agro Estate',
    farmer_name: 'Karthik Raja',
    mobile_number: '+91 98432 11094',
    device_id: 'SF-002',
    location: 'Wayanad Forest Fringe, Kerala',
    lat: 11.6854,
    lng: 76.1320,
    emergency_contact: '+91 98430 44551',
    supervisor_contact: '+91 94470 12345',
    status: 'ONLINE',
  },
  {
    farm_id: 'FARM-003',
    farm_name: 'Nilgiri Foothills Plantation',
    farmer_name: 'Selvanathan P.',
    mobile_number: '+91 94433 88120',
    device_id: 'SF-003',
    location: 'Mudumalai Tiger Reserve Buffer',
    lat: 11.5621,
    lng: 76.5342,
    emergency_contact: '+91 97890 12345',
    supervisor_contact: '+91 94422 66778',
    status: 'ONLINE',
  },
];

let dbDevices = [
  {
    device_id: 'SF-001',
    farm_id: 'FARM-001',
    farm_name: 'Udhaya Organic Farm & Orchard',
    status: 'ONLINE',
    last_seen: new Date().toISOString(),
    battery_level: 96,
    solar_input_w: 12.4,
    sensor_health: 'HEALTHY',
    network_status: '4G LTE + LoRa MESH',
    firmware_version: 'v2.4.1-esp32',
  },
  {
    device_id: 'SF-002',
    farm_id: 'FARM-002',
    farm_name: 'Western Ghats Agro Estate',
    status: 'ONLINE',
    last_seen: new Date().toISOString(),
    battery_level: 91,
    solar_input_w: 10.8,
    sensor_health: 'HEALTHY',
    network_status: 'Wi-Fi + GSM',
    firmware_version: 'v2.4.1-esp32',
  },
  {
    device_id: 'SF-003',
    farm_id: 'FARM-003',
    farm_name: 'Nilgiri Foothills Plantation',
    status: 'ONLINE',
    last_seen: new Date().toISOString(),
    battery_level: 88,
    solar_input_w: 9.6,
    sensor_health: 'HEALTHY',
    network_status: 'LoRaWAN Gateway',
    firmware_version: 'v2.4.0-esp32',
  },
];

let currentReading: SensorReading = {
  device_id: 'SF-001',
  farm_id: 'FARM-001',
  timestamp: new Date().toISOString(),
  voltage: 6.8, // 6.8 kV (Standard legal pulse)
  current: 0.42, // 0.42 A peak (negligible RMS)
  pulse_frequency: 0.9, // 0.9 Hz (~1.1s gap)
  pulse_width: 0.8, // 0.8 ms
  tamper: false,
  continuous_wave: false,
};

let dbEvents: FenceEvent[] = [
  {
    event_id: 'SF-E001',
    device_id: 'SF-001',
    farm_id: 'FARM-001',
    farm_name: 'Udhaya Organic Farm & Orchard',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    voltage: 6.8,
    current: 0.42,
    pulse_frequency: 0.9,
    pulse_width: 0.8,
    tamper: false,
    risk_score: 12,
    risk_level: 'NORMAL',
    relay_status: 'ON',
    alarm_status: 'OFF',
    notification_status: 'DELIVERED',
    location: 'Sathyamangalam Corridor, Sector 3',
    coordinates: { lat: 11.4916, lng: 76.9022 },
  },
  {
    event_id: 'SF-E002',
    device_id: 'SF-001',
    farm_id: 'FARM-001',
    farm_name: 'Udhaya Organic Farm & Orchard',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    voltage: 0.23, // 230V direct mains hook simulation
    current: 0.88, // 880mA continuous
    pulse_frequency: 50.0, // 50 Hz continuous AC
    pulse_width: 1000.0,
    tamper: true,
    risk_score: 94,
    risk_level: 'CRITICAL',
    relay_status: 'OFF',
    alarm_status: 'ACTIVE',
    notification_status: 'DELIVERED',
    location: 'Sathyamangalam Corridor, Sector 3',
    coordinates: { lat: 11.4916, lng: 76.9022 },
  },
];

let dbAlerts: AlertItem[] = [
  {
    alert_id: 'ALT-1092',
    event_id: 'SF-E002',
    device_id: 'SF-001',
    farm_name: 'Udhaya Organic Farm & Orchard',
    risk_score: 94,
    risk_level: 'CRITICAL',
    message: 'CRITICAL: Unauthorized 230V continuous mains connection & tamper detected. Safety cutoff triggered.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    acknowledged: false,
  },
];

let dbEmergencyContacts = [
  {
    id: 'CNT-01',
    name: 'Udhayanithi (Farmer)',
    role: 'Farm Owner',
    mobile: '+91 94420 54120',
    notification_type: 'SMS + Push',
    priority: 'PRIMARY (P1)',
  },
  {
    id: 'CNT-02',
    name: 'Ramu K. (Supervisor)',
    role: 'Field Supervisor',
    mobile: '+91 98421 77319',
    notification_type: 'SMS',
    priority: 'HIGH (P2)',
  },
  {
    id: 'CNT-03',
    name: 'Range Forest Officer Sathyamangalam',
    role: 'Wildlife Safety Flying Squad',
    mobile: '+91 94458 98012',
    notification_type: 'SMS + API Webhook',
    priority: 'URGENT (P1)',
  },
  {
    id: 'CNT-04',
    name: 'TANGEDCO Substation Feeder DT-04',
    role: 'Grid Feeder Engineer',
    mobile: '+91 4295 220110',
    notification_type: 'SCADA Alert',
    priority: 'EMERGENCY (P1)',
  },
];

// Helper: Calculate Fence Risk Score from 0 to 100
function calculateFenceRiskScore(data: Partial<SensorReading>): { score: number; level: 'NORMAL' | 'SUSPICIOUS' | 'UNAUTHORIZED' | 'CRITICAL'; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  const voltage = data.voltage ?? 6.8;
  const current = data.current ?? 0.42;
  const freq = data.pulse_frequency ?? 0.9;
  const width = data.pulse_width ?? 0.8;
  const tamper = data.tamper ?? false;
  const continuous = data.continuous_wave ?? (freq > 20 || width > 50);

  // Factor 1: Continuous / Non-pulsed 50Hz AC mains or DC (Lethal electrocution signature)
  if (continuous || freq >= 45) {
    score += 55;
    factors.push('Continuous 50Hz mains connection (non-pulsed lethal AC)');
  } else if (freq > 2.0) {
    score += 35;
    factors.push('Abnormal rapid pulse frequency (>2.0 Hz)');
  } else if (freq < 0.4) {
    score += 15;
    factors.push('Pulse frequency below certified threshold');
  }

  // Factor 2: High Continuous Current (>0.1A continuous)
  if (current > 0.8) {
    score += 30;
    factors.push('Severe continuous current draw (>800mA)');
  } else if (current > 0.5) {
    score += 20;
    factors.push('Elevated current draw (>500mA)');
  }

  // Factor 3: Tamper Sensor Triggered
  if (tamper) {
    score += 25;
    factors.push('Enclosure physical tamper switch open');
  }

  // Factor 4: Voltage Anomaly
  if (voltage > 10.5) {
    score += 25;
    factors.push('Abnormally high energizer voltage (>10.5 kV)');
  } else if (voltage < 1.0 && !continuous) {
    score += 15;
    factors.push('Perimeter voltage drop / ground leakage');
  }

  // Factor 5: Pulse width anomaly
  if (width > 20.0 && !continuous) {
    score += 20;
    factors.push('Pulse width exceeds IEC 60335-2-76 limit (>1ms)');
  }

  score = Math.min(100, Math.max(0, score));

  let level: 'NORMAL' | 'SUSPICIOUS' | 'UNAUTHORIZED' | 'CRITICAL' = 'NORMAL';
  if (score >= 81) level = 'CRITICAL';
  else if (score >= 61) level = 'UNAUTHORIZED';
  else if (score >= 31) level = 'SUSPICIOUS';
  else level = 'NORMAL';

  return { score, level, factors };
}

// ----------------------------------------------------------------------
// REST API ENDPOINTS (as specified in Section 15 & 16)
// ----------------------------------------------------------------------

// 1. POST /api/sensor-data (ESP32 Sensor Telemetry Ingestion)
app.post('/api/sensor-data', (req, res) => {
  try {
    const payload = req.body;
    const deviceId = payload.device_id || 'SF-001';
    const farm = dbFarms.find((f) => f.device_id === deviceId) || dbFarms[0];

    const reading: SensorReading = {
      device_id: deviceId,
      farm_id: farm.farm_id,
      timestamp: payload.timestamp || new Date().toISOString(),
      voltage: typeof payload.voltage === 'number' ? payload.voltage : 6.8,
      current: typeof payload.current === 'number' ? payload.current : 0.42,
      pulse_frequency: typeof payload.pulse_frequency === 'number' ? payload.pulse_frequency : 0.9,
      pulse_width: typeof payload.pulse_width === 'number' ? payload.pulse_width : 0.8,
      tamper: Boolean(payload.tamper),
      continuous_wave: Boolean(payload.continuous_wave || payload.pulse_frequency >= 45),
    };

    currentReading = reading;

    // Update device last seen
    const dev = dbDevices.find((d) => d.device_id === deviceId);
    if (dev) {
      dev.last_seen = new Date().toISOString();
      dev.status = 'ONLINE';
    }

    // Run Risk Engine
    const { score, level, factors } = calculateFenceRiskScore(reading);

    let relayStatus: 'ON' | 'OFF' = 'ON';
    let alarmStatus: 'ACTIVE' | 'OFF' = 'OFF';

    // If CRITICAL or UNAUTHORIZED, trigger automatic safety isolation
    if (level === 'CRITICAL' || level === 'UNAUTHORIZED') {
      relayStatus = 'OFF';
      alarmStatus = 'ACTIVE';
    }

    const eventId = `SF-E${String(dbEvents.length + 1).padStart(3, '0')}`;
    const newEvent: FenceEvent = {
      event_id: eventId,
      device_id: deviceId,
      farm_id: farm.farm_id,
      farm_name: farm.farm_name,
      timestamp: reading.timestamp,
      voltage: reading.voltage,
      current: reading.current,
      pulse_frequency: reading.pulse_frequency,
      pulse_width: reading.pulse_width,
      tamper: reading.tamper,
      risk_score: score,
      risk_level: level,
      relay_status: relayStatus,
      alarm_status: alarmStatus,
      notification_status: level === 'CRITICAL' ? 'DELIVERED' : 'SENT',
      location: farm.location,
      coordinates: { lat: farm.lat, lng: farm.lng },
    };

    dbEvents.unshift(newEvent);

    // If critical alert, push alert item
    if (level === 'CRITICAL') {
      dbAlerts.unshift({
        alert_id: `ALT-${Date.now().toString().slice(-4)}`,
        event_id: eventId,
        device_id: deviceId,
        farm_name: farm.farm_name,
        risk_score: score,
        risk_level: level,
        message: `CRITICAL: ${factors.join('; ')}. Safety cut-off executed in 6.2ms.`,
        timestamp: newEvent.timestamp,
        acknowledged: false,
      });
    }

    res.status(200).json({
      status: 'success',
      event_id: eventId,
      risk_score: score,
      risk_level: level,
      command: {
        relay_cutoff: relayStatus === 'OFF',
        alarm_trigger: alarmStatus === 'ACTIVE',
      },
      message: level === 'CRITICAL' ? 'SAFETY CUT-OFF COMMAND DISPATCHED TO ESP32' : 'STATUS NORMAL',
    });
  } catch (err: any) {
    res.status(400).json({ status: 'error', error: err.message });
  }
});

// 2. GET /api/fence-status
app.get('/api/fence-status', (_req, res) => {
  const { score, level, factors } = calculateFenceRiskScore(currentReading);
  const farm = dbFarms.find((f) => f.device_id === currentReading.device_id) || dbFarms[0];

  res.status(200).json({
    device_id: currentReading.device_id,
    farm_id: farm.farm_id,
    farm_name: farm.farm_name,
    timestamp: currentReading.timestamp,
    reading: currentReading,
    risk_score: score,
    risk_level: level,
    risk_factors: factors,
    relay_status: level === 'CRITICAL' || level === 'UNAUTHORIZED' ? 'OFF' : 'ON',
    alarm_status: level === 'CRITICAL' ? 'ACTIVE' : 'OFF',
    device_connectivity: 'ONLINE',
  });
});

// 3. GET /api/events
app.get('/api/events', (_req, res) => {
  res.status(200).json({ events: dbEvents });
});

// 4. GET /api/alerts
app.get('/api/alerts', (_req, res) => {
  res.status(200).json({ alerts: dbAlerts });
});

// 5. POST /api/acknowledge-alert
app.post('/api/acknowledge-alert', (req, res) => {
  const { alert_id, user_name } = req.body;
  const alert = dbAlerts.find((a) => a.alert_id === alert_id);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledged_by = user_name || 'Authorized Farmer';
    alert.acknowledged_at = new Date().toISOString();
  }
  res.status(200).json({ status: 'success', alert });
});

// 6. GET /api/analytics
app.get('/api/analytics', (_req, res) => {
  const total = dbEvents.length;
  const normal = dbEvents.filter((e) => e.risk_level === 'NORMAL').length;
  const suspicious = dbEvents.filter((e) => e.risk_level === 'SUSPICIOUS').length;
  const unauthorized = dbEvents.filter((e) => e.risk_level === 'UNAUTHORIZED').length;
  const critical = dbEvents.filter((e) => e.risk_level === 'CRITICAL').length;
  const avgScore = total > 0 ? Math.round(dbEvents.reduce((acc, e) => acc + e.risk_score, 0) / total) : 0;
  const maxScore = total > 0 ? Math.max(...dbEvents.map((e) => e.risk_score)) : 0;

  res.status(200).json({
    total_events: total,
    normal_events: normal,
    suspicious_events: suspicious,
    unauthorized_events: unauthorized,
    critical_events: critical,
    average_risk_score: avgScore,
    highest_risk_score: maxScore,
  });
});

// 7. GET /api/device-status
app.get('/api/device-status', (_req, res) => {
  res.status(200).json({ devices: dbDevices });
});

// 8. GET & POST /api/farms
app.get('/api/farms', (_req, res) => {
  res.status(200).json({ farms: dbFarms });
});

app.post('/api/farms', (req, res) => {
  const newFarm = {
    farm_id: `FARM-${String(dbFarms.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'ONLINE',
  };
  dbFarms.push(newFarm);
  dbDevices.push({
    device_id: newFarm.device_id || `SF-${String(dbDevices.length + 1).padStart(3, '0')}`,
    farm_id: newFarm.farm_id,
    farm_name: newFarm.farm_name,
    status: 'ONLINE',
    last_seen: new Date().toISOString(),
    battery_level: 100,
    solar_input_w: 10.0,
    sensor_health: 'HEALTHY',
    network_status: 'Wi-Fi + 4G GSM',
    firmware_version: 'v2.4.1-esp32',
  });
  res.status(201).json({ status: 'success', farm: newFarm });
});

// 9. GET & POST /api/emergency-contacts
app.get('/api/emergency-contacts', (_req, res) => {
  res.status(200).json({ contacts: dbEmergencyContacts });
});

app.post('/api/emergency-contacts', (req, res) => {
  const contact = {
    id: `CNT-${String(dbEmergencyContacts.length + 1).padStart(2, '0')}`,
    ...req.body,
  };
  dbEmergencyContacts.push(contact);
  res.status(201).json({ status: 'success', contact });
});

// 10. API route for AI Forensic Incident Analysis (Gemini)
app.post('/api/investigate', async (req, res) => {
  try {
    const { incidentData } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        report: generateFallbackForensicReport(incidentData),
        source: 'rule-based-engine',
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert Forensic Electrical Engineer and Wildlife Crime Investigation Specialist advising the State Forest Department and the Electricity Distribution Board (Discom).
Analyze this electric fence safety monitoring incident telemetry from SmartFence:

Incident Telemetry:
- Farm: ${incidentData.farm_name || 'Udhaya Organic Farm'}
- Device ID: ${incidentData.device_id || 'SF-001'}
- Timestamp: ${incidentData.timestamp || new Date().toISOString()}
- Risk Score: ${incidentData.risk_score || 94} / 100
- Risk Level: ${incidentData.risk_level || 'CRITICAL'}
- Peak Voltage: ${incidentData.voltage || '0.23 kV (230V Mains)'}
- Current Draw: ${incidentData.current || '0.88 A'}
- Pulse Frequency: ${incidentData.pulse_frequency || '50 Hz'}
- Pulse Width: ${incidentData.pulse_width || '1000 ms'}
- Tamper Status: ${incidentData.tamper ? 'OPEN / TAMPERED' : 'SECURE'}
- Relay Isolation: TRIPPED / OFF (Isolated in 6.2ms)
- Location: ${incidentData.location || 'Sathyamangalam Elephant Corridor, Tamil Nadu'}

Provide an authoritative forensic report formatted with the following sections:
1. TECHNICAL FORENSIC DETERMINATION: (Analyze whether this is an illegal 230V direct AC mains hook, an altered continuous DC energizer, a legal pulsed energizer, or vegetation leakage. Explain the electrical waveform signature and why it poses lethal danger to megafauna such as elephants vs human farm workers).
2. HARDWARE TRIPPING & INTERVENTION VERIFICATION: (Evaluate the sub-10ms trip response time against human and animal cardiac ventricular fibrillation thresholds).
3. STATUTORY & LEGAL VIOLATIONS: (Cite applicable laws e.g., Indian Wildlife Protection Act 1972 Section 9, Indian Electricity Act 2003 Section 135, and international safety standard IEC 60335-2-76 / IS 302-2-76).
4. IMMEDIATE STATUTORY ENFORCEMENT ACTIONS: (Action items for the Range Forest Officer, Flying Squad, and Substation Grid Feeder Engineer).

Keep the tone professional, empirical, rigorous, and legally structured.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({
      report: response.text || generateFallbackForensicReport(incidentData),
      source: 'gemini-ai',
    });
  } catch (error: any) {
    console.error('Forensic analysis error:', error);
    return res.status(200).json({
      report: generateFallbackForensicReport(req.body.incidentData || {}),
      source: 'rule-based-engine-fallback',
      error: error.message,
    });
  }
});

function generateFallbackForensicReport(data: any): string {
  const isIllegalMains = (data.pulse_frequency && data.pulse_frequency >= 45) || data.risk_score >= 80;
  return `### SMARTFENCE FORENSIC INCIDENT REPORT
**Incident ID:** SF-INC-${Date.now().toString().slice(-6)}
**Farm Reference:** ${data.farm_name || 'Udhaya Organic Farm & Orchard'}
**Device Reference:** ${data.device_id || 'SF-001'}
**Classification:** ${isIllegalMains ? 'CRITICAL SAFETY VIOLATION (ILLEGAL 230V MAINS TAP)' : 'ELECTRICAL SAFETY ANOMALY'}

---

#### 1. TECHNICAL FORENSIC DETERMINATION
The recorded fence waveform confirms ${isIllegalMains ? 'an unauthorized 230V continuous alternating current connection (50 Hz sinusoid)' : 'an abnormal electrical delivery pattern'}. 
Unlike certified solar fence energizers compliant with IEC 60335-2-76 (which emit momentary <1ms pulses at 1 Hz intervals), this circuit exhibited continuous current exceeding ${data.current || '0.88 A'}. Continuous current of this magnitude completely suppresses natural reflex withdrawal, causing sustained tetanic muscle lock. In large mammals (Elephas maximus), the thoracic shock path causes instantaneous respiratory paralysis and ventricular fibrillation within 150-300ms.

#### 2. HARDWARE TRIPPING & INTERVENTION VERIFICATION
- **Recorded Trip Response:** 6.2 milliseconds via dual-pole high-speed latching relay commanded by ESP32 interrupt routine.
- **Biomechanical Efficacy:** Because ventricular fibrillation requires minimum current persistence of 100ms across cardiac tissue, the sub-10ms automated cutoff successfully de-energized the perimeter wire before lethal joule dissipation occurred. The hardware latch prevented automated reclosing.

#### 3. STATUTORY & LEGAL VIOLATIONS
- **Wildlife Protection Act (1972) Section 9 / Section 51:** Attempted hunting/killing of Schedule-I wildlife species through hazardous electro-snaring or unauthorized energized perimeters. Non-bailable offense.
- **The Indian Electricity Act (2003) Section 135 & Section 138:** Unlawful tapping and extraction of grid distribution lines for unapproved, hazardous loads.
- **IEC 60335-2-76 / BIS IS 302-2-76:** Absolute prohibition of continuous sinusoidal AC connection to perimeter fencing.

#### 4. IMMEDIATE STATUTORY ENFORCEMENT ACTIONS
1. **Substation Feeder Control:** Lock out local agricultural distribution transformer DT-04 to eliminate secondary tap points.
2. **Forest Range Flying Squad:** Dispatch patrol vehicle to GPS coordinates (${data.coordinates ? `${data.coordinates.lat}° N, ${data.coordinates.lng}° E` : '11.4916° N, 76.9022° E'}). Confiscate illicit tap cables and energizer chassis as primary physical evidence.
3. **Formal FIR Filing:** Lodge registered complaint with Wildlife Crime Control Bureau (WCCB) and local jurisdictional police station.`;
}

// Dev server or Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`SmartFence IoT platform running at http://localhost:${port}`);
  });
}

startServer();
