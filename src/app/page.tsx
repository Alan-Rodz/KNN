'use client';

import { Box, Button, Center, Input, Text } from '@chakra-ui/react';
import { BarController, BarElement, CategoryScale, ChartData, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import { ChangeEvent, useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import { generateData } from './math';

// ********************************************************************************
// == Constant ====================================================================
ChartJS.register(BarController, BarElement, CategoryScale, Legend, LineController, LinearScale, LineElement, PointElement, Tooltip);

const MAX_CLUSTER_COUNT = 10;
const MIN_CLUSTER_COUNT = 2;

const MAX_POINTS_PER_CLUSTER = 200;
const MIN_POINTS_PER_CLUSTER = 2;

const MAX_CLUSTER_RADIUS = 10;
const MIN_CLUSTER_RADIUS = 0.1;

// == Component ===================================================================
const LandingPageComponent: React.FC = () => {
  // -- State ---------------------------------------------------------------------
  const [clusterCount, setClusterCount] = useState(2);
  const [pointsPerCluster, setPointsPerCluster] = useState(20);
  const [clusterRadius, setClusterRadius] = useState(1.5);
  const [k, setK] = useState(3);
  const [data, setData] = useState(() => generateData({ clusterCount, pointsPerCluster, clusterRadius }));

  // -- Effect --------------------------------------------------------------------
  useEffect(() => {
    setData(generateData({ clusterCount, pointsPerCluster, clusterRadius }));
  }, [clusterCount, pointsPerCluster, clusterRadius]);

  // -- Handler -------------------------------------------------------------------
  const handleClusterCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value > MAX_CLUSTER_COUNT) { value = MAX_CLUSTER_COUNT; }
    else if (value < MIN_CLUSTER_COUNT) { value = MIN_CLUSTER_COUNT; }
    setClusterCount(value);
  };

  const handlePointsPerClusterChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value > MAX_POINTS_PER_CLUSTER) { value = MAX_POINTS_PER_CLUSTER; }
    else if (value < MIN_POINTS_PER_CLUSTER) { value = MIN_POINTS_PER_CLUSTER; }
    setPointsPerCluster(value);
  };

  const handleClusterRadiusChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value > MAX_CLUSTER_RADIUS) { value = MAX_CLUSTER_RADIUS; }
    else if (value < MIN_CLUSTER_RADIUS) { value = MIN_CLUSTER_RADIUS; }
    setClusterRadius(value);
  };

  // -- UI ------------------------------------------------------------------------
  const shownData: ChartData = {
    datasets: data.labels.map((label, idx) => ({
      backgroundColor: data.labelColors[idx],
      borderColor: data.labelColors[idx],
      borderWidth: 1,
      data: data.points.filter((point) => point.label === label).map((point) => ({ x: point.x, y: point.y })),
      label: `Cluster ${label}`,
    }))
  };
  return (
    <Center flexDir='column' gap='1em' paddingY='3em'>
      <Text fontSize='2em' fontWeight='bold'>K-Nearest Neighbors</Text>
      <Center gap='3em'>
        <Center flexDir='column' gap='1em'>
          <Text fontWeight='bold' width='fit-content'>Número de clusters:</Text>
          <Center gap='1em'>
            <Button onClick={() => setClusterCount(Math.max(clusterCount - 1, 2))}>-</Button>
            <Input onChange={(e) => handleClusterCountChange(e)} type='number' value={clusterCount} width='5em' />
            <Button onClick={() => setClusterCount(clusterCount + 1)}>+</Button>
          </Center>
        </Center>

        <Center flexDir='column' gap='1em'>
          <Text fontWeight='bold' width='fit-content'>Puntos por cluster:</Text>
          <Center gap='1em'>
            <Button onClick={() => setPointsPerCluster(Math.max(pointsPerCluster - 1, 2))}>-</Button>
            <Input onChange={(e) => handlePointsPerClusterChange(e)} type='number' value={pointsPerCluster} width='5em' />
            <Button onClick={() => setPointsPerCluster(pointsPerCluster + 1)}>+</Button>
          </Center>
        </Center>

        <Center flexDir='column' gap='1em'>
          <Text fontWeight='bold' width='fit-content'>Radio del cluster:</Text>

          <Center gap='1em'>
            <Button onClick={() => setClusterRadius(Math.max(clusterRadius - 0.1, 0.1))}>-</Button>
            <Input onChange={(e) => handleClusterRadiusChange(e)} type='number' value={clusterRadius} width='5em' />
            <Button onClick={() => setClusterRadius(clusterRadius + 0.1)}>+</Button>
          </Center>
        </Center>
      </Center>

      <Center gap='1em'>
        <Text fontWeight='bold' width='fit-content'>Valor de K:</Text>
        <Button onClick={() => setK(Math.max(k - 1, 1))}>-</Button>
        <Input type='number' value={k} width='5em' />
        <Button onClick={() => setK(k + 1)}>+</Button>
      </Center>

      <Box height='500px' width='600px'>
        <Chart
          data={shownData}
          height={400}
          width={400}
          type='scatter'
        />
      </Box>
    </Center>
  );
};


// == Export ======================================================================
export default LandingPageComponent;
