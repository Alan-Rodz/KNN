'use client';

import React, { useState } from 'react';
import Plot from 'react-plotly.js';

// ********************************************************************************
interface DataPoint {
  x: number;
  y: number;
  label: string;
}

const generateData = (count: number) => {
  const data: DataPoint[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const label = Math.random() > 0.5 ? "A" : "B";
    data.push({ x, y, label });
  }
  return data;
};

const distance = (p1: DataPoint, p2: DataPoint) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

const knn = (data: DataPoint[], point: DataPoint, k: number) => {
  const distances = data.map((d) => ({
    point: d,
    distance: distance(point, d)
  }));
  distances.sort((a, b) => a.distance - b.distance);
  const nearestNeighbors = distances.slice(0, k);
  const counts = nearestNeighbors.reduce((acc, curr) => {
    acc[curr.point.label] = (acc[curr.point.label] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  return Object.keys(counts).reduce(
    (prev, curr) => (counts[curr] > counts[prev] ? curr : prev),
    Object.keys(counts)[0]
  );
};

const LandingPageComponent: React.FC = () => {
  const [data] = useState(() => generateData(50));
  const [k, setK] = useState(3);
  const [hoverData, setHoverData] = useState<DataPoint | null>(null);

  const handleHover = (event: any) => {
    if (event.points.length > 0) {
      const pointIndex = event.points[0].pointIndex;
      setHoverData(data[pointIndex]);
    } else {
      setHoverData(null);
    }
  };

  return (
    <div>
      <h1>K-Nearest Neighbors</h1>
      <div>
        K:{" "}
        <input
          type="number"
          value={k}
          onChange={(e) => setK(parseInt(e.target.value))}
        />
      </div>
      <Plot
        data={[
          {
            type: "scatter",
            mode: "markers",
            x: data.map((d) => d.x),
            y: data.map((d) => d.y),
            text: data.map((d) => d.label),
            marker: {
              color: data.map((d) => (d.label === "A" ? "blue" : "red"))
            },
            hoverinfo: "text"
          }
        ]}
        layout={{ width: 800, height: 600, title: "K-Nearest Neighbors" }}
        onHover={handleHover}
      />
      {hoverData && (
        <div>
          Hovered Data Point: ({hoverData.x.toFixed(2)}, {hoverData.y.toFixed(2)}){" "}
          with label: {hoverData.label}
        </div>
      )}
      <div>
        Prediction at (3, 5): {knn(data, { x: 3, y: 5, label: "" }, k)}
      </div>
    </div>
  );
};


// == Export ======================================================================
export default LandingPageComponent;
