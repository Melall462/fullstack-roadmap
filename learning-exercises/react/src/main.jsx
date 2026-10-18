import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VariableExercise from "./exercises/01-jsx/VariablesExercise.jsx";
import ComponentsExercise from "./exercises/02-components/GreetingExercise.jsx";
import Greeting from "./exercises/03-props/GreetingProps.jsx";
import ServiceCard from "./exercises/03-props/ServiceCard.jsx";
import Button from "./exercises/04-events/EventsExercise.jsx";
import Counter from "./exercises/05-state/CounterExercise.jsx";
import CustomerManager from "./exercises/05-state/CustomerManagerExercise.jsx";
import Name1 from "./exercises/05-state/NameExercise.jsx";
import Name2 from "./exercises/06-forms/ControlledInputExercise.jsx";
import CustomerListExercise from "./exercises/07-lists/CustomerListExercise.jsx";
import CustomerSearchExercise from "./exercises/07-lists/CustomerSearchExercise.jsx";
import Users from "./exercises/08-effects/users.jsx";
import SpreadOperatorExercise from "./exercises/SpreadOperatorExercise.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Users />
    </StrictMode>,
);
