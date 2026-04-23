import { FormEvent, useMemo, useState } from 'react';

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
};

const defaultDraft: EntryDraft = {
  text: 'Barbara buscó reunión. Revisar permiso pendiente. Confirmar comité.',
  category: 'Seguimiento ejecutivo',
  owner: 'Coordinación general',
  priority: 'medium',
};

export default function EntryFormView({ initialDraft, onBack, onSave }: EntryFormViewProps) {
  const [draft, setDraft] = useState<EntryDraft>(initialDraft ?? defaultDraft);
  const [error, setError] = useState<string | null>(null);

  const subtitle = useMemo(
    () => 'Lo que antes llegaba disperso, aquí entra por una sola puerta.',
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.text.trim()) {
      setError('La nota es obligatoria.');
      return;
    }

    if (!draft.category.trim()) {
      setError('La categoría es obligatoria.');
      return;
    }

    if (!draft.owner.trim()) {
      setError('El responsable es obligatorio.');
      return;
    }

    if (!draft.priority) {
      setError('Selecciona una prioridad.');
      return;
    }

    setError(null);
    onSave({
      text: draft.text.trim(),
      category: draft.category.trim(),
      owner: draft.owner.trim(),
      priority: draft.priority,
    });
  };

  return (
    <main className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Nueva entrada ejecutiva</p>
          <h1>Captura inicial</h1>
          <p className="muted">{subtitle}</p>
        </div>
        <button type="button" className="ghost" onClick={onBack}>
          Volver al dashboard
        </button>
      </header>

      <section className="panel">
        <form className="entry-form" onSubmit={handleSubmit}>
          <label>
            Nota en bruto
            <textarea
              value={draft.text}
              onChange={(event) => setDraft((prev) => ({ ...prev, text: event.target.value }))}
              rows={6}
              placeholder="Describe el contexto principal"
            />
          </label>

          <div className="entry-grid">
            <label>
              Categoría
              <input
                type="text"
                value={draft.category}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, category: event.target.value }))
                }
                placeholder="Ej. Comité / Permisos / Operación"
              />
            </label>

            <label>
              Responsable
              <input
                type="text"
                value={draft.owner}
                onChange={(event) => setDraft((prev) => ({ ...prev, owner: event.target.value }))}
                placeholder="Equipo o persona responsable"
              />
            </label>

            <label>
              Prioridad
              <select
                value={draft.priority}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    priority: event.target.value as EntryDraft['priority'],
                  }))
                }
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
            <button type="button" className="ghost" onClick={onBack}>
              Cancelar
            </button>
            <button type="submit">Convertir en acciones</button>
          </div>
        </form>
      </section>
    </main>
  );
}
