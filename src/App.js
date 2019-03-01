import React, { Component } from 'react';
import './App.css';
import AllDays from './components/Day/AllDays';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AllDays/>
        {/*<AllSets/>*/}
      </div>
    );
  }
}

export default App;
