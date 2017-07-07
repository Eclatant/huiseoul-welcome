import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";

import Game from "./components/App";
import Store from "./components/Store";

interface IStores {
  store: Store;
}

ReactDOM.render(
  <Provider store={new Store()}>
    <Game />
  </Provider>,
  document.querySelector("#root") as HTMLElement
);

export default IStores;
