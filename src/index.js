import App from './app';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  const app = new App(window);
  app.display(rootElement, document);
})
