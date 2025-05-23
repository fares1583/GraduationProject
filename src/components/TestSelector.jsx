function TestSelector({ selectedTest, setSelectedTest, setActiveTab }) {
  return (
    <div className="test-selection">
      <h2>Select Test Type</h2>
      <div className="test-buttons">
        <button
          className={`test-button ${selectedTest === "descriptive" ? "active" : ""}`}
          onClick={() => {
            setSelectedTest("descriptive");
            setActiveTab("descriptive");
          }}
        >
          Descriptive Statistics
        </button>
        <button
          className={`test-button ${selectedTest === "hypothesis" ? "active" : ""}`}
          onClick={() => {
            setSelectedTest("hypothesis");
            setActiveTab("hypothesis");
          }}
        >
          Hypothesis Tests
        </button>
        <button
          className={`test-button ${selectedTest === "regression" ? "active" : ""}`}
          onClick={() => {
            setSelectedTest("regression");
            setActiveTab("regression");
          }}
        >
          Regression
        </button>
      </div>
    </div>
  );
}

export default TestSelector;