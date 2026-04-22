export default function MessageList({ question, answer }) {
  return (
    <div className="message-list">
      <div className="message user-message">
        <strong>User</strong>
        <p>{question}</p>
      </div>

      <div className="message assistant-message">
        <strong>Agent</strong>
        <p>{answer}</p>
      </div>
    </div>
  );
}