import React from 'react';
import './App.css';
import CurrencySwapForm from "./components/SwapForm.tsx";

const App: React.FC = () => {
    return (
        <div className="App">
            <CurrencySwapForm />
        </div>
    );
};

export default App;
