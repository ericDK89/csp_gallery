import { useEffect, useState } from "react";
import { api } from "./api";

function App() {
  const [requestedProducts, setRequestedProducts] = useState([]);
  const [imagesToShow, setImagesToShow] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [imagesToSave, setImagesToSave] = useState([]);

  // setRequestedProducts GET
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('list');
        setRequestedProducts(response.data);
      } catch (error) {
        console.log('message:', error.message);
      }
    };
    fetchData();
  }, []);

  // Function to update images to show based on array and item indices
  const updateImagesToShow = (arrayIdx, startItemIdx) => {
    if (requestedProducts.length > 0 && arrayIdx < requestedProducts.length) {
      setImagesToShow(requestedProducts[arrayIdx].images_url.slice(startItemIdx, startItemIdx + 9));
    }
  };

  // Jump to the next set of items in the same array
  const handleNextButton = () => {
    if (itemIndex + 9 < requestedProducts[arrayIndex].images_url.length) {
      setItemIndex(prevItemIndex => prevItemIndex + 9);
    } else {
      alert('Sem mais itens neste array');
    }
  };

  // Jump to the next array and display its first set of images
  const handleSaveImages = () => {
    // Save the current set of images
    setImagesToSave(prevImages => [...prevImages, ...imagesToShow]);
    setImagesToShow([]);

    // Move to the next array in the list
    if (arrayIndex + 1 < requestedProducts.length) {
      setArrayIndex(prevArrayIndex => prevArrayIndex + 1);
      setItemIndex(0);
      updateImagesToShow(arrayIndex + 1, 0);
    } else {
      alert('Sem mais arrays com imagens');
    }
  };

  useEffect(() => {
    updateImagesToShow(arrayIndex, itemIndex);
  }, [arrayIndex, itemIndex, requestedProducts]);

  return (
    <>
      <div>
        {imagesToShow.map(item => (
          <ul key={item.id}>
            <img src={item.url} alt={item.url} />
          </ul>
        ))}

        <button type="button" onClick={handleNextButton}>
          Próximo
        </button>
        <button type="button" onClick={handleSaveImages}>
          Salvar
        </button>
      </div>
    </>
  );
}

export default App;
