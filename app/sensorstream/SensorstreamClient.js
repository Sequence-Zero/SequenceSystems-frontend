"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SensorstreamClient() {
  const DEBUG_DEMO = process.env.NEXT_PUBLIC_DEBUG_DEMO === "1";
  const [apiStatus, setApiStatus] = useState("checking");
  const [lastError, setLastError] = useState("");
  const [uiSessionId, setUiSessionId] = useState(null);
  const [uiDeviceId, setUiDeviceId] = useState(null);
  const [uiApiKey, setUiApiKey] = useState(null);
  const [lastReadingsDebug, setLastReadingsDebug] = useState(null);
  const [lastReadingsCount, setLastReadingsCount] = useState(null);
  const [lastReadingsUrl, setLastReadingsUrl] = useState("");
  const [isInitializingSession, setIsInitializingSession] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [pumpWarning, setPumpWarning] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [series, setSeries] = useState([]);
  const [latestBySensor, setLatestBySensor] = useState({});
  const [sensors, setSensors] = useState([]);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5000";
  const pollIntervalMs = 1000;
  const readingsLimit = 50;
  const seriesLimit = 60;
  const healthTimeoutMs = 3000;
  const healthRetryDelayMs = 2000;
  const healthRetryMax = 25;
  const chartRef = useRef(null);
  const isMountedRef = useRef(false);
  const basePillClassName =
    "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-xs font-medium leading-none shadow-sm";
  const neutralPillClassName =
    `${basePillClassName} border-zinc-200 bg-white text-zinc-700`;
  const statusPillClassName =
    apiStatus === "ready"
      ? `${basePillClassName} border-emerald-200 bg-emerald-50 text-emerald-700`
      : `${basePillClassName} border-red-200 bg-red-50 text-red-700`;
  const streamingPillClassName =
    isStreaming
      ? `${basePillClassName} border-emerald-200 bg-emerald-50 text-emerald-700`
      : `${basePillClassName} border-red-200 bg-red-50 text-red-700`;
  const buttonClassName = isStreaming
    ? isButtonHovered
      ? "bg-red-700"
      : "bg-red-600"
    : isButtonHovered
      ? "bg-blue-700"
      : "bg-blue-600";

  const formatTimestamp = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "number") {
      if (Number.isInteger(value)) return String(value);
      return value.toFixed(3);
    }
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return String(value);
    if (Number.isInteger(parsed)) return String(parsed);
    return parsed.toFixed(3);
  };

  const parseReadingTime = (reading) => {
    const raw =
      reading?.ts ??
      reading?.timestamp ??
      reading?.created_at ??
      reading?.received_at ??
      null;
    if (!raw) return null;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const parseCreatedAt = (reading) => {
    const raw = reading?.created_at ?? null;
    if (!raw) return null;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const buildLatestBySensor = (readings) => {
    return readings.reduce((acc, reading) => {
      const sensor = reading?.sensor || reading?.sensor_id || "N/A";
      const current = acc[sensor];
      if (!current) {
        acc[sensor] = reading;
        return acc;
      }
      const nextTime = parseReadingTime(reading);
      const currentTime = parseReadingTime(current);
      if (!currentTime && nextTime) {
        acc[sensor] = reading;
      } else if (currentTime && nextTime && nextTime > currentTime) {
        acc[sensor] = reading;
      }
      return acc;
    }, {});
  };

  const ensureSensorSelection = (nextSensors) => {
    if (nextSensors.length === 0) return "";
    if (nextSensors.includes(selectedSensor)) return selectedSensor;
    if (nextSensors.includes("hr_bpm")) return "hr_bpm";
    return nextSensors[0];
  };

  const runHealthCheck = useCallback(async () => {
    setApiStatus("checking");
    setLastError("");

    const fetchWithTimeout = async (url, timeoutMs) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { signal: controller.signal });
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const attemptHealthCheck = async (timeoutMs) => {
      try {
        const response = await fetchWithTimeout(
          `${apiBase}/health`,
          timeoutMs
        );
        if (response.ok) {
          return { ok: true };
        }
        return { ok: false, error: "Health check failed." };
      } catch (error) {
        if (error?.name === "AbortError") {
          return { ok: false, error: "Health check timed out." };
        }
        return { ok: false, error: "Health check error." };
      }
    };

    const initialAttempt = await attemptHealthCheck(healthTimeoutMs);
    if (!isMountedRef.current) return;
    if (initialAttempt.ok) {
      setApiStatus("ready");
      return;
    }

    setApiStatus("waking");

    for (let attempt = 0; attempt < healthRetryMax; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, healthRetryDelayMs));
      if (!isMountedRef.current) return;

      const retryAttempt = await attemptHealthCheck(healthTimeoutMs);
      if (!isMountedRef.current) return;
      if (retryAttempt.ok) {
        setApiStatus("ready");
        return;
      }
    }

    setApiStatus("error");
    setLastError(
      "Demo API didn’t respond. Please try again in a moment."
    );
  }, [apiBase, healthRetryDelayMs, healthRetryMax, healthTimeoutMs]);

  useEffect(() => {
    isMountedRef.current = true;
    runHealthCheck();

    return () => {
      isMountedRef.current = false;
    };
  }, [runHealthCheck]);

  const loadDemoCredentials = useCallback(async () => {
    const response = await fetch(`${apiBase}/api/demo/credentials`);
    if (!response.ok) {
      throw new Error("Failed to initialize session");
    }
    const data = await response.json();
    return {
      deviceId: data?.device_id || null,
      apiKey: data?.api_key || null,
      sessionId: data?.session_id || null,
    };
  }, [apiBase]);

  const callDemoPump = useCallback(
    async (action, deviceId, apiKey) => {
      try {
        const response = await fetch(`${apiBase}/api/demo/${action}`, {
          method: "POST",
          headers: {
            "X-Device-Id": deviceId,
            "X-API-Key": apiKey,
          },
        });
        return response;
      } catch {
        return null;
      }
    },
    [apiBase]
  );

  const handleStartStop = useCallback(async () => {
    if (apiStatus !== "ready" || isInitializingSession) return;

    if (isStreaming) {
      setIsStreaming(false);
      if (uiDeviceId && uiApiKey) {
        await callDemoPump("stop", uiDeviceId, uiApiKey);
      }
      return;
    }

    setSessionError("");
    setPumpWarning("");
    setIsStreaming(true);
    setIsInitializingSession(true);
    setUiSessionId(null);
    setUiDeviceId(null);
    setUiApiKey(null);
    setLastReadingsDebug(null);
    setLastReadingsCount(null);
    setLastReadingsUrl("");
    setSeries([]);
    setLatestBySensor({});
    setSensors([]);

    try {
      const credentials = await loadDemoCredentials();
      if (
        !credentials.deviceId ||
        !credentials.apiKey ||
        !credentials.sessionId
      ) {
        throw new Error("Missing session credentials");
      }
      const startResponse = await callDemoPump(
        "start",
        credentials.deviceId,
        credentials.apiKey
      );
      if (!startResponse?.ok && isMountedRef.current) {
        setPumpWarning(
          "Could not confirm demo pump start. Polling will continue."
        );
      }
      if (!isMountedRef.current) return;
      setUiDeviceId(credentials.deviceId);
      setUiApiKey(credentials.apiKey);
      setUiSessionId(credentials.sessionId);
    } catch {
      if (!isMountedRef.current) return;
      setIsStreaming(false);
      setSessionError("Could not initialize demo session. Please retry.");
    } finally {
      if (isMountedRef.current) {
        setIsInitializingSession(false);
      }
    }
  }, [
    apiStatus,
    isInitializingSession,
    isStreaming,
    uiDeviceId,
    uiApiKey,
    loadDemoCredentials,
    callDemoPump,
  ]);

  useEffect(() => {
    if (!isStreaming || !uiSessionId || !uiDeviceId || !uiApiKey) return;

    let isActive = true;

    const loadReadings = async () => {
      try {
        const url = `${apiBase}/api/readings?limit=${readingsLimit}&session_id=${encodeURIComponent(uiSessionId)}`;
        setLastReadingsUrl(url);
        const response = await fetch(url, {
          headers: {
            "X-Device-Id": uiDeviceId,
            "X-API-Key": uiApiKey,
          },
        });
        if (!response.ok) return;
        const data = await response.json();
        const nextCount = Number.isFinite(Number(data?.count))
          ? Number(data.count)
          : null;
        const nextDebug = data?.debug ?? null;
        setLastReadingsCount(nextCount);
        setLastReadingsDebug(nextDebug);
        if (DEBUG_DEMO) {
          console.log(
            `[poll] uiSession=${uiSessionId?.slice(0, 8) || "none"} count=${nextCount ?? "n/a"} effective=${nextDebug?.effective_session_id || "n/a"}`
          );
        }
        const fetchedReadings = Array.isArray(data?.readings)
          ? data.readings
          : Array.isArray(data)
            ? data
            : [];

        if (!isActive) return;

        const nextLatest = buildLatestBySensor(fetchedReadings);
        setLatestBySensor(nextLatest);

        const nextSensors = Array.from(
          new Set(
            fetchedReadings
              .map((reading) => reading?.sensor || reading?.sensor_id || "")
              .filter(Boolean)
          )
        );
        setSensors(nextSensors);
        const nextSelected = ensureSensorSelection(nextSensors);
        if (nextSelected !== selectedSensor) {
          setSelectedSensor(nextSelected);
          setSeries([]);
        }

        if (!nextSelected) return;

        const sensorReadings = fetchedReadings.filter(
          (reading) =>
            (reading?.sensor || reading?.sensor_id || "") === nextSelected
        );
        if (sensorReadings.length === 0) return;
        const parsedTimes = sensorReadings
          .map((reading) => parseCreatedAt(reading))
          .filter(Boolean);
        const uniqueTimes = new Set(
          parsedTimes.map((timestamp) => timestamp.getTime())
        );
        const lastReading = sensorReadings[sensorReadings.length - 1];
        const lastValue = Number(lastReading?.value);

        setSeries((prev) => {
          const existingTimes = new Set(prev.map((point) => point.t.getTime()));
          let nextSeries = [...prev];

          if (parsedTimes.length === 0 || uniqueTimes.size <= 1) {
            if (Number.isNaN(lastValue)) return prev;
            const fallbackPoint = {
              t: new Date(),
              v: lastValue,
            };
            if (!existingTimes.has(fallbackPoint.t.getTime())) {
              nextSeries = [...nextSeries, fallbackPoint];
            }
          } else {
            const candidates = sensorReadings
              .map((reading) => ({
                t: parseCreatedAt(reading),
                v: Number(reading?.value),
              }))
              .filter((point) => point.t && !Number.isNaN(point.v))
              .sort((a, b) => a.t - b.t)
              .filter((point) => !existingTimes.has(point.t.getTime()));
            if (candidates.length > 0) {
              nextSeries = [...nextSeries, ...candidates];
            }
          }

          if (nextSeries.length > seriesLimit) {
            nextSeries = nextSeries.slice(-seriesLimit);
          }
          return nextSeries;
        });
      } catch {
        // Intentionally silent for now.
      }
    };

    loadReadings();
    const intervalId = setInterval(loadReadings, pollIntervalMs);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [
    apiBase,
    uiSessionId,
    uiDeviceId,
    uiApiKey,
    isStreaming,
    pollIntervalMs,
    readingsLimit,
    selectedSensor,
  ]);

  useEffect(() => {
    if (!selectedSensor && sensors.length > 0) {
      setSelectedSensor(sensors.includes("hr_bpm") ? "hr_bpm" : sensors[0]);
    }
  }, [selectedSensor, sensors]);

  useEffect(() => {
    setSeries([]);
  }, [selectedSensor]);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    if (series.length < 2) {
      ctx.fillStyle = "#777";
      ctx.font = "12px monospace";
      ctx.fillText("Waiting for data...", 8, 18);
      return;
    }

    const values = series.map((point) => point.v);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;
    const paddingX = 8;
    const paddingY = 12;
    const chartHeight = height - 24 - paddingY;
    const stepX =
      values.length > 1
        ? (width - paddingX * 2) / (values.length - 1)
        : 0;

    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height - 24);
    ctx.lineTo(width, height - 24);
    ctx.stroke();

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    values.forEach((value, index) => {
      const x = paddingX + index * stepX;
      const y =
        paddingY + (1 - (value - minValue) / range) * (chartHeight - paddingY);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    const lastPoint = series[series.length - 1];
    const lastX = paddingX + (values.length - 1) * stepX;
    const lastY =
      paddingY +
      (1 - (lastPoint.v - minValue) / range) * (chartHeight - paddingY);
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#6b7280";
    ctx.font = "10px monospace";
    ctx.fillText(`Now: ${formatValue(lastPoint.v)}`, 8, height - 6);
  }, [series]);

  const latestSelected =
    series.length > 0 ? series[series.length - 1] : null;

  const statusLabel =
    apiStatus === "ready"
      ? "ready"
      : apiStatus === "checking"
        ? "checking"
        : apiStatus === "waking"
          ? "waking"
          : "error";
  const canStart = apiStatus === "ready" && !isInitializingSession;
  const showStatusCard = apiStatus !== "ready";
  const startButtonLabel = !canStart
    ? apiStatus === "error"
      ? "Server unavailable"
      : isInitializingSession
        ? "Initializing session..."
        : "Starting server..."
    : isStreaming
      ? "Stop Demo"
      : "Start Demo";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:py-12">
      <header className="border-b border-zinc-200 pb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="pb-2">
              <Button
                asChild
                variant="ghost"
                className="h-auto rounded-full border border-zinc-200/80 bg-white/70 px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-white"
              >
                <Link href="/">&larr; Back to Portfolio</Link>
              </Button>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Live Demo
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-[2rem]">
                SensorStream Live Demo
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-600 sm:text-[0.95rem]">
              Real-time device telemetry viewer with live session status, sensor selection, and
              streaming chart updates.
            </p>
            <div className="space-y-1.5">
              {isInitializingSession && (
                <div className="text-sm text-zinc-500">
                  Initializing demo session...
                </div>
              )}
              {sessionError && (
                <div className="text-sm text-red-600">{sessionError}</div>
              )}
              {pumpWarning && (
                <div className="text-sm text-amber-700">{pumpWarning}</div>
              )}
              {!isInitializingSession && !sessionError && !pumpWarning && (
                <div className="text-sm text-zinc-500">API status: {statusLabel}</div>
              )}
            </div>
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-4 xl:items-end">
            <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-3 shadow-sm sm:p-4">
              <div className="flex flex-wrap gap-2.5 text-zinc-700">
                <span className={`${statusPillClassName} font-semibold uppercase tracking-[0.14em]`}>
                  API {statusLabel}
                </span>
                <span className={`${neutralPillClassName} font-mono`}>
                  Device: {uiDeviceId ? `${uiDeviceId.slice(0, 8)}...` : "(demo)"}
                </span>
                <span className={`${neutralPillClassName} font-mono`}>
                  Session: {uiSessionId ? `${uiSessionId.slice(0, 8)}...` : "(none)"}
                </span>
                <span className={neutralPillClassName}>Poll Interval: {pollIntervalMs / 1000}s</span>
                <span className={neutralPillClassName}>Showing Count: {readingsLimit}</span>
                <span className={neutralPillClassName}>Sensor: {selectedSensor || "N/A"}</span>
                <span className={neutralPillClassName}>Points: {series.length}</span>
                <span className={`${streamingPillClassName} font-semibold uppercase tracking-[0.14em]`}>
                  Streaming {isStreaming ? "on" : "off"}
                </span>
              </div>
            </div>

            <div className="flex sm:justify-end">
              <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-2 shadow-sm">
                <button
                  type="button"
                  onClick={handleStartStop}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  disabled={!canStart}
                  className={`rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                    canStart
                      ? buttonClassName
                      : "cursor-not-allowed bg-zinc-300 text-zinc-500 shadow-none"
                  }`}
                >
                  {startButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showStatusCard && (
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          {apiStatus === "waking" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                </span>
                <h2 className="text-sm font-semibold text-zinc-900">
                  Starting demo server...
                </h2>
              </div>
              <p className="text-sm text-zinc-600">
                This portfolio uses a free-tier backend that may sleep when idle.
                First launch can take ~10–45 seconds.
              </p>
            </div>
          )}
          {apiStatus === "checking" && (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-5 w-5 items-center justify-center">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
              </span>
              <p className="text-sm font-medium text-zinc-700">
                Checking API status...
              </p>
            </div>
          )}
          {apiStatus === "error" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-zinc-700">
                {lastError ||
                  "Demo API didn’t respond. Please try again in a moment."}
              </p>
              <button
                type="button"
                onClick={runHealthCheck}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Retry
              </button>
            </div>
          )}
        </section>
      )}

      {DEBUG_DEMO && (
        <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-900">
              Session Debug
            </h2>
            <span className="text-[11px] text-amber-800">
              Count: {lastReadingsCount ?? "n/a"}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-zinc-700">
            <div>
              UI: device_id={uiDeviceId ? uiDeviceId.slice(0, 8) : "(none)"} session_id=
              {uiSessionId ? uiSessionId.slice(0, 8) : "(none)"}
            </div>
            <div className="truncate">
              Request: {lastReadingsUrl || "(none yet)"}
            </div>
            <div>
              API debug: requested_session_id=
              {lastReadingsDebug?.requested_session_id
                ? String(lastReadingsDebug.requested_session_id).slice(0, 8)
                : "(none)"}{" "}
              active_session_id=
              {lastReadingsDebug?.active_session_id
                ? String(lastReadingsDebug.active_session_id).slice(0, 8)
                : "(none)"}{" "}
              effective_session_id=
              {lastReadingsDebug?.effective_session_id
                ? String(lastReadingsDebug.effective_session_id).slice(0, 8)
                : "(none)"}{" "}
              returned_count=
              {lastReadingsDebug?.returned_count ?? lastReadingsCount ?? "n/a"}
            </div>
            {lastReadingsCount === 0 && (
              <div className="font-medium text-amber-900">
                Count=0: session mismatch or ingestion not tagging this session.
              </div>
            )}
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Latest values
                </h2>
                <p className="text-xs text-zinc-500">
                  Most recent reading for each active sensor.
                </p>
              </div>
            </div>
            <div className="p-5">
              {Object.keys(latestBySensor).length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center">
                  <p className="text-sm font-medium text-zinc-700">No readings yet</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Start the demo to populate live sensor values.
                  </p>
                </div>
              ) : (
                <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3">
                  {Object.entries(latestBySensor).map(([sensor, reading]) => {
                    const isSelected = sensor === selectedSensor;
                    return (
                      <div
                        key={sensor}
                        className={`flex h-full flex-col justify-between gap-2 rounded-xl border px-3.5 py-3 ${
                          isSelected
                            ? "border-blue-200 bg-blue-50/80 shadow-sm"
                            : "border-zinc-200 bg-zinc-50/70"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                            {sensor}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {formatTimestamp(parseReadingTime(reading))}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">
                          {formatValue(reading?.value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {latestSelected && (
                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                  Latest {selectedSensor}: {formatValue(latestSelected.v)} at{" "}
                  {formatTimestamp(latestSelected.t)}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-zinc-900">Readings</h2>
                <p className="text-xs text-zinc-500">
                  Live series history for the selected sensor.
                </p>
              </div>
            </div>
            <div className="max-h-[420px] overflow-auto px-5 pb-5 pt-3">
              <table className="w-full border-collapse text-[13px]">
                <thead className="sticky top-0 z-10 bg-white text-left">
                  <tr className="text-zinc-600">
                    <th className="border-b border-zinc-200 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]">
                      Time
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]">
                      Sensor
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em]">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {series.length === 0 ? (
                    <tr>
                      <td
                        className="px-3 py-8"
                        colSpan={3}
                      >
                        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center">
                          <p className="text-sm font-medium text-zinc-700">Waiting for data...</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            New readings will appear here as the demo streams.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    series.map((point, index) => (
                      <tr
                        key={`${point.t.getTime()}-${index}`}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-zinc-50"
                        }`}
                      >
                        <td className="border-b border-zinc-100 px-3 py-2.5 font-mono text-xs text-zinc-600">
                          {formatTimestamp(point.t)}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2.5 font-mono text-xs text-zinc-700">
                          {selectedSensor || "N/A"}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2.5 font-medium text-zinc-900">
                          {formatValue(point.v)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm lg:col-span-7">
          <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-zinc-900">Chart</h2>
              <p className="text-xs text-zinc-500">
                Live trend view for the selected telemetry stream.
              </p>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
              <label className="text-sm font-medium text-zinc-600">Sensor</label>
              <select
                value={selectedSensor}
                onChange={(event) => setSelectedSensor(event.target.value)}
                className="min-w-[150px] rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {sensors.length === 0 ? (
                  <option value="">No sensors</option>
                ) : (
                  sensors.map((sensor) => (
                    <option key={sensor} value={sensor}>
                      {sensor}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="p-5">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 sm:p-4">
              <canvas ref={chartRef} className="block h-[260px] w-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
