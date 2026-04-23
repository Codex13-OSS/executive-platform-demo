import { FormEvent, useMemo, useState } from 'react';
import GlassPanel from '../components/GlassPanel';
import PageShell from '../components/PageShell';
import TopBar from '../components/TopBar';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeMode } from '../lib/theme';

type EntryDraft = {
  text: string;
  category: string;
  owner: string;
  priority: 'low' | 'medium' | 'high' | '';
};

type EntryFormViewProps = {
  initialDraft?: EntryDraft;
  onBack: () => void;
  onSave: (draft: Omit<EntryDraft, 'priority'> & { priority: 'low' | 'medium' | 'high' }) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

const defaultDraft: EntryDraft = {
  text: 'Barbara buscó reunión. Revisar permiso pendiente. Confirmar comité.',
  category: 'Seguimiento ejecutivo',
  owner: 'Coordinación general',
  priority: 'medium',
};

export default function EntryFormView({ initialDraft, onBack, onSave, theme, onToggleTheme }: EntryFormViewProps) {
  const [draft, setDraft] = useState<EntryDraft>(initialDraft ?? defaultDraft);
  const [error, setError] = useState<string | null>(null);

  const subtitle = useMemo(() => 'Lo que antes llegaba disperso, aquí entra por una sola puerta.', []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.text.trim()) return setError('La nota es obligatoria.');
    if (!draft.category.trim()) return setError('La categoría es obligatoria.');
    if (!draft.owner.trim()) return setError('El responsable es obligatorio.');
    if (!draft.priority) return setError('Selecciona una prioridad.');

    setError(null);
    onSave({
      text: draft.text.trim(),
      category: draft.category.trim(),
      owner: draft.owner.trim(),
      priority: draft.priority,
    });
  };

  return (
    <PageShell narrow>
      <TopBar
        eyebrow="Nueva entrada ejecutiva"
        title="Captura inicial"
        subtitle={subtitle}
        actions={
          <>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button type="button" className="btn-secondary" onClick={onBack}>Volver</button>
          </>
        }
      />

      <GlassPanel variant="elevated">
        <form className="entry-form" onSubmit={handleSubmit}>
          <label>
            Nota en bruto
            <textarea
              value={draft.text}
              onChange={(event) => setDraft((prev) => ({ ...prev, text: event.target.value }))}
              rows={7}
              placeholder="Describe el contexto principal"
            />
          </label>

          <div className="entry-grid">
            <label>
              Categoría
              <input type="text" value={draft.category} onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))} />
            </label>
            <label>
              Responsable
              <input type="text" value={draft.owner} onChange={(event) => setDraft((prev) => ({ ...prev, owner: event.target.value }))} />
            </label>
            <label>
              Prioridad
              <select
                value={draft.priority}
                onChange={(event) => setDraft((prev) => ({ ...prev, priority: event.target.value as EntryDraft['priority'] }))}
              >
                <option value="">Seleccionar</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </label>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <div className="entry-actions">
            <button type="button" className="btn-secondary" onClick={onBack}>Cancelar</button>
            <button type="submit" className="btn-primary">Convertir en acciones</button>
          </div>
        </form>
      </GlassPanel>
    </PageShell>
  );
}
