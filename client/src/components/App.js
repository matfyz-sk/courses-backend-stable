import React from "react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "../reducers";
import { createStore, applyMiddleware } from "redux";
import SimpleContainer from "../containers/SimpleContainer";

const store = createStore(reducer, applyMiddleware(thunk));

store.subscribe(() => {
  console.log("State change", store.getState());
});

const App = props => (
  <Provider store={store}>
    <div className="App">
      <SimpleContainer />
    </div>
  </Provider>
);

export default App;
