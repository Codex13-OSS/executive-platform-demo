import {
  getConnectorActivationReviewPack,
  validateConnectorActivationReviewPack,
} from '../integrations/connectorActivationReviewPack';

export function ConnectorActivationReviewCard() {
  const reviewPack = getConnectorActivationReviewPack();
  const validation = validateConnectorActivationReviewPack(reviewPack);

  return (
    <section className={`connector-activation-review-card-v230 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="connector-activation-review-head-v230">
        <div>
          <span>CONNECTOR ACTIVATION REVIEW</span>
          <p>Agenda source · review ready / activation locked</p>
        </div>
        <b>LOCKED</b>
      </div>

      <div className="connector-activation-review-grid-v230">
        <article><small>source</small><strong>{reviewPack.sourceDomain}</strong></article>
        <article><small>mode</small><strong>review only</strong></article>
        <article><small>reads</small><strong>prepared</strong></article>
        <article><small>writes</small><strong>blocked</strong></article>
        <article><small>endpoint</small><strong>locked</strong></article>
        <article><small>credentials</small><strong>locked</strong></article>
      </div>

      <ul className="connector-activation-review-checks-v230">
        {reviewPack.checklist.map((item) => (
          <li key={item}>
            <span aria-hidden="true">•</span>
            <b>{item}</b>
          </li>
        ))}
      </ul>

      <div className="connector-activation-review-decision-v230">
        <span>REVIEW READY</span>
        <strong>Activation remains locked</strong>
      </div>
    </section>
  );
}
