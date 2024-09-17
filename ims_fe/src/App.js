import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import ToastManager from './components/ToastManager';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
        <ToastManager />
      </Router>
    </Provider>
  );
}

export default App;