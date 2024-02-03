import { useState, useEffect, useCallback } from 'react';
import { ImageComponent } from './ImageComponent';
import { getImages } from './api';

const GalleryComponent = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [imageStartIndex, setImageStartIndex] = useState(0);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [superLikes, setSuperLikes] = useState(new Map());
  const [isSuperLike, setIsSuperLike] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getImages()
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSuperLikeKey = useCallback((e) => {
    if (e.key === "'") {
      setIsSuperLike(e.type === "keydown");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleSuperLikeKey);
    window.addEventListener("keyup", handleSuperLikeKey);

    return () => {
      window.removeEventListener("keydown", handleSuperLikeKey);
      window.removeEventListener("keyup", handleSuperLikeKey);
    };
  }, [handleSuperLikeKey]);

  const onImageClick = (imageUrl) => {
    if (isSuperLike && selectedImages.has(imageUrl)) {
      setSuperLikes(prevSuperLikes => {
        const newSuperLikes = new Map(prevSuperLikes);
        if (newSuperLikes.has(imageUrl)) {
          newSuperLikes.delete(imageUrl);
        } else {
          newSuperLikes.set(imageUrl, true);
        }
        return newSuperLikes;
      });
    }

    setSelectedImages(prevSelectedImages => {
      const newSelectedImages = new Set(prevSelectedImages);
      if (newSelectedImages.has(imageUrl)) {
        newSelectedImages.delete(imageUrl);
      } else {
        newSelectedImages.add(imageUrl);
      }
      return newSelectedImages;
    });
  };

  useEffect(() => {
    if (products.length > 0 && currentProductIndex < products.length) {
      const newImages = products[currentProductIndex].images_url
        .slice(imageStartIndex, imageStartIndex + 9)
        .map(img => img.url);
      setDisplayedImages(newImages);
    }
  }, [currentProductIndex, products, imageStartIndex]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      const numPadMapping = {
        '7': 0, '8': 1, '9': 2,
        '4': 3, '5': 4, '6': 5,
        '1': 6, '2': 7, '3': 8
      };

      if (key in numPadMapping) {
        const imageIndex = numPadMapping[key];
        const imageUrl = displayedImages[imageIndex];
        if (imageUrl) {
          if (isSuperLike) {
            setSuperLikes(prevSuperLikes => {
              const newSuperLikes = new Map(prevSuperLikes);
              newSuperLikes.set(imageUrl, true);
              return newSuperLikes;
            });
          }

          setSelectedImages(prevSelectedImages => {
            const newSelectedImages = new Set(prevSelectedImages);
            if (newSelectedImages.has(imageUrl)) {
              newSelectedImages.delete(imageUrl);
            } else {
              newSelectedImages.add(imageUrl);
            }
            return newSelectedImages;
          });
        }
      }
      else if (key === '0') {
        const totalImages = products[currentProductIndex].images_url.length;
        const nextStartIndex = imageStartIndex + 9;

        if (nextStartIndex < totalImages) {
          setImageStartIndex(nextStartIndex);
        } else {
          alert('Não há mais imagens para este produto. Pressione Enter para continuar para o próximo produto.');
        }
      } else if (key === 'Enter') {
        saveSelectedImages();
        setCurrentProductIndex((prevIndex) => prevIndex + 1);
        setImageStartIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedImages, selectedImages, currentProductIndex, imageStartIndex, products, isSuperLike]);

  const goToNextImages = () => {
    const totalImages = products[currentProductIndex].images_url.length;
    const nextStartIndex = imageStartIndex + 9;

    if (nextStartIndex < totalImages) {
      setImageStartIndex(nextStartIndex);
    } else {
      alert('Não há mais imagens para este produto. Pressione Enter ou clique em Salvar para continuar para o próximo produto.');
    }
  };

  const saveAndGoToNextProduct = () => {
    saveSelectedImages();
    setCurrentProductIndex((prevIndex) => prevIndex + 1);
    setImageStartIndex(0);
  };


  const saveSelectedImages = () => {
    const imageInfo = Array.from(selectedImages).map(url => ({
      url,
      super_like: superLikes.get(url) || false
    }));

    const output = {
      ean: products[currentProductIndex].ean,
      category_id: products[currentProductIndex].category_id,
      brand_id: products[currentProductIndex].brand_id,
      product_name: products[currentProductIndex].product_name,
      oem: products[currentProductIndex].oem,
      manufacture_code: products[currentProductIndex].manufacture_code,
      images: imageInfo
    }

    console.log('Imagens Salvas:', output);
    setSelectedImages(new Set());
    setSuperLikes(new Map());
  };

  if (currentProductIndex >= products.length) {
    return <div>FIM</div>;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '3rem',
      flexDirection: 'row-reverse',
      margin: '0 auto',
      width: '100vw',
    }}>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '1.15rem' }}>
          <p>Nome: {products[currentProductIndex]?.product_name || 'Nome do Produto'}</p>
          <p>EAN: {products[currentProductIndex]?.ean || 'EAN'}</p>
          <p>Categoria: {products[currentProductIndex]?.category_id}</p>
          <p>Marca: {products[currentProductIndex]?.brand_id}</p>
          <p>OEM: {products[currentProductIndex]?.oem}</p>
          <p>Código de Fabricação: {products[currentProductIndex]?.manufacture_code}</p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'end',
          marginTop: '20px',
          gap: '20px'
        }}>
          <button
            onClick={goToNextImages}
            style={{
              padding: '10px',
            }}
          >
            Próximo
          </button>

          <button
            onClick={saveAndGoToNextProduct}
            style={{
              padding: '10px',
              height: '100px',
              width: 'min-content',
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem'
      }}>
        {displayedImages.map((imageUrl, index) => {
          const isSelected = selectedImages.has(imageUrl);
          const isSuperLiked = superLikes.get(imageUrl);

          return (
            <ImageComponent
              key={imageUrl}
              imageUrl={imageUrl}
              index={index}
              onImageClick={() => onImageClick(imageUrl)}
              isSuperLiked={isSuperLiked}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GalleryComponent;
