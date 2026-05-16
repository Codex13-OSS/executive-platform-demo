import { useEffect, useMemo, useState } from 'react';

type Variant = 'login' | 'compact';

type Props = { variant: Variant };

type WeatherState = {
  city: string;
  temp: number;
  label: string;
  code: number;
};

const fallback: WeatherState = { city: 'CDMX', temp: 22, label: 'Parcialmente nublado', code: 2 };

const mapCode = (code: number) => {
  if (code === 0) return 'Despejado';
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Nublado';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Lluvia';
  if ([95, 96, 99].includes(code)) return 'Tormenta';
  return 'Parcialmente nublado';
};

const toneFrom = (label: string, hour: number) => {
  const isNight = hour >= 19 || hour <= 6;
  if (label.includes('Tormenta')) return 'storm';
  if (label.includes('Lluvia')) return 'rain';
  if (label.includes('Nublado')) return 'cloud';
  if (label.includes('Despejado')) return isNight ? 'night' : 'sun';
  if (label.includes('Parcialmente nublado')) return isNight ? 'night' : 'partly';
  return 'partly';
};

export default function ExecutiveEnvironmentCard({ variant }: Props) {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState<WeatherState>(fallback);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 60000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const updateWeather = (lat: number, lon: number, city: string) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          const temp = Number(data?.current?.temperature_2m ?? fallback.temp);
          const code = Number(data?.current?.weather_code ?? fallback.code);
          setWeather({ city, temp: Number.isFinite(temp) ? temp : fallback.temp, code, label: mapCode(code) });
        })
        .catch(() => {
          if (!cancelled) setWeather(fallback);
        });
    };

    if (!navigator.geolocation) {
      setWeather(fallback);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let city = 'CDMX';
        try {
          const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=es`);
          const g = await geo.json();
          city = g?.results?.[0]?.name ?? city;
        } catch {
          city = 'CDMX';
        }
        updateWeather(latitude, longitude, city);
      },
      () => setWeather(fallback),
      { timeout: 5000, maximumAge: 300000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const tone = useMemo(() => toneFrom(weather.label, now.getHours()), [weather.label, now]);

  return (
    <section className={`executive-environment-card ${variant} tone-${tone}`}>
      <div className={`weather-visual weather-${tone}`} aria-hidden="true">
        <span className="sun" />
        <span className="halo" />
        <span className="ray r1" />
        <span className="ray r2" />
        <span className="cloud c1" />
        <span className="cloud c2" />
        <span className="mist" />
        <span className="rain-line rl1" />
        <span className="rain-line rl2" />
        <span className="rain-line rl3" />
        <span className="bolt" />
        <span className="moon" />
        <span className="star s1" />
        <span className="star s2" />
      </div>

      <div className="env-main">
        <strong>{now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</strong>
        <p>{now.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' })}</p>
      </div>

      <div className="env-meta">
        <strong>{weather.city}</strong>
        <p>{Math.round(weather.temp)}°C · {weather.label}</p>
      </div>
    </section>
  );
}
