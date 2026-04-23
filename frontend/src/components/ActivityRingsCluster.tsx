import ActivityRing from './ActivityRing';

type ActivityRingsClusterProps = {
  values: { label: string; sublabel: string; progress: number; color: string }[];
};

export default function ActivityRingsCluster({ values }: ActivityRingsClusterProps) {
  return (
    <div className="rings-cluster" aria-label="Resumen de actividad ejecutiva">
      {values.slice(0, 3).map((item, index) => (
        <ActivityRing
          key={item.label}
          label={item.label}
          sublabel={item.sublabel}
          progress={item.progress}
          color={item.color}
          size={index === 0 ? 220 : 170}
        />
      ))}
    </div>
  );
}
