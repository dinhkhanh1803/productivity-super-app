"use client";

import { useState, useEffect, useRef } from "react";

/* ─── WMO weather-code → condition key ───────────────────── */
function wmoToCondition(code: number): string {
  if (code === 0) return "clear";
  if (code <= 2) return "partlyCloudy";
  if (code === 3) return "overcast";
  if (code <= 48) return "foggy";
  if (code <= 55) return "drizzle";
  if (code <= 65) return "rain";
  if (code <= 67) return "heavyRain";
  if (code <= 75) return "snow";
  if (code <= 82) return "showers";
  if (code <= 99) return "thunderstorm";
  return "unknown";
}

function wmoToEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 67) return "🌨️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

export interface WeatherData {
  temp: number;          // °C, rounded
  conditionKey: string;  // key into weather.conditions
  emoji: string;
  city: string;
  lat: number;
  lon: number;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: boolean;
}

const REFRESH_MS = 10 * 60 * 1000; // 10 minutes

/* Default: Ho Chi Minh City */
const DEFAULT = { lat: 10.8231, lon: 106.6297, city: "Ho Chi Minh City" };

async function fetchCity(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const json = await res.json();
    return (
      json?.address?.city ||
      json?.address?.town ||
      json?.address?.state ||
      json?.address?.country ||
      "Your Location"
    );
  } catch {
    return "Your Location";
  }
}

async function fetchWeather(lat: number, lon: number): Promise<{ temp: number; code: number }> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code` +
    `&temperature_unit=celsius`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const json = await res.json();
  return {
    temp: Math.round(json.current.temperature_2m),
    code: json.current.weather_code,
  };
}

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({ data: null, loading: true, error: false });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function load(lat: number, lon: number, city: string) {
    try {
      const { temp, code } = await fetchWeather(lat, lon);
      setState({
        loading: false,
        error: false,
        data: {
          temp,
          conditionKey: wmoToCondition(code),
          emoji: wmoToEmoji(code),
          city,
          lat,
          lon,
        },
      });
    } catch {
      setState((s) => ({ ...s, loading: false, error: true }));
    }
  }

  async function init() {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      const city = await fetchCity(lat, lon);
      await load(lat, lon, city);
      // Schedule refresh
      timerRef.current = setInterval(() => load(lat, lon, city), REFRESH_MS);
    } catch {
      // Geolocation denied / unavailable → use default city
      await load(DEFAULT.lat, DEFAULT.lon, DEFAULT.city);
      timerRef.current = setInterval(
        () => load(DEFAULT.lat, DEFAULT.lon, DEFAULT.city),
        REFRESH_MS
      );
    }
  }

  useEffect(() => {
    init();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
