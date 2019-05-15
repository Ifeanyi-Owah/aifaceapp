import React from 'react';
import './FaceRecognitionImage.css';

const FaceRecognitionImage = ({imageUrl, faceLocation}) => {
    return (
      <div className="center ma"> 
          <div className="absolute mt2">
            <img id="inputImageUrl" src={imageUrl}  alt='' width="500px" height="auto"/>
            <div className="bounding-box" style={{top: faceLocation.topRow, right: faceLocation.rightCol, bottom:faceLocation.bottomRow,left:faceLocation.leftCol }}></div>
          </div>
         
      </div>
    );
}



export default FaceRecognitionImage;