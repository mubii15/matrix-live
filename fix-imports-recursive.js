const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(process.cwd(), 'src'), function(filePath) {
  if (!filePath.match(/\.(tsx|jsx|ts|js)$/)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace GenericHeaderButton and SidebarBadge imports from @skybrush/mui-components
  
  if (content.includes('GenericHeaderButton') || content.includes('SidebarBadge')) {
    // Both GenericHeaderButton and SidebarBadge
    content = content.replace(/import\s*\{\s*GenericHeaderButton,\s*SidebarBadge(,\s*Tooltip)?\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton from '~/components/header/GenericHeaderButton';\nimport SidebarBadge from '~/components/header/SidebarBadge';");
    content = content.replace(/import\s*\{\s*GenericHeaderButton,\s*LazyTooltip(,\s*SidebarBadge)?\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton from '~/components/header/GenericHeaderButton';\nimport { LazyTooltip } from '@skybrush/mui-components';");
    
    // Just GenericHeaderButton
    content = content.replace(/import\s*\{\s*GenericHeaderButton\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton from '~/components/header/GenericHeaderButton';");

    // GenericHeaderButton with props
    content = content.replace(/import\s*\{\s*GenericHeaderButton,\s*type GenericHeaderButtonProps,?\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import GenericHeaderButton, { type GenericHeaderButtonProps } from '~/components/header/GenericHeaderButton';");

    // SidebarBadge alone
    content = content.replace(/import\s*\{\s*SidebarBadge\s*\}\s*from\s*'@skybrush\/mui-components';/g, "import SidebarBadge from '~/components/header/SidebarBadge';");

    // Fix remaining where GenericHeaderButton or SidebarBadge are mixed with others
    // E.g., import { GenericHeaderButton, Tooltip } from ...
    if (content.includes('GenericHeaderButton') && content.includes('@skybrush/mui-components') && !content.includes('~/components/header/GenericHeaderButton')) {
       // this regex will replace GenericHeaderButton in the destructured import and add the new import below
       content = content.replace(/GenericHeaderButton,?\s*/, "");
       content = content.replace(/(import\s*\{[^}]*\}\s*from\s*'@skybrush\/mui-components';)/g, "import GenericHeaderButton from '~/components/header/GenericHeaderButton';\n$1");
    }

    if (content.includes('SidebarBadge') && content.includes('@skybrush/mui-components') && !content.includes('~/components/header/SidebarBadge')) {
       // this regex will replace SidebarBadge in the destructured import and add the new import below
       content = content.replace(/SidebarBadge,?\s*/, "");
       content = content.replace(/(import\s*\{[^}]*\}\s*from\s*'@skybrush\/mui-components';)/g, "import SidebarBadge from '~/components/header/SidebarBadge';\n$1");
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);
  }
});
