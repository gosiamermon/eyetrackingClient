import * as React from 'react';
import './contentContainer.css';

interface Props {
  children: React.ReactNode
}

export default ({ children }: Props) => (
  <div className="content-container">
    <div className="content">
      {children}
    </div>
  </div>
);
