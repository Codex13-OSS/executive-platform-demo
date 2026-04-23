import ActivityRing from './ActivityRing';

type ActivityRingsClusterProps = {
  values: { label: string; sublabel: string; progress: number; color: string }[];
};

export default function ActivityRingsCluster({ values }: ActivityRingsClusterProps) {
  const [primary, secondary, tertiary] = values.slice(0, 3);

  return (
    <div className="rings-cluster" aria-label="Resumen de actividad ejecutiva">
      <div className="rings-main">
        {primary ? (
          <ActivityRing
            label={primary.label}
            sublabel={primary.sublabel}
            progress={primary.progress}
            color={primary.color}
            size={270}
          />
        ) : null}
      </div>
      <div className="rings-side">
        {secondary ? (
          <ActivityRing
            label={secondary.label}
            sublabel={secondary.sublabel}
            progress={secondary.progress}
            color={secondary.color}
            size={190}
          />
        ) : null}
        {tertiary ? (
          <ActivityRing
            label={tertiary.label}
            sublabel={tertiary.sublabel}
            progress={tertiary.progress}
            color={tertiary.color}
            size={190}
          />
        ) : null}
      </div>
    </div>
  );
}
