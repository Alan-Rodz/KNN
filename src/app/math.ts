import { DataPoint, HyperParams } from './type';

// ********************************************************************************
// == Data ========================================================================
const generateRandomNumber = ({ min, max }: { min: number; max: number }) => Math.random() * (max - min) + min;

export const generateData = ({ clusterCount, pointsPerCluster, clusterRadius }: HyperParams) => {
  const points: DataPoint[] = [];
  const labels = Array.from({ length: clusterCount }, (_, i) => i);
  const labelColors = labels.map((label) => `hsl(${(label * 360) / clusterCount}, 70%, 50%)`);

  for (let i = 0; i < clusterCount; i++) {
    const clusterX = generateRandomNumber({ min: 0, max: 10 });
    const clusterY = generateRandomNumber({ min: 0, max: 10 });

    for (let j = 0; j < pointsPerCluster; j++) {
      const x = clusterX + generateRandomNumber({ min: -0.5, max: 0.5 }) * clusterRadius;
      const y = clusterY + generateRandomNumber({ min: -0.5, max: 0.5 }) * clusterRadius;
      points.push({ x, y, label: labels[i] });
    }
  }

  return { labels, labelColors, points }
};

// == Distance ====================================================================
export const computeEuclideanDistance = (p1: DataPoint, p2: DataPoint) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

// == KNN =========================================================================
export const classifyUsingKNN = (points: DataPoint[], classifiedPoint: DataPoint, nearestNeighborAmount: number) => {
  const distances = points.map((d) => ({ point: d, distance: computeEuclideanDistance(classifiedPoint, d) }));
  const sortedDistances = { ...distances.sort((a, b) => a.distance - b.distance) };
  const nearestNeighbors = sortedDistances.slice(0, nearestNeighborAmount);

  const labelCounts = nearestNeighbors.reduce((acc, curr) => {
    acc[curr.point.label] = (acc[curr.point.label] ?? 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const keys = Object.keys(labelCounts);
  return keys.reduce((acc, currentIdx) =>
  (
    labelCounts[currentIdx] > labelCounts[acc]
      ? currentIdx
      : acc
  ), keys[0]);
};
