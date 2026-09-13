import type { TFunction } from 'i18next';
import partial from 'lodash-es/partial';
import type React from 'react';
import { withTranslation } from 'react-i18next';

import CropSquare from '@mui/icons-material/CropSquare';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import PanoramaFishEye from '@mui/icons-material/PanoramaFishEye';
import Place from '@mui/icons-material/Place';
import SelectAll from '@mui/icons-material/SelectAll';
import ShowChart from '@mui/icons-material/ShowChart';
import StarBorder from '@mui/icons-material/StarBorder';
import ZoomIn from '@mui/icons-material/ZoomIn';
import IconButton from '@mui/material/IconButton';
import type { SvgIconProps } from '@mui/material/SvgIcon';

import { Tool } from '~/components/map/tools';
import { TooltipWithContainerFromContext as Tooltip } from '~/containerContext';
import { type PreparedI18nKey, tt } from '~/i18n';
import ContentCut from '~/icons/ContentCut';
import EditFeature from '~/icons/EditFeature';

type ToolConfig = {
  tool: Tool;
  label: PreparedI18nKey;
  icon: React.ComponentType<SvgIconProps>;
};

type DrawingToolId =
  | 'add-marker'
  | 'add-waypoint'
  | 'cut-hole'
  | 'draw-circle'
  | 'draw-path'
  | 'draw-polygon'
  | 'draw-rectangle'
  | 'edit-feature'
  | 'select'
  | 'zoom';

const drawingToolRegistry: Record<DrawingToolId, ToolConfig> = {
  'add-marker': {
    tool: Tool.DRAW_POINT,
    label: tt('DrawingToolbar.addMarker'),
    icon: FiberManualRecord,
  },
  'add-waypoint': {
    tool: Tool.ADD_WAYPOINT,
    label: tt('DrawingToolbar.addWaypoint'),
    icon: Place,
  },
  'cut-hole': {
    tool: Tool.CUT_HOLE,
    label: tt('DrawingToolbar.cutHole'),
    icon: ContentCut,
  },
  'draw-circle': {
    tool: Tool.DRAW_CIRCLE,
    label: tt('DrawingToolbar.drawCircle'),
    icon: PanoramaFishEye,
  },
  'draw-path': {
    tool: Tool.DRAW_PATH,
    label: tt('DrawingToolbar.drawPath'),
    icon: ShowChart,
  },
  'draw-polygon': {
    tool: Tool.DRAW_POLYGON,
    label: tt('DrawingToolbar.drawPolygon'),
    icon: StarBorder,
  },
  'draw-rectangle': {
    tool: Tool.DRAW_RECTANGLE,
    label: tt('DrawingToolbar.drawRectangle'),
    icon: CropSquare,
  },
  'edit-feature': {
    tool: Tool.EDIT_FEATURE,
    label: tt('DrawingToolbar.editFeature'),
    icon: EditFeature,
  },
  select: {
    tool: Tool.SELECT,
    label: tt('general.action.select'),
    icon: SelectAll,
  },
  zoom: {
    tool: Tool.ZOOM,
    label: tt('general.geometry.zoom'),
    icon: ZoomIn,
  },
};

type DrawingToolIdGroup = DrawingToolId[];

type DrawingToolbarProps = {
  onToolSelected: (tool: Tool) => void;
  selectedTool: Tool;
  t: TFunction;
  /**
   * Groups of drawing tool IDs.
   */
  drawingTools: DrawingToolIdGroup[];
};

const DrawingToolbar = ({
  drawingTools,
  onToolSelected,
  selectedTool,
  t,
}: DrawingToolbarProps) => {
  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '8px' }}>
      {drawingTools
        .flatMap((group) => [
          <div key={`drawing-toolbar-group:${group.join(',')}`} style={{ height: '8px' }} />,
          ...group.map((toolId) => {
            const { tool, label, icon: Icon } = drawingToolRegistry[toolId];
            return (
              <Tooltip key={toolId} content={label(t)} placement='right'>
                <IconButton
                  size='medium'
                  onClick={partial(onToolSelected, tool)}
                  sx={{
                    backgroundColor: selectedTool === tool ? '#1a1b1e' : 'rgba(26, 27, 30, 0.88)',
                    color: selectedTool === tool ? '#d8f576' : 'rgba(255, 255, 255, 0.75)',
                    border: selectedTool === tool ? '2px solid #d8f576' : '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: selectedTool === tool ? '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 12px rgba(216, 245, 118, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      backgroundColor: selectedTool === tool ? '#22242a' : 'rgba(45, 50, 59, 0.95)',
                      color: selectedTool === tool ? '#d8f576' : '#fff',
                    },
                    width: 40,
                    height: 40,
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            );
          }),
        ])
        .slice(1)}
    </div>
  );
};

/**
 * Drawing toolbar on the map.
 */
const TranslatedDrawingToolbar = withTranslation()(DrawingToolbar);

export default TranslatedDrawingToolbar;
