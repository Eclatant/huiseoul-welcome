import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Game from './Game';

ReactDOM.render(
  <Game />,
  document.querySelector('#root') as HTMLElement
);
registerServiceWorker();