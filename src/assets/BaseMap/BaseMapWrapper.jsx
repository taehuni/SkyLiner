import React, { useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import BaseMapContent from './BaseMapContent';
import BaseMapContent4k from './BaseMapContent4k';
import './BaseMap.css';

export default function BaseMapWrapper({ onNodeClick }) {
  const VIEWPORT_WIDTH = 1920;
  const MAP_WIDTH = 4000;
  const MAP_HEIGHT = 4000;
  const MAX_PAN_X = MAP_WIDTH - VIEWPORT_WIDTH;
  const MAX_PAN_Y = MAP_HEIGHT - VIEWPORT_WIDTH;
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [scale, setScale] = useState(0.7);
  const clickedNodeInfo = (nodeId) => {
    //console.log("BaseMap// Node Id:",nodeId.trim());
    if(onNodeClick){//부모 핸들러에 클릭된 ID 전탈
      onNodeClick(nodeId);
    }
  };
  const handleTransform = useCallback((ref) => {
    setPosX(ref.state.positionX);
    setPosY(ref.state.positionY);
    setScale(ref.state.scale);
  }, []);

  return (
    <>
      <TransformWrapper
        key="static-map-key"
        limitToBounds={false}
        paddingDisabled={true}
        disableBoundaryZoom={true}
        sensitivity={5}
        wheelAnimationSpeed={1}
        minScale={0.5}
        maxScale={5}
        //disableBoundaryZoom={true}
        // 예시: X축은 -1000px부터 +1000px까지만 이동 허용
        minPositionX={-MAX_PAN_X * scale}
        maxPositionX={0}
        // 예시: Y축은 -500px부터 +500px까지만 이동 허용
        minPositionY={-MAX_PAN_Y * scale}
        maxPositionY={0}
        positionX={posX}
        positionY={posY}
        scale={scale}
        //onPanningStop={handleTransform}
        onZoomStop={handleTransform}
      >
        <TransformComponent wrapperClass="no-padding">
          <BaseMapContent onNodeClick={clickedNodeInfo} draggable />
        </TransformComponent>
      </TransformWrapper>
    </>
  );
}