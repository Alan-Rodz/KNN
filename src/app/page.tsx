'use client';

import { Button, Center, Input, Text } from '@chakra-ui/react';
import { PlotHoverEvent } from 'plotly.js';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

import { generateData, knn } from './math';
import { DataPoint, HyperParams } from './type';

// ********************************************************************************
// == Component ===================================================================
const LandingPageComponent: React.FC = () => {
  // -- State ---------------------------------------------------------------------
  const [clusterCount, setClusterCount] = useState(2);
  const [pointsPerCluster, setPointsPerCluster] = useState(20);
  const [clusterRadius, setClusterRadius] = useState(1.5);
  const [k, setK] = useState(3);

  const [params, setParams] = useState<HyperParams>({ clusterCount, pointsPerCluster, clusterRadius });
  const [data, setData] = useState(() => generateData(params));

  const [hoverData, setHoverData] = useState<DataPoint | null>(null);

  // -- Effect --------------------------------------------------------------------
  useEffect(() => {
    setParams({ clusterCount, pointsPerCluster, clusterRadius });
  }, [clusterCount, pointsPerCluster, clusterRadius]);

  useEffect(() => {
    setData(generateData(params));
  }, [params]);

  // -- Handler -------------------------------------------------------------------
  const handleHover = (event: Readonly<PlotHoverEvent>) => {
    if (event.points.length > 0) {
      const pointIndex = event.points[0].pointIndex;
      setHoverData(data.points[pointIndex]);
    } else {
      setHoverData(null);
    }
  };

  // -- UI ------------------------------------------------------------------------
  return (
    <Center flexDir='column' gap='1em' paddingY='3em'>
      <Text fontSize='2em' fontWeight='bold'>K-Nearest Neighbors</Text>
      <Center gap='3em'>
        <Center flexDir='column' gap='1em'>
          <Text fontWeight='bold' width='fit-content'>Número de clusters:</Text>
          <Center gap='1em'>
            <Button onClick={() => setClusterCount(Math.max(clusterCount - 1, 2))}>-</Button>
            <Input isDisabled={true} type='number' value={clusterCount} width='5em' />
            <Button onClick={() => setClusterCount(clusterCount + 1)}>+</Button>
          </Center>
        </Center>

        <Center flexDir='column' gap='1em'>
          <Text fontWeight='bold' width='fit-content'>Puntos por cluster:</Text>
          <Center gap='1em'>
            <Button onClick={() => setPointsPerCluster(Math.max(pointsPerCluster - 1, 2))}>-</Button>
            <Input isDisabled={true} type='number' value={pointsPerCluster} width='5em' />
            <Button onClick={() => setPointsPerCluster(pointsPerCluster + 1)}>+</Button>
          </Center>
        </Center>

        <Center flexDir='column' gap='1em'>
          <Text fontWeight='bold' width='fit-content'>Radio del cluster:</Text>

          <Center gap='1em'>
            <Button onClick={() => setClusterRadius(Math.max(clusterRadius - 0.1, 0.1))}>-</Button>
            <Input isDisabled={true} type='number' value={clusterRadius} width='5em' />
            <Button onClick={() => setClusterRadius(clusterRadius + 0.1)}>+</Button>
          </Center>
        </Center>
      </Center>

      <Center gap='1em'>
        <Text fontWeight='bold' width='fit-content'>Valor de K:</Text>
        <Button onClick={() => setK(Math.max(k - 1, 1))}>-</Button>
        <Input isDisabled={true} type='number' value={k} width='5em' />
        <Button onClick={() => setK(k + 1)}>+</Button>
      </Center>

      {
        hoverData && (
          <div>
            Punto seleccionado con el mouse: ({hoverData.x.toFixed(2)}, {hoverData.y.toFixed(2)}){' '}
            con etiqueta: {hoverData.label}
          </div>
        )}
      <div>Predicción en (3, 5): {knn(data.points, { x: 3, y: 5, label: 0 }, k)}</div>
      <Plot
        data={[
          {
            type: 'scatter',
            mode: 'markers',
            x: data.points.map((point) => point.x),
            y: data.points.map((point) => point.y),
            text: data.points.map((d) => d.label.toString()),
            marker: {
              color: data.points.map((point) => (data.labelColors[point.label]))
            },
            hoverinfo: 'text'
          }
        ]}
        layout={{ width: 600, height: 400 }}
        style={{ border: '1px solid black', borderRadius: '16px', padding: '2em' }}
        onHover={handleHover}
      />
    </Center>
  );
};


// == Export ======================================================================
export default LandingPageComponent;
