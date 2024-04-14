'use client';

import React, { useState } from 'react';
import Plot from 'react-plotly.js';

// ********************************************************************************
// == Type ========================================================================
type DataPoint = {
  x: number;
  y: number;
  label: number;
}

// == Constant ====================================================================
const generateData = (
  clusterCount: number,
  pointsPerCluster: number,
  clusterRadius: number
) => {
  const data: DataPoint[] = [];
  for (let i = 0; i < clusterCount; i++) {
    const clusterX = Math.random() * 10;
    const clusterY = Math.random() * 10;
    for (let j = 0; j < pointsPerCluster; j++) {
      const x = clusterX + (Math.random() - 0.5) * clusterRadius;
      const y = clusterY + (Math.random() - 0.5) * clusterRadius;
      const label = i;
      data.push({ x, y, label });
    }
  }
  return data;
};


const computeEuclideanDistance = (p1: DataPoint, p2: DataPoint) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

const knn = (data: DataPoint[], point: DataPoint, k: number) => {
  const distances = data.map((d) => ({ point: d, distance: computeEuclideanDistance(point, d) }));
  distances.sort((a, b) => a.distance - b.distance);
  const nearestNeighbors = distances.slice(0, k);

  const counts = nearestNeighbors.reduce((acc, curr) => {
    acc[curr.point.label] = (acc[curr.point.label] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return Object.keys(counts).reduce((prev, curr) => (counts[curr] > counts[prev] ? curr : prev), Object.keys(counts)[0]);
};

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
