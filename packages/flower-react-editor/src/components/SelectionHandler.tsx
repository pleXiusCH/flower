import React, { Fragment, useEffect } from 'react';
import { Graph } from '@plexius/flower-core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedPorts, PortStateInt, selectedPortIds } from './../state/portsState';

export const SelectionHandler = (props: {graph: Graph}) => {
  const [ _selectedPortIds, setSelectedPortIds]: [string[], (ids: string[]) => void] = useRecoilState(selectedPortIds);
  const _selectedPorts: PortStateInt[] = useRecoilValue(selectedPorts);

  useEffect(() => {
    const inputPorts = _selectedPorts.filter(port => port.descriptor.type === 'input');
    const outputPort = _selectedPorts.find(port => port.descriptor.type === 'output');

    if (inputPorts.length > 0 && outputPort) {
      const connectedPortIds = inputPorts.map(inputPort => {
        props.graph.createEdge(outputPort.descriptor, inputPort.descriptor);
        return inputPort.id;
      });
      connectedPortIds.push(outputPort.id);
  
      const newSelectedPortIds = _selectedPortIds.filter(port => !connectedPortIds.includes(port));
      if(JSON.stringify(_selectedPortIds) !== JSON.stringify(newSelectedPortIds)) {
        setSelectedPortIds(newSelectedPortIds);
      }
  
    }
  }, [_selectedPorts, props.graph]);

  return <Fragment />
}

export default SelectionHandler;