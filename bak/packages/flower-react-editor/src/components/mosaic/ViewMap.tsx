import React, {lazy} from "react";

export type View = {
  title: string,
  component: any
}


export const ViewMap: { [viewId: string]: View } = {
  emptyView: {
    title: 'Empty',
    component: () => (<div>empty</div>)
  },
  graphView: {
    title: 'Graph View',
    component: lazy(() => import('../GraphView'))
  }
};

