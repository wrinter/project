import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//class App extends Component {
//  render() {
//    return (
//      <div className="App">
//        <div className="App-header">
//          <img src={logo} className="App-logo" alt="logo" />
//          <h2>Welcome to React</h2>
//        </div>
//        <p className="App-intro">
//          To get started, edit <code>src/App.js</code> and save to reload.
//        </p>
//      </div>
//    );
//  }
//}
class App extends Component {
	render () {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h2>加强锻炼</h2>
				</div>
				<div className="App-intro">
					强健中国人
				</div>
			</div>
		)
	}
}
export default App;
