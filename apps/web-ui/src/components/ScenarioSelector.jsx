export default function ScenarioSelector({ scenario, onScenarioChange }) {
  return (
    <section className="panel">
      <h2>Workflow</h2>
      <select
        className="input"
        value={scenario}
        onChange={(event) => onScenarioChange(event.target.value)}
      >
        <option value="analysis-request">Analysis Request</option>
        <option value="operational-issue">Operational Issue</option>
        <option value="workflow-update">Workflow Update</option>
      </select>
      <p className="panel-note">
        Workflow templates are included as neutral presets for architecture visualization.
      </p>
    </section>
  );
}
