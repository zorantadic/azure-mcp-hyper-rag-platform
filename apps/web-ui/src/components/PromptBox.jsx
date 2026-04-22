export default function PromptBox({ question, onQuestionChange, onSubmit }) {
  return (
    <div className="prompt-box">
      <textarea
        className="input textarea"
        rows="4"
        value={question}
        onChange={(event) => onQuestionChange(event.target.value)}
      />
      <button className="button" type="button" onClick={onSubmit}>
        Submit Question
      </button>
    </div>
  );
}