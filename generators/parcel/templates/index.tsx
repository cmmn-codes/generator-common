import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => (
  <div>
    <h1>Hello World</h1>
  </div>
);

function installApp() {
  const container = document.getElementById('app');
  if (!container) throw new Error('Cannot find element with id "app"');
  const root = createRoot(container);
  root.render(App());
}

window.onload = installApp;
