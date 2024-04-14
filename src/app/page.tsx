'use client';

import { useState } from 'react';
import Plot from 'react-plotly.js';

import { generateData, knn } from './math';
import { DataPoint } from './type';

// ********************************************************************************
// == Component ===================================================================
const LandingPageComponent: React.FC = () => {
  // -- State ---------------------------------------------------------------------
  const [k, setK] = useState(3);
  const [data] = useState(() => generateData(2, 20, 1.5));
  const [hoverData, setHoverData] = useState<DataPoint | null>(null);

  // -- Handler -------------------------------------------------------------------
  const handleHover = (event: any) => {
    if (event.points.length > 0) {
      const pointIndex = event.points[0].pointIndex;
      setHoverData(data[pointIndex]);
    } else {
      setHoverData(null);
    }
  };

  // -- UI ------------------------------------------------------------------------
  return (
    <div>
      <h1>K-Nearest Neighbors</h1>
      <div>K: {' '} <input onChange={(e) => setK(parseInt(e.target.value))} type='number' value={k} />
      </div>
      <Plot
        data={[
          {
            type: 'scatter',
            mode: 'markers',
            x: data.map((d) => d.x),
            y: data.map((d) => d.y),
            text: data.map((d) => d.label.toString()),
            marker: {
              color: data.map((d) => (d.label === 0 ? 'blue' : 'red'))
            },
            hoverinfo: 'text'
          }
        ]}
        layout={{ width: 800, height: 600, title: 'K-Nearest Neighbors' }}
        onHover={handleHover}
      />
      {
        hoverData && (
          <div>
            Hovered Data Point: ({hoverData.x.toFixed(2)}, {hoverData.y.toFixed(2)}){' '}
            with label: {hoverData.label}
          </div>
        )}

      <div> Prediction at (3, 5): {knn(data, { x: 3, y: 5, label: 0 }, k)}</div>
    </div>
  );
};


// == Export ======================================================================
export default LandingPageComponent;
