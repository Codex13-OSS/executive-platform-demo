import {
  getReadOnlyRealConnectorPreparationPack,
  validateReadOnlyRealConnectorPreparationPack,
} from '../integrations/readOnlyRealConnectorPreparation';

export function ReadOnlyRealConnectorPreparationCard() {
  const preparationPack = getReadOnlyRealConnectorPreparationPack();
  const validation = validateReadOnlyRealConnectorPreparationPack(preparationPack);

  return (
    <section className={`readonly-real-connector-prep-card-v270 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="readonly-real-connector-prep-head-v270">
        <div>
          <span>READ-ONLY REAL CONNECTOR PREP</span>
          <p>Agenda source · schema ready / real connection locked</p>
        </div>
        <b>PREPARED</b>
      </div>

      <div className="readonly-real-connector-prep-grid-v270">
        <article><small>domain</small><strong>{preparationPack.sourceDomain}</strong></article>
        <article><small>schema</small><strong>ready</strong></article>
        <article><small>adapter</small><strong>ready</strong></article>
        <article><small>endpoint</small><strong>locked</strong></article>
        <article><small>credentials</small><strong>locked</strong></article>
        <article><small>writes</small><strong>blocked</strong></article>
      </div>

      <div className="readonly-real-connector-prep-items-v270">
        {preparationPack.readinessItems.map((item) => (
          <article key={item.id}>
            <span>{item.label}</span>
            <b>{item.state}</b>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="readonly-real-connector-prep-schema-v270">
        {preparationPack.schemaFields.slice(0, 6).map((field) => (
          <span key={field.id}>{field.label}: {field.mapped ? 'mapped' : 'pending'}</span>
        ))}
      </div>

      <div className="readonly-real-connector-prep-decision-v270">
        <span>REAL PREPARATION READY</span>
        <strong>{preparationPack.nextStep}</strong>
      </div>
    </section>
  );
}
