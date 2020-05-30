import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Col, Row, Typography} from 'antd';
import {INodeImpl} from '@plexius/flower-interfaces';
import {Header} from "../atoms/Header";
import {ViewMap} from "./ViewMap";

const {Title} = Typography;

type View = {
  title: string,
  component: any
}



const colStyle = {
  alignItems: 'flex-end',
  display: 'flex',
  cursor: 'pointer'
};

const ViewSelector = (props: any) => {
  const {viewState, setViewState} = props;

  const mapKeys = Object.keys(ViewMap);
  return (
      <Header>
        <Row gutter={8}>
          {mapKeys.map(mapKey => (
              <Col key={mapKey} style={colStyle} span={Math.max(6,Math.floor(24 / (mapKeys.length || 1)))}>
                <span onClick={() => setViewState({...viewState, selectedView: mapKey})}>
                  <Title level={viewState.selectedView === mapKey ? 2:3}>{ViewMap[mapKey].title}</Title>
                </span>
              </Col>
          ))}

        </Row>
      </Header>
  );
};


export default ViewSelector;