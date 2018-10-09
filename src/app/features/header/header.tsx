import * as React from 'react';
import DatabaseSelect from './components/databaseSelect/databaseSelect';
import './header.css';

export default () => {
  return (
    <div className="header">
      <div className="header-content">
        <DatabaseSelect />
      </div>
    </div>
  );
}