// == Type ========================================================================
export type DataPoint = {
  x: number;
  y: number;
  label: number;
}

export type HyperParams = { clusterCount: number; pointsPerCluster: number; clusterRadius: number };
