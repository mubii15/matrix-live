const fs = require('fs');
const path = require('path');

const files = [
  'src/components/header/AlertButton.jsx',
  'src/components/header/AppSettingsButton.tsx',
  'src/components/header/AuthenticationButton.tsx',
  'src/components/header/BroadcastButton.jsx',
  'src/components/header/ConnectionStatusButton.tsx',
  'src/components/header/FullScreenButton.tsx',
  'src/components/header/HelpButton.tsx',
  'src/components/header/LightControlButton.tsx',
  'src/components/header/SafetyButton.tsx',
  'src/components/header/ServerConnectionSettingsButton.tsx',
  'src/components/header/ToolboxButton.tsx',
  'src/components/header/CommunicationChannelSwitch.tsx',
  'src/features/rtk/RTKStatusHeaderButton.tsx',
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // For files importing GenericHeaderButton and SidebarBadge together
  if (content.includes('GenericHeaderButton') && content.includes('SidebarBadge')) {
    content = content.replace(/import\s*\{\s*GenericHeaderButton,\s*SidebarBadge\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton from './GenericHeaderButton';\nimport SidebarBadge from './SidebarBadge';");
  } 
  
  // For files importing GenericHeaderButton and GenericHeaderButtonProps
  if (content.includes('GenericHeaderButton') && content.includes('GenericHeaderButtonProps')) {
    content = content.replace(/import\s*\{\s*GenericHeaderButton,\s*type GenericHeaderButtonProps,?\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton, { type GenericHeaderButtonProps } from '~/components/header/GenericHeaderButton';");
    content = content.replace(/import\s*\{\s*GenericHeaderButton,\s*type GenericHeaderButtonProps\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton, { type GenericHeaderButtonProps } from '~/components/header/GenericHeaderButton';");
  }
  
  // For simple GenericHeaderButton import
  content = content.replace(/import\s*\{\s*GenericHeaderButton\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton from '~/components/header/GenericHeaderButton';");

  // Fix any remaining multi-line imports
  content = content.replace(/import\s*\{\s*GenericHeaderButton,\s*type\s*GenericHeaderButtonProps,?\s*\}\s*from\s*'@skybrush\/mui-components';/ms, "import GenericHeaderButton, { type GenericHeaderButtonProps } from '~/components/header/GenericHeaderButton';");

  fs.writeFileSync(fullPath, content);
});
