import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import GenericHeaderButton from '~/components/header/GenericHeaderButton';
import workbench from '~/workbench';

const Toggle3DViewButton = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsActive(Boolean((workbench as any).hasComponent && (workbench as any).hasComponent('three-d-view')));

    const onStateChanged = () => {
      if ((workbench as any).hasComponent) {
        setIsActive(Boolean(((workbench as any).hasComponent as (id: string) => boolean)('three-d-view')));
      }
    };

    workbench.on('stateChanged', onStateChanged);
    return () => {
      workbench.off('stateChanged', onStateChanged);
    };
  }, []);

  const handleToggle = () => {
    if ((workbench as any).toggleComponent) {
      ((workbench as any).toggleComponent as (id: string) => void)('three-d-view');
    } else {
      console.warn('workbench.toggleComponent is not available');
    }
  };

  return (
    <GenericHeaderButton
      style={{ color: isActive ? '#007bff' : undefined }}
      tooltip='Toggle 3D View'
      onClick={handleToggle}
    >
      <ThreeDRotation />
    </GenericHeaderButton>
  );
};

export default connect()(Toggle3DViewButton);
