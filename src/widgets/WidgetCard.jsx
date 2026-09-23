import React from 'react'
import CardHeader from './CardHeader'
import '../WidgetGrid.css'


const WidgetCard = ({ title, children, actions }) => (
  <div className="wg-card" role="group" aria-label={title}>
    <CardHeader title={title} right={actions} />
    <div className="wg-card-content">{children}</div>
  </div>
);


export default WidgetCard