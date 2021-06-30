import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import { Map } from './components';
import { ChunkDataProvider } from './data';
import reportWebVitals from './reportWebVitals';

import './Styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <ChunkDataProvider>
      <Map />

      <ToastContainer autoClose={3000} />
    </ChunkDataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
