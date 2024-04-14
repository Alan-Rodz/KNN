import { DataPoint, HyperParams } from './type';

// ********************************************************************************
export const generateData = ({ clusterCount, pointsPerCluster, clusterRadius }: HyperParams) => {
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

export const computeEuclideanDistance = (p1: DataPoint, p2: DataPoint) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

export const knn = (data: DataPoint[], point: DataPoint, k: number) => {
  const distances = data.map((d) => ({ point: d, distance: computeEuclideanDistance(point, d) }));
  distances.sort((a, b) => a.distance - b.distance);
  const nearestNeighbors = distances.slice(0, k);

  const counts = nearestNeighbors.reduce((acc, curr) => {
    acc[curr.point.label] = (acc[curr.point.label] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return Object.keys(counts).reduce((prev, curr) => (counts[curr] > counts[prev] ? curr : prev), Object.keys(counts)[0]);
};
