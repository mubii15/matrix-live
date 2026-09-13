import { type PerspectiveName, type PerspectiveObject } from 'perspective';

/* Object holding well-known panel layouts that may potentially be used in
 * multiple configuration files. Perspective configurations may refer to these
 * by their names only */
const commonLayouts: Record<PerspectiveName, PerspectiveObject> = {
  default: {
    label: 'Default',
    hideHeaders: true,
    layout: {
      type: 'stack',
      contents: [
        {
          type: 'panel',
          component: 'map',
          id: 'map',
        },
      ],
    },
  },
};

export default commonLayouts;
