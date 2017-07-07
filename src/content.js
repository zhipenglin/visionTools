import React from 'react'
import ReactDOM from 'react-dom'
import ContentView from './components/ContentView'
const node = document.createElement('div');
node.id = 'vt-root';
document.body.appendChild(node);
ReactDOM.render(<ContentView/>, node);