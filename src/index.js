import 'bulma/css/bulma.min.css';
import './styles/index.css';

import StarMap from './StarMap';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  new StarMap(rootElement, window);
})
