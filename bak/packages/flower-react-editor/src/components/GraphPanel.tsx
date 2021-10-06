import React from "react";
import {Col, Row, TreeSelect} from "antd";
import {useRecoilValue} from "recoil";
import {INodeImpl} from "@plexius/flower-interfaces";
import {implementations} from "../state/editorState";


const {TreeNode} = TreeSelect;

interface GraphPanelProps {
  addNode: (nodeType: string) => void
}

const GraphPanel = (props: GraphPanelProps) => {

  const implementationsState: INodeImpl[] = useRecoilValue(implementations);

  const {addNode} = props;

  const onChange = (nodeType: string) => {
    if (nodeType.indexOf('_') === 0) return;
    addNode(nodeType);
  };

  return (<Row>
    <Col>
      <TreeSelect
          showSearch
          value={undefined}
          style={{width: '100%', minWidth: 320}}
          dropdownStyle={{maxHeight: 600, overflow: 'auto'}}
          placeholder="Add new Node"
          allowClear
          treeDefaultExpandAll
          onChange={onChange}
      >
        <TreeNode value="_Nodes" title="Nodes">
          <TreeNode value="_Mathematics" title="Mathematics">
            {implementationsState.map((implementation, index) => (
                <TreeNode key={implementation.type} value={implementation.type}
                          title={`${implementation.type}`}/>
            ))}
          </TreeNode>
        </TreeNode>
        <TreeNode value="_Paths" title="Paths">

        </TreeNode>

      </TreeSelect>
    </Col>
  </Row>);

};

export default GraphPanel;