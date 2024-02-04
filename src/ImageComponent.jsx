import { Box, Typography } from "@mui/material";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export const ImageComponent = ({ imageUrl, index, onImageClick, isSelected, isSuperLiked }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const numPadMapping = {
    0: '7', 1: '8', 2: '9',
    3: '4', 4: '5', 5: '6',
    6: '1', 7: '2', 8: '3'
  };

  return (
    <Box sx={{
      position: 'relative',
      cursor: 'pointer',
      overflow: 'hidden',
      width: '128px',
      height: '128px',
      transition: 'transform 0.3s ease, z-index 0s',
      transform: isHovered ? 'scale(2.5)' : 'scale(1)',
      zIndex: isHovered ? 2 : 1,
      boxShadow: isSelected ? `0px 0px 10px 5px ${isSuperLiked ? 'blue' : 'green'}` : 'none',
    }}
      onClick={() => onImageClick(imageUrl)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={imageUrl}
        alt={`Imagem ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {isHovered && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          fontSize: '0.3rem',
          padding: '5px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {imageUrl}
        </Box>
      )}
      <Typography component='span' sx={{
        position: 'absolute',
        top: '0',
        right: '0',
        fontWeight: 'bold',
        backgroundColor: 'none',
        color: '#000',
        padding: '2px',
        borderRadius: '50%',
        fontSize: '1rem'
      }}>
        {numPadMapping[index]}
      </Typography>
    </Box>
  );
};
