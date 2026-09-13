import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import createColor from 'color';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';

import {
  setColorAndActivate,
  setColorAndUpdateServerIfActive,
} from '~/features/light-control/actions';
import { getCurrentColorInLightControlPanel } from '~/features/light-control/selectors';
import type { RootState } from '~/store/reducers';

type HSVA = {
  h: number;
  s: number;
  v: number;
  a: number;
};

const PRESET_SWATCHES = [
  '#000000',
  '#FF3B30',
  '#FF9500',
  '#FFCC00',
  '#34C759',
  '#5AC8FA',
  '#5856D6',
  '#FFFFFF',
];

const hsvToHex = (h: number, s: number, v: number, a: number): string => {
  const c = createColor.hsv(h, s, v);
  const rgb = c.rgb().array();
  const rHex = Math.round(rgb[0]).toString(16).padStart(2, '0');
  const gHex = Math.round(rgb[1]).toString(16).padStart(2, '0');
  const bHex = Math.round(rgb[2]).toString(16).padStart(2, '0');
  const aHex = Math.round(a * 255).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}${aHex}`.toUpperCase();
};

const parseHexToHsva = (hex: string): HSVA => {
  try {
    const clean = hex.replace('#', '');
    let r = 255;
    let g = 255;
    let b = 255;
    let a = 1;

    if (clean.length === 6 || clean.length === 3) {
      const parsed = createColor(hex);
      const rgb = parsed.rgb().array();
      r = rgb[0];
      g = rgb[1];
      b = rgb[2];
    } else if (clean.length === 8) {
      r = parseInt(clean.slice(0, 2), 16);
      g = parseInt(clean.slice(2, 4), 16);
      b = parseInt(clean.slice(4, 6), 16);
      a = parseInt(clean.slice(6, 8), 16) / 255;
    }

    const c = createColor.rgb(r, g, b);
    const hsv = c.hsv().object();
    return {
      h: hsv.h || 0,
      s: hsv.s || 0,
      v: hsv.v || 0,
      a,
    };
  } catch {
    return { h: 0, s: 100, v: 100, a: 1 };
  }
};

const isDarkSwatch = (hex: string): boolean => {
  const parsed = parseHexToHsva(hex);
  return parsed.v < 50;
};

type Props = {
  color: string;
  onSetColor: (color: string) => void;
  onSetColorAndActivate: (color: string) => void;
};

const LightControlGrid = ({
  color,
  onSetColor,
  onSetColorAndActivate,
}: Props) => {
  // Local HSV components to make sliding smooth
  const [localHue, setLocalHue] = useState(0);
  const [localSat, setLocalSat] = useState(100);
  const [localVal, setLocalVal] = useState(100);
  const [localAlpha, setLocalAlpha] = useState(1);

  // Other UI States
  const [pickerOpen, setPickerOpen] = useState(true);
  const [typedHex, setTypedHex] = useState(color);

  // Sync state with incoming color from redux (e.g. initial load, swatch select)
  useEffect(() => {
    const parsed = parseHexToHsva(color);
    setLocalHue(parsed.h);
    setLocalSat(parsed.s);
    setLocalVal(parsed.v);
    setLocalAlpha(parsed.a);
    setTypedHex(color);
  }, [color]);

  // Keep a ref to the current values to avoid stale closures in mouse move events
  const hsvaRef = useRef<HSVA>({ h: localHue, s: localSat, v: localVal, a: localAlpha });
  useEffect(() => {
    hsvaRef.current = { h: localHue, s: localSat, v: localVal, a: localAlpha };
  }, [localHue, localSat, localVal, localAlpha]);

  const handleSwatchClick = (swatchColor: string) => {
    onSetColorAndActivate(swatchColor);
  };

  const handleBrightnessChange = (brightnessVal: number) => {
    setLocalVal(brightnessVal);
    const { h, s, a } = hsvaRef.current;
    const newHex = hsvToHex(h, s, brightnessVal, a);
    onSetColorAndActivate(newHex);
  };

  // Drag Handlers
  const handleSaturationValuePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const update = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const s = Math.round(x * 100);
      const v = Math.round((1 - y) * 100);

      setLocalSat(s);
      setLocalVal(v);

      const { h, a } = hsvaRef.current;
      const newHex = hsvToHex(h, s, v, a);
      onSetColor(newHex);
    };

    update(e.clientX, e.clientY);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      update(moveEvent.clientX, moveEvent.clientY);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleHuePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const update = (clientX: number) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const h = Math.round(x * 360);

      setLocalHue(h);

      const { s, v, a } = hsvaRef.current;
      const newHex = hsvToHex(h, s, v, a);
      onSetColor(newHex);
    };

    update(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      update(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleAlphaPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const update = (clientX: number) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const a = Number(x.toFixed(2));

      setLocalAlpha(a);

      const { h, s, v } = hsvaRef.current;
      const newHex = hsvToHex(h, s, v, a);
      onSetColor(newHex);
    };

    update(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      update(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Hex Text input handler
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedHex(val);

    const reg = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
    if (reg.test(val)) {
      const normalized = val.startsWith('#') ? val : `#${val}`;
      onSetColor(normalized);
    }
  };

  // Determine current RGB background for opacity slider
  const rgbSolidHex = useMemo(() => {
    const c = createColor.hsv(localHue, localSat, localVal);
    return c.hex();
  }, [localHue, localSat, localVal]);

  return (
    <Box className='light-control-root'>
      {/* Top Row: Quick Brightness Controls */}
      <Box className='light-control-presets'>
        {[
          { label: 'ALL OFF', value: 0 },
          { label: '25%', value: 25 },
          { label: '50%', value: 50 },
          { label: 'ALL ON', value: 100 },
        ].map((btn) => {
          const isActive = Math.abs(localVal - btn.value) < 2;
          return (
            <Box
              key={btn.label}
              className={`light-control-preset-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleBrightnessChange(btn.value)}
            >
              {btn.label}
            </Box>
          );
        })}
      </Box>

      {/* Swatches Grid Row */}
      <Box className='light-control-swatches'>
        {PRESET_SWATCHES.map((swatchColor) => {
          const isSelected = color.toUpperCase().startsWith(swatchColor.toUpperCase());
          return (
            <Box
              key={swatchColor}
              className='light-control-swatch'
              style={{ backgroundColor: swatchColor }}
              onClick={() => handleSwatchClick(swatchColor)}
            >
              {isSelected && (
                <Box
                  className='light-control-swatch-selected-dot'
                  style={{
                    backgroundColor: isDarkSwatch(swatchColor) ? '#FFFFFF' : '#000000',
                  }}
                />
              )}
            </Box>
          );
        })}

        {/* Plus / Rainbow toggle */}
        <Box
          className={`light-control-swatch light-control-plus-swatch ${pickerOpen ? 'active' : ''}`}
          onClick={() => setPickerOpen(!pickerOpen)}
        >
          <AddIcon fontSize='small' />
        </Box>
      </Box>

      {/* Toggleable Saturation/Value, Hue, Alpha, and Hex picker fields */}
      {pickerOpen && (
        <Box className='light-control-picker'>
          {/* Saturation/Value field */}
          <Box
            className='light-control-sat-val-field'
            style={{ backgroundColor: `hsl(${localHue}, 100%, 50%)` }}
            onPointerDown={handleSaturationValuePointerDown}
          >
            <Box
              className='light-control-sat-val-handle'
              style={{
                left: `${localSat}%`,
                top: `${100 - localVal}%`,
              }}
            />
          </Box>

          {/* Sliders & Hex inputs */}
          <Box className='light-control-sliders-hex'>
            <Box className='light-control-sliders'>
              {/* Hue Slider */}
              <Box
                className='light-control-slider-wrapper light-control-hue-slider'
                onPointerDown={handleHuePointerDown}
              >
                <Box
                  className='light-control-slider-thumb'
                  style={{ left: `${(localHue / 360) * 100}%` }}
                />
              </Box>

              {/* Opacity Slider */}
              <Box
                className='light-control-opacity-checkerboard'
                onPointerDown={handleAlphaPointerDown}
              >
                <Box
                  className='light-control-opacity-overlay'
                  style={{
                    background: `linear-gradient(to right, rgba(0,0,0,0), ${rgbSolidHex})`,
                  }}
                />
                <Box
                  className='light-control-slider-thumb'
                  style={{ left: `${localAlpha * 100}%` }}
                />
              </Box>
            </Box>

            {/* Hex string input field */}
            <Box className='light-control-hex-container'>
              <input
                type='text'
                className='light-control-hex-input'
                value={typedHex}
                onChange={handleHexInputChange}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const ConnectedLightControlGrid = connect(
  // mapStateToProps
  (state: RootState) => ({
    color: getCurrentColorInLightControlPanel(state),
  }),
  // mapDispatchToProps
  {
    onSetColor: setColorAndUpdateServerIfActive,
    onSetColorAndActivate: setColorAndActivate,
  }
)(React.memo(LightControlGrid));

export default ConnectedLightControlGrid;
