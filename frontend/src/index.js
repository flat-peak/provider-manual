import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/ui/App';
import {IntegrationProvider} from './app/ui/IntegrationContext';

window.bootstrap = (({auth, state, provider, onComplete}) => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <IntegrationProvider
      auth={auth}
      state={state}
      onComplete={onComplete}>
      <App />
    </IntegrationProvider>
  );
})
