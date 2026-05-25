import {
  getConnectorActivationPermissionGatePack,
  validateConnectorActivationPermissionGatePack,
} from '../integrations/connectorActivationPermissionGate';

export function ConnectorActivationPermissionGateCard() {
  const gatePack = getConnectorActivationPermissionGatePack();
  const validation = validateConnectorActivationPermissionGatePack(gatePack);

  return (
    <section className={`connector-permission-gate-card-v240 ${validation.status === 'safe' ? 'is-safe' : 'is-warning'}`}>
      <div className="connector-permission-gate-head-v240">
        <div>
          <span>CONNECTOR PERMISSION GATE</span>
          <p>Agenda source · permission ready / activation blocked</p>
        </div>
        <b>BLOCKED</b>
      </div>

      <div className="connector-permission-gate-grid-v240">
        <article><small>domain</small><strong>{gatePack.sourceDomain}</strong></article>
        <article><small>mode</small><strong>gate only</strong></article>
        <article><small>reads</small><strong>allowed</strong></article>
        <article><small>writes</small><strong>blocked</strong></article>
        <article><small>approval</small><strong>required</strong></article>
        <article><small>activation</small><strong>blocked</strong></article>
      </div>

      <div className="connector-permission-gate-stages-v240">
        {gatePack.stages.map((stage) => (
          <article key={stage.id}>
            <span>{stage.label}</span>
            <b>{stage.state}</b>
            <p>{stage.note}</p>
          </article>
        ))}
      </div>

      <div className="connector-permission-gate-approvals-v240">
        {gatePack.approvals.map((approval) => (
          <span key={approval.id}>{approval.label}: pending</span>
        ))}
      </div>

      <div className="connector-permission-gate-decision-v240">
        <span>PERMISSION GATE READY</span>
        <strong>{gatePack.decision}</strong>
      </div>
    </section>
  );
}
