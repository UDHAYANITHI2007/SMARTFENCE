import React, { useState } from 'react';
import { SparkAnalyticsData, FenceEvent } from '../types';
import { Database, Play, Download, CheckCircle2, AlertTriangle, Layers, Code, BarChart2, TrendingUp, Sparkles, Terminal } from 'lucide-react';

interface SparkScalaCenterProps {
  analyticsData: SparkAnalyticsData;
  onRunBatchJob: () => void;
  isProcessing: boolean;
  eventsCount: number;
  isDarkMode?: boolean;
}

export const SparkScalaCenter: React.FC<SparkScalaCenterProps> = ({
  analyticsData,
  onRunBatchJob,
  isProcessing,
  eventsCount,
  isDarkMode = true,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'schema' | 'transform' | 'window' | 'ml'>('schema');

  const scalaSnippets = {
    schema: `// 1. SPARK SCHEMA DEFINITION & PARQUET INGESTION (Scala)
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.types._

val spark = SparkSession.builder()
  .appName("SmartFence-BigData-Analytics-Engine")
  .master("yarn")
  .config("spark.sql.streaming.forceDeleteTempCheckpointLocation", "true")
  .getOrCreate()

val fenceEventSchema = StructType(Array(
  StructField("event_id", StringType, false),
  StructField("timestamp", TimestampType, false),
  StructField("farm_id", StringType, false),
  StructField("device_id", StringType, false),
  StructField("voltage", DoubleType, false),
  StructField("current", DoubleType, false),
  StructField("pulse_frequency", DoubleType, false),
  StructField("pulse_width", DoubleType, false),
  StructField("tamper", BooleanType, false),
  StructField("risk_score", IntegerType, false),
  StructField("risk_level", StringType, false)
))

val rawEventsDF = spark.read
  .schema(fenceEventSchema)
  .parquet("hdfs:///smartfence/datalake/events/year=2026/*")`,

    transform: `// 2. DATA QUALITY, FILTERING & TRANSFORMATION (Scala)
import org.apache.spark.sql.functions._

val cleanDF = rawEventsDF
  .dropDuplicates(Seq("event_id"))
  .filter($"timestamp".isNotNull && $"voltage" >= 0.0)
  .withColumn("is_continuous_50hz", when($"pulse_frequency" >= 45.0 && $"current" > 0.5, true).otherwise(false))
  .withColumn("power_watts", $"voltage" * 1000.0 * $"current")
  .withColumn("risk_classification_verified", when($"risk_score" >= 81, "CRITICAL")
    .when($"risk_score" >= 61, "UNAUTHORIZED")
    .when($"risk_score" >= 31, "SUSPICIOUS")
    .otherwise("NORMAL"))

println(s"Quality Validation Passed. Total Clean Records: \${cleanDF.count()}")`,

    window: `// 3. GROUPBY AGGREGATIONS & WINDOW ANALYTICS (Scala)
import org.apache.spark.sql.expressions.Window
import org.apache.spark.sql.functions._

// Farm-Wise Risk Aggregation
val farmRiskSummaryDF = cleanDF
  .groupBy("farm_id")
  .agg(
    count("event_id").as("total_events"),
    avg("risk_score").as("avg_risk_score"),
    max("risk_score").as("peak_risk_score"),
    sum(when($"risk_level" === "CRITICAL", 1).otherwise(0)).as("critical_cutoffs"),
    avg("voltage").as("avg_operating_voltage_kv")
  )
  .orderBy(desc("avg_risk_score"))

// Hourly Window Pattern Extraction for Nocturnal Poaching Detection
val hourlyWindowDF = cleanDF
  .withColumn("hour_of_day", hour($"timestamp"))
  .groupBy("hour_of_day")
  .agg(count("event_id").as("incident_volume"), avg("risk_score").as("hourly_mean_risk"))
  .orderBy(desc("incident_volume"))`,

    ml: `// 4. ML ANOMALY DETECTION PIPELINE (Scala Spark MLlib)
import org.apache.spark.ml.feature.VectorAssembler
import org.apache.spark.ml.clustering.KMeans

val assembler = new VectorAssembler()
  .setInputCols(Array("voltage", "current", "pulse_frequency", "pulse_width"))
  .setOutputCol("features")

val featureDF = assembler.transform(cleanDF)

val kmeans = new KMeans()
  .setK(4)
  .setSeed(42L)
  .setFeaturesCol("features")
  .setPredictionCol("cluster_id")

val model = kmeans.fit(featureDF)
val predictionsDF = model.transform(featureDF)
// Anomalous Cluster #3 isolates 230V mains hooks from standard 1Hz pulses`,
  };

  const handleDownloadReport = () => {
    const reportContent = `# SMARTFENCE X - APACHE SPARK & SCALA ANALYTICS REPORT
Generated: ${new Date().toISOString()}
Spark Engine Version: Apache Spark 3.5.1 (Scala 2.13.12)
Target DataLake: HDFS / Cloud Storage Partition /year=2026/

## 1. EXECUTIVE SUMMARY
Total Events Processed: ${analyticsData.total_records_processed.toLocaleString()}
Data Quality Score: ${analyticsData.data_quality_score}%
Valid Records: ${analyticsData.valid_records.toLocaleString()}
Outliers Flagged: ${analyticsData.outliers_flagged.toLocaleString()}

## 2. RISK DISTRIBUTION
- Normal (0-30): ${analyticsData.distribution.normal_pct}%
- Suspicious (31-60): ${analyticsData.distribution.suspicious_pct}%
- Unauthorized (61-80): ${analyticsData.distribution.unauthorized_pct}%
- Critical (81-100): ${analyticsData.distribution.critical_pct}%

## 3. PEAK INCIDENT TIME WINDOW
Time Window: ${analyticsData.peak_incident_window.hours}
Critical Increase: +${analyticsData.peak_incident_window.incident_increase_pct}%
Primary Root Cause: ${analyticsData.peak_incident_window.primary_fault}

## 4. FARM RISK RANKINGS (SPARK SQL AGGREGATION)
${analyticsData.farm_rankings.map(f => `${f.rank}. ${f.farm_name} (${f.farm_id}) - Avg Risk: ${f.avg_risk} - Critical Events: ${f.critical_events}`).join('\n')}

## 5. DEVICE RISK RANKINGS
${analyticsData.device_rankings.map(d => `${d.rank}. ${d.device_id} (${d.farm_name}) - Risk Index: ${d.risk_index} - Tampers: ${d.tamper_count}`).join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartFence-Spark-Executive-Report-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-6 ${
      isDarkMode ? 'bg-slate-900/40 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      {/* Header with Spark Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
              Distributed Big Data Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Apache Spark 3.5.1 · Scala 2.13
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white mt-0.5">
            Spark &amp; Scala Intelligence Center
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRunBatchJob}
            disabled={isProcessing}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Executing Scala DAG...' : 'Trigger Spark Job'}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Spark Dossier</span>
          </button>
        </div>
      </div>

      {/* Spark Data Quality Score Ribbon (Section 16) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">TOTAL RECORDS</span>
          <span className="text-base font-bold text-white block mt-0.5 tabular-nums">
            {analyticsData.total_records_processed.toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">VALID RECORDS</span>
          <span className="text-base font-bold text-emerald-400 block mt-0.5 tabular-nums">
            {analyticsData.valid_records.toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">DUPLICATES PURGED</span>
          <span className="text-base font-bold text-amber-400 block mt-0.5 tabular-nums">
            {analyticsData.duplicates_purged.toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <span className="text-slate-400 block text-[10px]">OUTLIERS FLAGGED</span>
          <span className="text-base font-bold text-rose-400 block mt-0.5 tabular-nums">
            {analyticsData.outliers_flagged.toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/40 col-span-2">
          <span className="text-cyan-300 block text-[10px]">DATA QUALITY SCORE</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-cyan-300 tabular-nums">
              {analyticsData.data_quality_score}%
            </span>
            <span className="text-[10px] text-slate-400 font-sans">IEC / Schema Pass</span>
          </div>
        </div>
      </div>

      {/* Spark DataFrame Pipeline Visual Stages (Section 15) */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono block">
          Distributed Spark DataFrame Execution Pipeline
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-400 font-bold block text-[11px]">1. Ingest</span>
            <span className="text-[10px] text-slate-400">read.parquet</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-400 font-bold block text-[11px]">2. Validate</span>
            <span className="text-[10px] text-slate-400">StructType</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-400 font-bold block text-[11px]">3. Clean</span>
            <span className="text-[10px] text-slate-400">dropDuplicates</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-400 font-bold block text-[11px]">4. Transform</span>
            <span className="text-[10px] text-slate-400">withColumn</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-400 font-bold block text-[11px]">5. Aggregate</span>
            <span className="text-[10px] text-slate-400">groupBy.agg</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-cyan-400 font-bold block text-[11px]">6. Windows</span>
            <span className="text-[10px] text-slate-400">partitionBy</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40">
            <span className="text-emerald-300 font-bold block text-[11px]">7. Publish</span>
            <span className="text-[10px] text-slate-400">Dashboard Sink</span>
          </div>
        </div>
      </div>

      {/* Scala Code Inspection Workbench */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
            <Code className="w-4 h-4 text-cyan-400" /> Production Scala Code Implementation
          </span>

          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {[
              { id: 'schema', label: '1. Schema' },
              { id: 'transform', label: '2. withColumn()' },
              { id: 'window', label: '3. Window Agg' },
              { id: 'ml', label: '4. ML Pipeline' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveCodeTab(t.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeCodeTab === t.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-cyan-300 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
          {scalaSnippets[activeCodeTab]}
        </pre>
      </div>

      {/* Farm & Device Risk Rankings (Section 19 & 20) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Farm Ranking Table */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-bold uppercase text-white font-mono">
              Farm Risk Hierarchy (Spark SQL Rank)
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Weighted Average</span>
          </div>

          <div className="space-y-2">
            {analyticsData.farm_rankings.map((farm) => (
              <div
                key={farm.farm_id}
                className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                    #{farm.rank}
                  </span>
                  <div>
                    <span className="text-white font-bold block">{farm.farm_name}</span>
                    <span className="text-[10px] text-slate-400">{farm.farm_id}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-bold tabular-nums block ${farm.avg_risk > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    Risk: {farm.avg_risk}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {farm.critical_events} Cutoffs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Ranking Table */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-xs font-bold uppercase text-white font-mono">
              Device Health Risk Index (Spark ML)
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Sensor &amp; Tamper Index</span>
          </div>

          <div className="space-y-2">
            {analyticsData.device_rankings.map((dev) => (
              <div
                key={dev.device_id}
                className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                    #{dev.rank}
                  </span>
                  <div>
                    <span className="text-white font-bold block">{dev.device_id}</span>
                    <span className="text-[10px] text-slate-400">{dev.farm_name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-bold tabular-nums block ${dev.risk_index > 60 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    Index: {dev.risk_index}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Tampers: {dev.tamper_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time-Series Nocturnal Window (Section 18) */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
            Peak Risk Time-Series Pattern (Spark Window Partition)
          </span>
          <div className="text-sm font-bold text-white mt-0.5">
            Highest Incident Window: {analyticsData.peak_incident_window.hours}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Critical event frequency surges by +{analyticsData.peak_incident_window.incident_increase_pct}% during late-night agricultural pump energization hours.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-amber-300 shrink-0 text-center">
          Root Cause: {analyticsData.peak_incident_window.primary_fault}
        </div>
      </div>
    </div>
  );
};
