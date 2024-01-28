import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

function App() {
  const imgUrl = useMemo(() =>  [
    {
      id: '1',
      url: 'https://placehold.co/128'
    },
    {
      id: '2',
      url: 'https://placehold.co/128'
    },
    {
      id: '3',
      url: 'https://placehold.co/128'
    },
    {
      id: '4',
      url: 'https://placehold.co/128'
    },
    {
      id: '5',
      url: 'https://placehold.co/128'
    },
    {
      id: '6',
      url: 'https://placehold.co/128'
    },
    {
      id: '7',
      url: 'https://placehold.co/128'
    },
    {
      id: '8',
      url: 'https://placehold.co/128'
    },
    {
      id: '9',
      url: 'https://placehold.co/128'
    },
  ], [])

  const [selectedImages, setSelectedImages] = useState([]);

  const handleSelectImg = useCallback((index) => {
    const selectedImage = imgUrl[index];
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.some((item) => item.index === index)) {
        return prevSelectedImages.filter((item) => item.index !== index);
      } else {
        return [...prevSelectedImages, { index, selectedImage }];
      }
    });
  }, [imgUrl]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const numPadKey = event.code;

      switch (numPadKey) {
        case 'Numpad1':
        case 'Numpad2':
        case 'Numpad3':
        case 'Numpad4':
        case 'Numpad5':
        case 'Numpad6':
        case 'Numpad7':
        case 'Numpad8':
        case 'Numpad9':
          // eslint-disable-next-line no-case-declarations
          const index = parseInt(numPadKey.slice(-1)) - 1;
          handleSelectImg(index);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSelectImg]);

  console.log(selectedImages);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        {imgUrl.map((item, index) => (
          <button
            type='button'
            key={item.id}
            onClick={() => handleSelectImg(index)}
          >
            <img src={item.url} alt={`Image ${index + 1}`} data-index={index} />
          </button>
        ))}
      </div>
    </>
  );
}

export default App;
