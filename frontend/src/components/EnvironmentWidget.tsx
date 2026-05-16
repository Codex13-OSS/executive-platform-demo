import { useEffect, useMemo, useState } from 'react';

type WeatherState = {
  city: string;
  temp: number;
  label: string;
  code: number;
};

const fallback: WeatherState = { city: 'CDMX', temp: 22, label: 'Parcialmente nublado', code: 2 };

const mapCode = (code: number) => {
  if ([0].includes(code)) return 'Despejado';
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Neblina';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Lluvia';
  if ([71, 73, 75].includes(code)) return 'Nieve';
  return 'Condición variable';
};

export default function EnvironmentWidget() {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState<WeatherState>(fallback);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const applyWeather = (lat: number, lon: number, city: string) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          const temp = Number(data?.current?.temperature_2m ?? fallback.temp);
          const code = Number(data?.current?.weather_code ?? fallback.code);
          setWeather({ city, temp: Number.isFinite(temp) ? temp : fallback.temp, code, label: mapCode(code) });
        })
        .catch(() => {
          if (!cancelled) setWeather((prev) => ({ ...fallback, city: prev.city || fallback.city }));
        });
    };

    if (!navigator.geolocation) {
      setWeather(fallback);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let city = 'Ubicación actual';
        try {
          const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=es`);
          const g = await geo.json();
          city = g?.results?.[0]?.name ?? city;
        } catch {
          city = 'Ubicación actual';
        }
        applyWeather(latitude, longitude, city);
      },
      () => setWeather(fallback),
      { timeout: 5000, maximumAge: 300000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const weatherTone = useMemo(() => {
    if (weather.label.includes('Lluvia')) return 'rain';
    if (weather.label.includes('Despejado')) return 'sun';
    if (now.getHours() >= 19 || now.getHours() <= 5) return 'night';
    return 'cloud';
  }, [weather.label, now]);

  return (
    <aside className={`environment-widget tone-${weatherTone}`}>
      <div className="weather-dot" aria-hidden="true" />
      <div>
        <strong>{now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</strong>
        <p>{now.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' })}</p>
      </div>
      <div>
        <strong>{weather.city}</strong>
        <p>{Math.round(weather.temp)}°C · {weather.label}</p>
      </div>
    </aside>
  );
}
