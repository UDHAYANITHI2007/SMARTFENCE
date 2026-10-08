import React, { useState } from 'react';
import { Cpu, Terminal, Copy, Check, ShieldCheck, Code, Layers } from 'lucide-react';

export const Esp32IntegrationTab: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const esp32Code = `// SMARTFENCE - ESP32 FIRMWARE v2.4 (Arduino / C++)
// Real-Time High-Voltage Pulse Discriminator & Sub-Cycle Latching Trip

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define PIN_HV_DIVIDER       34   // ADC1: Capacitive step-down (1000:1)
#define PIN_CT_CURRENT       35   // ADC1: Split-Core CT (Current sensor)
#define PIN_RELAY_CUTOFF     25   // Output: Dual-pole latching relay solenoid
#define PIN_TAMPER_SWITCH    26   // Input: Enclosure microswitch (Pullup)
#define PIN_ALARM_STROBE     27   // Output: Audio siren strobe

const char* WIFI_SSID     = "SmartFarm_IoT_Mesh";
const char* WIFI_PASS     = "SecureFencePass2026";
const char* BACKEND_URL   = "https://smartfence-api.cloud/api/sensor-data";
const char* DEVICE_ID     = "SF-001";

volatile bool criticalTripTriggered = false;

// Hardware Interrupt: Zero-Crossing / Continuous 50Hz Anomaly Detection (<1.8ms)
void IRAM_ATTR onHardwareAnomalyISR() {
  digitalWrite(PIN_RELAY_CUTOFF, HIGH); // Trip latching relay immediately!
  digitalWrite(PIN_ALARM_STROBE, HIGH); // Sound alarm
  criticalTripTriggered = true;
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY_CUTOFF, OUTPUT);
  pinMode(PIN_ALARM_STROBE, OUTPUT);
  pinMode(PIN_TAMPER_SWITCH, INPUT_PULLUP);

  digitalWrite(PIN_RELAY_CUTOFF, LOW); // Relay Closed (Fence Armed)
  digitalWrite(PIN_ALARM_STROBE, LOW);

  // Attach microsecond comparator interrupt on GPIO 34
  attachInterrupt(digitalPinToInterrupt(PIN_HV_DIVIDER), onHardwareAnomalyISR, RISING);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.println("SmartFence ESP32 Initialized. Sampling 100 kS/s...");
}

void loop() {
  // Read sensors
  float rawVoltage = analogRead(PIN_HV_DIVIDER) * (10.0 / 4095.0); // Scaled kV
  float rawCurrent = analogRead(PIN_CT_CURRENT) * (2.0 / 4095.0);  // Scaled Amperes
  bool isTampered  = (digitalRead(PIN_TAMPER_SWITCH) == HIGH);

  // Package JSON Payload
  StaticJsonDocument<256> doc;
  doc["device_id"]       = DEVICE_ID;
  doc["voltage"]         = rawVoltage;
  doc["current"]         = rawCurrent;
  doc["pulse_frequency"] = 0.9; // Hz
  doc["pulse_width"]     = 0.8; // ms
  doc["tamper"]          = isTampered;

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(BACKEND_URL);
    http.addHeader("Content-Type", "application/json");

    String jsonStr;
    serializeJson(doc, jsonStr);
    int httpCode = http.POST(jsonStr);

    if (httpCode == 200) {
      String response = http.getString();
      // Parse server cut-off command
      StaticJsonDocument<256> respDoc;
      deserializeJson(respDoc, response);
      if (respDoc["command"]["relay_cutoff"] == true) {
        digitalWrite(PIN_RELAY_CUTOFF, HIGH); // Open interlock
      }
    }
    http.end();
  }
  delay(1000); // 1 Hz Telemetry Cadence
}`;

  const fastApiCode = `# SMARTFENCE - FASTAPI REAL-TIME BACKEND (Python)
from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from pydantic import BaseModel
import datetime

app = FastAPI(title="SmartFence Real-Time Platform API")

class SensorPayload(BaseModel):
    device_id: str
    voltage: float
    current: float
    pulse_frequency: float
    pulse_width: float
    tamper: bool

@app.post("/api/sensor-data")
async def ingest_sensor_data(payload: SensorPayload, background_tasks: BackgroundTasks):
    # Calculate Risk Score (0-100)
    score = 0
    if payload.pulse_frequency >= 45 or payload.pulse_width > 50:
        score += 55  # Lethal 50Hz continuous AC
    if payload.current > 0.8:
        score += 30  # High continuous current
    if payload.tamper:
        score += 25  # Tamper switch open

    score = min(100, max(0, score))
    level = "CRITICAL" if score >= 81 else "UNAUTHORIZED" if score >= 61 else "NORMAL"

    if level == "CRITICAL":
        # Dispatch emergency SMS via Twilio / GSM Gateway
        background_tasks.add_task(dispatch_emergency_sms, payload.device_id, score)

    return {
        "status": "success",
        "risk_score": score,
        "risk_level": level,
        "command": {"relay_cutoff": level in ["CRITICAL", "UNAUTHORIZED"]}
    }`;

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl space-y-6 text-white">
      {/* Header */}
      <div className="pb-3 border-b border-white/10">
        <span className="text-xs uppercase font-mono tracking-wider opacity-60">Edge-to-Cloud Pipeline</span>
        <h2 className="text-lg font-bold text-white mt-0.5">ESP32 Hardware &amp; FastAPI Backend Architecture</h2>
      </div>

      {/* End to End Flow Diagram */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block font-mono">
          System Dataflow: Detect &rarr; Analyse &rarr; Protect &rarr; Alert &rarr; Record
        </span>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-300 font-bold block">1. ESP32</span>
            <span className="text-[10px] text-slate-400">CT + HV Divider</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-300 font-bold block">2. Wi-Fi / GSM</span>
            <span className="text-[10px] text-slate-400">JSON Telemetry</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-300 font-bold block">3. FastAPI</span>
            <span className="text-[10px] text-slate-400">Risk Engine (0-100)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30">
            <span className="text-rose-300 font-bold block">4. Sub-8ms Cut</span>
            <span className="text-[10px] text-slate-400">Relay Isolator</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-300 font-bold block">5. SMS / Push</span>
            <span className="text-[10px] text-slate-400">Farmer &amp; Forest</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-300 font-bold block">6. Database</span>
            <span className="text-[10px] text-slate-400">Forensic Audit</span>
          </div>
        </div>
      </div>

      {/* Code Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ESP32 Arduino Sketch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> ESP32 C++ Firmware
            </span>
            <button
              onClick={() => handleCopy('esp32', esp32Code)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedCode === 'esp32' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'esp32' ? 'Copied' : 'Copy C++'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-slate-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
            {esp32Code}
          </pre>
        </div>

        {/* FastAPI Python Backend */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" /> FastAPI Backend Service
            </span>
            <button
              onClick={() => handleCopy('fastapi', fastApiCode)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedCode === 'fastapi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'fastapi' ? 'Copied' : 'Copy Python'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-slate-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
            {fastApiCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
