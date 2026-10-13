import './App.css'

function App() {
  function handleClick() {
    alert("Welcome to ApexOS");
  }

  return (
    <div>
      <h1>Welcome to ApexOS</h1>
      <button onClick={handleClick()}>
        Get Started
      </button>
    </div>
  )
}

export default App