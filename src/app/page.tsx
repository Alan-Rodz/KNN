'use client';

import { Box, Button, Center, Input, Text } from '@chakra-ui/react';
import { BarController, BarElement, CategoryScale, ChartData, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, ScatterController, Tooltip } from 'chart.js';
import { ChangeEvent, useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import { classifyUsingKNN, generateData, regressionUsingKNN } from './math';
import { DataPoint } from './type';
import { useIsMdOrBigger } from './useIsMdOrBigger';

// ********************************************************************************
// == Constant ====================================================================
ChartJS.register(BarController, BarElement, CategoryScale, Legend, LineController, LinearScale, LineElement, PointElement, ScatterController, Tooltip);

const MAX_CLUSTER_COUNT = 10;
const MIN_CLUSTER_COUNT = 2;

const MAX_POINTS_PER_CLUSTER = 200;
const MIN_POINTS_PER_CLUSTER = 2;

const MAX_CLUSTER_RADIUS = 10;
const MIN_CLUSTER_RADIUS = 0.1;

// == Component ===================================================================
const LandingPageComponent: React.FC = () => {
  const isMdOrBigger = useIsMdOrBigger();

  // -- State ---------------------------------------------------------------------
  const [clusterCount, setClusterCount] = useState(2);
  const [pointsPerCluster, setPointsPerCluster] = useState(20);
  const [clusterRadius, setClusterRadius] = useState(1.5);
  const [k, setK] = useState(3);
  const [data, setData] = useState(() => generateData({ clusterCount, pointsPerCluster, clusterRadius }));

  const [mode, setMode] = useState<'classification' | 'regression'>('classification');

  const [clickedPoint, setClickedPoint] = useState<DataPoint>({ label: 0, x: 0, y: 0 });

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
    datasets: [...data.labels.map((label, idx) => ({
      backgroundColor: data.labelColors[idx],
      borderColor: data.labelColors[idx],
      borderWidth: 1,
      data: data.points.filter((point) => point.label === label).map((point) => ({ x: point.x, y: point.y })),
      label: `Cluster ${label}`,
    })),
    {
      backgroundColor: data.labelColors[clickedPoint.label],
      borderColor: data.labelColors[clickedPoint.label],
      borderWidth: 1,
      data: [clickedPoint],
      label: 'Punto clasificado',
    }]
  };
  return (
    <Center flexDir='column' gap='1em' paddingY='3em'>
      <Text fontSize='2em' fontWeight='bold'>K-Nearest Neighbors</Text>
      <Center>
        <Button onClick={() => setMode('classification')}>Clasificación</Button>
        <Button onClick={() => setMode('regression')}>Regresión</Button>
      </Center>
      <Center flexDir={isMdOrBigger ? 'row' : 'column'} gap='3em'>
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
        <Input onChange={(e) => setK(Math.max(k - 1, Number(e.target.value)))} type='number' value={k} width='5em' />
        <Button onClick={() => setK(k + 1)}>+</Button>
      </Center>

      <Box height={isMdOrBigger ? '450px' : '350px'} width={isMdOrBigger ? '500px' : '300px'}>
        <Chart
          data={shownData}
          options={{
            onClick: (event, elements, chart) => {
              const dataX = chart.scales.x.getValueForPixel(event.x ?? 0);
              const dataY = chart.scales.y.getValueForPixel(event.y ?? 0);
              if (!dataX || !dataY) return/*cannot continue*/;

              const label = mode === 'classification'
                ? classifyUsingKNN(data.points, { label: 0, x: dataX, y: dataY }, k)
                : regressionUsingKNN(data.points, { label: 0, x: dataX, y: dataY }, k);
              setClickedPoint({ label, x: dataX, y: dataY });
            }
          }}
          type='scatter'
        />
      </Box>
    </Center>
  );
};


// == Export ======================================================================
export default LandingPageComponent;
