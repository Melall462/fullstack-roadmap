import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VariableExercise from "./exercises/01-jsx/VariablesExercise.jsx";
import ComponentsExercise from "./exercises/02-components/GreetingExercise.jsx";
import Greeting from "./exercises/03-props/GreetingProps.jsx";
import ServiceCard from "./exercises/03-props/ServiceCard.jsx";
import Button from "./exercises/04-events/EventsExercise.jsx";
import Counter from "./exercises/05-state/CounterExercise.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Counter />
    </StrictMode>,
);
