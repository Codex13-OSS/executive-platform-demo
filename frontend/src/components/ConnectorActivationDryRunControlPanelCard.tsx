import {
  getConnectorActivationDryRunControlPack,
  validateConnectorActivationDryRunControlPack,
} from '../integrations/connectorActivationDryRunControlPanel';

export function ConnectorActivationDryRunControlPanelCard() {
  const controlPack = getConnectorActivationDryRunControlPack();
  const validation = validateConnectorActivationDryRunControlPack(controlPack);

  return (
    <section className={`connector-dry-run-control-card-v250 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="connector-dry-run-control-head-v250">
        <div>
          <span>CONNECTOR DRY-RUN CONTROL</span>
          <p>Agenda source · simulation ready / activation locked</p>
        </div>
        <b>DRY-RUN</b>
      </div>

      <div className="connector-dry-run-control-grid-v250">
        <article><small>domain</small><strong>{controlPack.sourceDomain}</strong></article>
        <article><small>mode</small><strong>simulation</strong></article>
        <article><small>read</small><strong>preview</strong></article>
        <article><small>write</small><strong>blocked</strong></article>
        <article><small>real source</small><strong>off</strong></article>
        <article><small>activation</small><strong>locked</strong></article>
      </div>

      <div className="connector-dry-run-control-steps-v250">
        {controlPack.dryRunSteps.map((step) => (
          <article key={step.id}>
            <span>{step.label}</span>
            <b>{step.state}</b>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>

      <div className="connector-dry-run-control-actions-v250">
        {controlPack.allowedActions.map((action) => (
          <span key={action}>{action.replace(/_/g, ' ')}</span>
        ))}
      </div>

      <div className="connector-dry-run-control-decision-v250">
        <span>DRY-RUN READY</span>
        <strong>{controlPack.decision}</strong>
      </div>
    </section>
  );
}
