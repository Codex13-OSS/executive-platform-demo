import { useEffect, useMemo, useState } from 'react';

type EnvironmentVariant = 'login' | 'compact';
type WeatherTone = 'sun' | 'partly' | 'cloud' | 'rain' | 'storm' | 'night';

type WeatherState = {
  city: string;
  temperature: number;
  condition: string;
  code: number;
};

const fallbackWeather: WeatherState = {
  city: 'CDMX',
  temperature: 22,
  condition: 'Parcialmente nublado',
  code: 2,
};

function labelFromCode(code: number): string {
  if (code === 0) return 'Despejado';
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Neblina';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code)) return 'Lluvia';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Nieve';
  if ([95, 96, 99].includes(code)) return 'Tormenta';
  return 'Clima estable';
}

function toneFromCode(code: number, hour: number): WeatherTone {
  const night = hour >= 19 || hour < 6;

  if ([95, 96, 99].includes(code)) return 'storm';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
  if ([45, 48, 71, 73, 75, 77, 85, 86].includes(code)) return 'cloud';
  if ([1, 2, 3].includes(code)) return night ? 'night' : 'partly';
  if (code === 0) return night ? 'night' : 'sun';

  return night ? 'night' : 'partly';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

export function ExecutiveEnvironmentCard({ variant = 'compact' }: { variant?: EnvironmentVariant }) {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherState>(fallbackWeather);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    const applyFallback = () => {
      if (active) setWeather(fallbackWeather);
    };

    if (!navigator.geolocation) {
      applyFallback();
      return () => {
        active = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&timezone=auto`
          );

          if (!response.ok) throw new Error('weather unavailable');

          const data = await response.json();
          const code = Number(data?.current?.weather_code ?? fallbackWeather.code);
          const temperature = Math.round(Number(data?.current?.temperature_2m ?? fallbackWeather.temperature));

          if (active) {
            setWeather({
              city: 'Ubicación actual',
              temperature,
              condition: labelFromCode(code),
              code,
            });
          }
        } catch {
          applyFallback();
        }
      },
      applyFallback,
      { timeout: 2800, maximumAge: 600_000 }
    );

    return () => {
      active = false;
    };
  }, []);

  const tone = useMemo(() => toneFromCode(weather.code, now.getHours()), [weather.code, now]);

  return (
    <aside className={`executive-environment-card ${variant} weather-${tone}`} aria-label="Hora local y clima">
      <div className="weather-visual" aria-hidden="true">
        <span className="weather-sun-disc" />
        <span className="weather-moon-disc" />
        <span className="weather-star star-one" />
        <span className="weather-star star-two" />
        <span className="weather-cloud cloud-one" />
        <span className="weather-cloud cloud-two" />
        <span className="weather-drop drop-one" />
        <span className="weather-drop drop-two" />
        <span className="weather-drop drop-three" />
        <span className="weather-bolt" />
      </div>

      <div className="environment-data">
        <strong>{formatTime(now)}</strong>
        <span>{formatDate(now)} · {weather.city}</span>
        <em>{weather.temperature}°C · {weather.condition}</em>
      </div>
    </aside>
  );
}
