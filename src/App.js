import React from 'react';
import logo from './logo.svg';
import './App.css';

import DATA from "./assets/data";
import CATEGORY_DATA from "./assets/categoryData";

import Select2Refactor from "./components/select2-refactor/select2";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Select2Refactor type="select-tag" categoryData={CATEGORY_DATA} data={DATA} optionCount={7} />
      </header>
    </div>
  );
}

export default App;
