import {
  getConnectorActivationAuditRollbackPack,
  validateConnectorActivationAuditRollbackPack,
} from '../integrations/connectorActivationAuditRollbackReadiness';

export function ConnectorActivationAuditRollbackReadinessCard() {
  const readinessPack = getConnectorActivationAuditRollbackPack();
  const validation = validateConnectorActivationAuditRollbackPack(readinessPack);

  return (
    <section className={`connector-audit-rollback-card-v260 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="connector-audit-rollback-head-v260">
        <div>
          <span>CONNECTOR AUDIT + ROLLBACK</span>
          <p>Agenda source · evidence ready / activation locked</p>
        </div>
        <b>READY</b>
      </div>

      <div className="connector-audit-rollback-grid-v260">
        <article><small>domain</small><strong>{readinessPack.sourceDomain}</strong></article>
        <article><small>audit</small><strong>ready</strong></article>
        <article><small>rollback</small><strong>ready</strong></article>
        <article><small>real source</small><strong>off</strong></article>
        <article><small>writes</small><strong>blocked</strong></article>
        <article><small>activation</small><strong>locked</strong></article>
      </div>

      <div className="connector-audit-rollback-items-v260">
        {readinessPack.readinessItems.map((item) => (
          <article key={item.id}>
            <span>{item.label}</span>
            <b>{item.state}</b>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="connector-audit-rollback-actions-v260">
        {readinessPack.allowedActions.map((action) => (
          <span key={action}>{action.replace(/_/g, ' ')}</span>
        ))}
      </div>

      <div className="connector-audit-rollback-decision-v260">
        <span>AUDIT + ROLLBACK READY</span>
        <strong>{readinessPack.decision}</strong>
      </div>
    </section>
  );
}
