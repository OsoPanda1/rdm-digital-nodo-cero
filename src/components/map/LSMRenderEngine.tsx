import { useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import { useWebSocketSubscription } from '../../hooks/useWebSocket';

interface LSMRenderProps {
  capaActiva: 'turismo' | 'economia' | 'plateria' | 'movilidad';
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
}

interface LSMNodeEvent {
  capa: LSMRenderProps['capaActiva'];
  data: {
    id: string;
    lat: number;
    lng: number;
    intensidadSaturacion?: number;
    ofertaActiva?: boolean;
  };
}

export const LSMRenderEngine = ({ capaActiva, initialViewState }: LSMRenderProps) => {
  const [nodosLSM, setNodosLSM] = useState<LSMNodeEvent['data'][]>([]);
  const lastEvent = useWebSocketSubscription<LSMNodeEvent>('LSM_REALTIME_STREAM');

  useEffect(() => {
    if (lastEvent && lastEvent.capa === capaActiva) {
      setNodosLSM((prev) => [...prev.filter((n) => n.id !== lastEvent.data.id), lastEvent.data]);
    }
  }, [lastEvent, capaActiva]);

  const layers = useMemo(
    () => [
      new HeatmapLayer({
        id: 'lsm-saturacion-heatmap',
        data: capaActiva === 'movilidad' ? nodosLSM : [],
        getPosition: (d: LSMNodeEvent['data']) => [d.lng, d.lat],
        getWeight: (d: LSMNodeEvent['data']) => d.intensidadSaturacion ?? 0,
        radiusPixels: 50,
        intensity: 2,
        threshold: 0.1,
      }),
      new ScatterplotLayer({
        id: 'lsm-economia-nodos',
        data: capaActiva === 'economia' ? nodosLSM : [],
        getPosition: (d: LSMNodeEvent['data']) => [d.lng, d.lat],
        getFillColor: (d: LSMNodeEvent['data']) =>
          d.ofertaActiva ? [255, 215, 0, 200] : [100, 100, 100, 150],
        getRadius: (d: LSMNodeEvent['data']) => (d.ofertaActiva ? 30 : 10),
        radiusMinPixels: 5,
        pickable: true,
        onClick: (info) => console.log('Nodo Económico Seleccionado:', info.object),
      }),
    ],
    [nodosLSM, capaActiva],
  );

  return (
    <DeckGL initialViewState={initialViewState} controller layers={layers}>
      <Map
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      />
    </DeckGL>
  );
};
