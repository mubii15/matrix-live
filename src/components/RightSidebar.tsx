import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LayersIcon from '@mui/icons-material/Layers';
import PlaceIcon from '@mui/icons-material/Place';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useState } from 'react';

import views from '~/views';

type SidebarTab = {
  id: string;
  label: string;
  icon: React.ElementType;
  Component: React.ComponentType<any>;
};

const tabs: SidebarTab[] = [
  { id: 'location', label: 'Locations', icon: PlaceIcon, Component: views.SavedLocationList },
  { id: 'layers', label: 'Layers', icon: LayersIcon, Component: views.LayerList },
  { id: 'features', label: 'Features', icon: CategoryIcon, Component: views.FeaturePanel },
  { id: 'lights', label: 'Lights', icon: LightbulbIcon, Component: views.LightControlPanel },
];

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const activeTabConfig = tabs.find((t) => t.id === activeTab);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Sliding Content Drawer */}
      <Paper
        elevation={6}
        sx={{
          width: activeTab ? 340 : 0,
          mt: '230px',
          maxHeight: 'calc(100vh - 300px)',
          height: 'fit-content',
          opacity: activeTab ? 1 : 0,
          visibility: activeTab ? 'visible' : 'hidden',
          transition: 'width 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: activeTab ? 'translateX(0)' : 'translateX(16px)',
          backgroundColor: '#1a1b1e !important',
          color: '#fff !important',
          borderRadius: '16px',
          border: activeTab ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: activeTab ? 'auto' : 'none',
          overflow: 'hidden',
          mr: 1,
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            color: '#fff',
          },
          '& .MuiList-root': {
            backgroundColor: 'transparent',
          },
          '& .MuiListItem-root, & .MuiListItemButton-root': {
            color: '#fff',
          },
          '& .MuiTypography-root': {
            color: 'inherit',
          },
          '& .MuiSvgIcon-root': {
            color: 'inherit',
          },
        }}
      >
        {activeTabConfig && (
          <>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <activeTabConfig.icon sx={{ fontSize: 20, color: '#d8f576' }} />
                <Typography variant='subtitle1' sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {activeTabConfig.label}
                </Typography>
              </Box>
              <IconButton
                size='small'
                onClick={() => setActiveTab(null)}
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'rotate(90deg) scale(1.1)',
                  },
                  '&:active': {
                    transform: 'rotate(90deg) scale(0.9)',
                  },
                }}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </Box>

            {/* Panel Content */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 1.5,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(216, 245, 118, 0.4)',
                  },
                },
              }}
            >
              {tabs.map(
                (tab) =>
                  activeTab === tab.id && (
                    <Box
                      key={tab.id}
                      sx={{
                        height: '100%',
                        animation: 'sidebarTabFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        '@keyframes sidebarTabFadeIn': {
                          from: { opacity: 0, transform: 'translateY(4px)' },
                          to: { opacity: 1, transform: 'translateY(0)' },
                        },
                      }}
                    >
                      {/* @ts-ignore */}
                      <tab.Component />
                    </Box>
                  )
              )}
            </Box>
          </>
        )}
      </Paper>

      {/* Blender-style Vertical Tab Strip (Slimmer & Theme Matched) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          mt: '230px',
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <Tooltip key={tab.id} title={tab.label} placement='left' arrow>
              <Box
                onClick={() => setActiveTab(isActive ? null : tab.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  padding: '8px 3px',
                  backgroundColor: isActive ? '#262930' : 'rgba(26, 27, 30, 0.88)',
                  color: isActive ? '#d8f576' : 'rgba(255, 255, 255, 0.65)',
                  cursor: 'pointer',
                  borderRadius: '6px 0 0 6px',
                  borderLeft: isActive ? '2px solid #d8f576' : '2px solid transparent',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  userSelect: 'none',
                  boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.45), 0 0 8px rgba(216, 245, 118, 0.2)' : 'none',
                  transition: 'background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, border-left-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive ? '#2e323b' : 'rgba(45, 48, 56, 0.95)',
                    color: isActive ? '#d8f576' : '#fff',
                    borderLeftColor: '#d8f576',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 10px rgba(216, 245, 118, 0.2)',
                    '& .tab-icon': {
                      color: '#d8f576',
                      transform: 'scale(1.15)',
                    },
                  },
                  '&:active': {
                    backgroundColor: '#353942',
                    transitionDuration: '0.08s',
                  },
                }}
              >
                <Icon
                  className='tab-icon'
                  sx={{
                    fontSize: 14,
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '0.67rem',
                    fontWeight: isActive ? 600 : 500,
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    letterSpacing: '0px',
                    lineHeight: 1,
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default RightSidebar;

