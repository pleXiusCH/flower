import styles from './app.module.scss';
import { Route, Link } from 'react-router-dom';
import { FlowerReact } from '@flower/react';

export function App() {
  return (
    <div className={styles.app}>
      <FlowerReact />
    </div>
  );
}

export default App;
