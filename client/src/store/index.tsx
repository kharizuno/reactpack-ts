import { createStore, applyMiddleware, compose } from 'redux';
// import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import rootReducer from '../redux/reducers';

// import { createBrowserHistory } from "history";
// export const history: any = createBrowserHistory();

const initialState = {};
const enhancers: any = [];
const middleware = [thunk, promise, /*routerMiddleware(history)*/];

// if (process.env.NODE_ENV === 'development') {
//     const devToolsExtension = window.devToolsExtension;

//     if (typeof devToolsExtension === 'function') {
//         enhancers.push(devToolsExtension());
//     }
// }

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);
export const store = createStore(rootReducer, /*window.__initialData__,*/initialState, composedEnhancers);