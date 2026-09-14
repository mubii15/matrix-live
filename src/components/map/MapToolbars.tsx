import Box from '@mui/material/Box';
import type React from 'react';


type MapToolbarsProps = Readonly<{
  left?: React.ReactChild;
  top?: React.ReactChild;
}>;

/**
 * Component that renders the toolbars of a map.
 */
const MapToolbars = ({ left, top }: MapToolbarsProps) => (
  <>
    {left && (
      <Box style={{ position: 'absolute', top: 156, left: 16, pointerEvents: 'none', zIndex: 1100 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', pointerEvents: 'auto' }}>{left}</Box>
      </Box>
    )}
    {top && (
      <Box
        key='Widget.TopToolbar'
        className='header-pill-container'
        style={{
          position: 'absolute',
          top: 16,
          left: 80,
          zIndex: 1100,
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {top}
      </Box>
    )}
  </>
);

export default MapToolbars;
