import React from 'react'
import '../WidgetGrid.css'


const CardHeader = ({ title, right = null, left = null }) => (
  <div className="wg-card-header">
    <div className="wg-card-title">
      {left}
      <p className="wg-title-text">{title}</p>
    </div>
    <div className="wg-card-actions">{right}</div>
  </div>
);

export default CardHeader