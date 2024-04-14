'use client';

import { Button, Center, Input, Text } from '@chakra-ui/react';
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
    <Center flexDir='column' gap='1em' paddingY='3em'>
      <Text fontSize='2em' fontWeight='bold'>K-Nearest Neighbors</Text>
      <Text fontSize='1em' fontWeight='bold'>Equipo 1</Text>
      <Center gap='1em'>
        <Text width='fit-content'>Valor de K:</Text>
        <Button>-</Button>
        <Input isDisabled={true} type='number' value={k} />
        <Button>+</Button>
      </Center>
      {
        hoverData && (
          <div>
            Punto seleccionado con el mouse: ({hoverData.x.toFixed(2)}, {hoverData.y.toFixed(2)}){' '}
            con etiqueta: {hoverData.label}
          </div>
        )}
      <div>Predicción en (3, 5): {knn(data, { x: 3, y: 5, label: 0 }, k)}</div>
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
        layout={{ width: 600, height: 400 }}
        style={{ border: '1px solid black', borderRadius: '16px', padding: '1em' }}
        onHover={handleHover}
      />
    </Center>
  );
};


// == Export ======================================================================
export default LandingPageComponent;
