import React, { useState, useEffect, HTMLProps } from 'react';
import styled from 'styled-components';

export type InfinitePlaneProps = {};

type ContainerStyleProps = {
  bgColor: string,
  dotColor: string,
  dotSize: number,
  dotSpace: number
};

const containerStyleProps: ContainerStyleProps = {
  bgColor: '#202b3c',
  dotColor: 'rgba(88, 88, 88, 0.85)',
  dotSize: 2,
  dotSpace: 22
};

const Wrapper = styled.div<ContainerStyleProps>`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /*
  @import url('https://fonts.googleapis.com/css?family=Ubuntu&display=swap');
  font-family: 'Ubuntu', sans-serif;
  height: 100vh;
  background:
		linear-gradient(90deg, ${p => p.bgColor} ${p => p.dotSpace - p.dotSize}px, transparent 1%) center,
		linear-gradient(${p => p.bgColor} ${p => p.dotSpace - p.dotSize}px, transparent 1%) center,
		${p => p.dotColor};
  background-size: ${p => p.dotSpace}px ${p => p.dotSpace}px;
  */
`;
const Plane = styled.div`
  position: relative;
  overflow: visible;
  width: 0;
  height: 0;
`;

export const InfinitePlane: React.SFC<InfinitePlaneProps> = (props) => {

  const [ isHover, setIsHover ] = useState(false);
  const [ isPointerDown, setIsPointerDown ] = useState(false);
  const [ xTranslation, setXTranslation ] = useState(0);
  const [ yTranslation, setYTranslation ] = useState(0);
  const [ zoom, setZoom ] = useState(1);
  const [ matrix, setMatrix ] = useState('matrix(1,0,0,1,0,0)');

  useEffect(() => {
    setMatrix(`matrix(${zoom}, 0, 0, ${zoom}, ${xTranslation}, ${yTranslation})`);
  }, [xTranslation, yTranslation, zoom]);

  const onPointerEnter = () => setIsHover(true);
  const onPointerLeave = () => setIsHover(false);
  const onPointerDown = () => setIsPointerDown(true);
  const onPointerUp = () => setIsPointerDown(false);
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey) {
      setZoom(zoom - (e.deltaY * 0.01));
    } else {
      setXTranslation(xTranslation - e.deltaX);
      setYTranslation(yTranslation - e.deltaY);
    }
  };

  return (
    <Wrapper /*style={{backgroundPosition: `${xTranslation}px ${yTranslation}px`}}*/ 
        {...containerStyleProps} 
        onPointerEnter={onPointerEnter} 
        onPointerLeave={onPointerLeave} 
        onPointerDown={onPointerDown} 
        onPointerUp={onPointerUp} 
        onWheel={onWheel}>
      <Plane style={{transform: matrix}}>{props.children}</Plane>
    </Wrapper>
  );
};

export default InfinitePlane;