import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { fromEvent, Subscription } from 'rxjs';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { infintePlaneTransformationMatrix, infinitePlaneOrignPosition, infintePlaneTransformation } from '../state/infinitePlaneState';
import { ICenterPoint, computeCenterPoint } from '../state/portsState';
import { filter } from 'rxjs/operators';
import { useObservable } from 'react-use';
import { editorEvents$, EditorEvents } from '../state/editorState';

export type InfinitePlaneProps = {};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -10;
`;
const Plane = styled.div`
  position: absolute;
  overflow: visible;
  width: 0;
  height: 0;
  top: 50%;
  left: 50%;
`;

export const InfinitePlane: React.FC<InfinitePlaneProps> = (props) => {

  const planeRef = useRef<HTMLDivElement>(null);
  const [ isHover, setIsHover ] = useState(false);
  const [ isPointerDown, setIsPointerDown ] = useState(false);
  const setOriginPosition = useSetRecoilState(infinitePlaneOrignPosition);
  const setTransformation = useSetRecoilState(infintePlaneTransformation);
  const transformationMatrix = useRecoilValue(infintePlaneTransformationMatrix);
  const editorEventReaarangeWindows = useObservable(useRecoilValue(editorEvents$)
    .pipe(filter<{event: String, time: number}>(({event}) => (event === EditorEvents.RearrangeWindows))));

  const onPointerEnter = () => setIsHover(true);
  const onPointerLeave = () => setIsHover(false);
  const onPointerDown = () => setIsPointerDown(true);
  const onPointerUp = () => setIsPointerDown(false);

  const onWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.ctrlKey) {
      setTransformation({ zoom: (e.deltaY * 0.005), delta: true });
    } else {
      setTransformation({ x: e.deltaX, y: e.deltaY, delta: true });
    }
  };

  useLayoutEffect(() => {
    const mouseMove$ = fromEvent<MouseEvent>(window, 'mousemove');
    let mouseMoveSubscription: Subscription = null;
    if (isPointerDown && planeRef?.current) {
      mouseMoveSubscription = mouseMove$.subscribe(e => {
        if (e.target === planeRef.current) {
          setTransformation({x: e.movementX, y: e.movementY, delta: true});
        }
      });
    }
    return () => {
      mouseMoveSubscription && mouseMoveSubscription.unsubscribe();
    }
  }, [isPointerDown, planeRef, transformationMatrix]);

  useEffect(() => {
    if (planeRef?.current) {
      const centerPoint: ICenterPoint = computeCenterPoint(planeRef.current.getBoundingClientRect());    
      setOriginPosition(centerPoint);
    }
  }, [planeRef, editorEventReaarangeWindows]);

  return (
    <Wrapper
        onPointerEnter={onPointerEnter} 
        onPointerLeave={onPointerLeave} 
        onPointerDown={onPointerDown} 
        onPointerUp={onPointerUp} 
        onWheel={onWheel}
        ref={planeRef}
      >
      <Plane style={{transform: transformationMatrix}}>{props.children}</Plane>
    </Wrapper>
  );
};

export default InfinitePlane;