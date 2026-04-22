import MessageList from "./MessageList.jsx";
import PromptBox from "./PromptBox.jsx";

function getQuestionMetrics(question) {
  const text = question || "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;

  return {
    words,
    characters
  };
}

function getAnswerStatus(answer) {
  if (!answer || !answer.trim()) {
    return "Waiting for execution";
  }

  if (answer === "Loading answer...") {
    return "Running";
  }

  if (answer === "Failed to load answer from orchestrator.") {
    return "Execution failed";
  }

  return "Answer ready";
}

export default function ChatWindow({ question, onQuestionChange, onSubmit, answer }) {
  const metrics = getQuestionMetrics(question);
  const answerStatus = getAnswerStatus(answer);

  return (
    <section className="panel chat-panel">
      <h2>Agent Interaction</h2>

      <div
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
          padding: "1rem",
          border: "1px solid #d0d7de",
          borderRadius: "10px",
          background: "#fcfcfd"
        }}
      >
        <div
          style={{
            display: "inline-block",
            marginBottom: "0.75rem",
            padding: "0.2rem 0.55rem",
            borderRadius: "999px",
            background: "#f2f4f7",
            color: "#344054",
            fontWeight: 700,
            fontSize: "0.8rem"
          }}
        >
          Analyst entry point
        </div>

        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Interaction Summary</h3>

        <div style={{ color: "#344054" }}>
          <div><strong>Question Words:</strong> {metrics.words}</div>
          <div><strong>Question Characters:</strong> {metrics.characters}</div>
          <div><strong>Execution Status:</strong> {answerStatus}</div>
        </div>
      </div>

      <MessageList question={question} answer={answer} />

      <div
        style={{
          marginTop: "1rem",
          padding: "0.85rem",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          background: "#ffffff",
          color: "#475467"
        }}
      >
        Enter a question to trigger the reference workflow, retrieval trace generation, grounded context assembly, and final answer preparation.
      </div>

      <div style={{ marginTop: "1rem" }}>
        <PromptBox
          question={question}
          onQuestionChange={onQuestionChange}
          onSubmit={onSubmit}
        />
      </div>
    </section>
  );
}
