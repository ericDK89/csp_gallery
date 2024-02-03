import { createContext, useCallback, useState } from "react";

const GalleryContext = createContext();

// eslint-disable-next-line react/prop-types
const GalleryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [imageStartIndex, setImageStartIndex] = useState(0);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [superLikes, setSuperLikes] = useState(new Map());
  const [isSuperLike, setIsSuperLike] = useState(false);


  const handleSuperLikeKey = useCallback((e) => {
    if (e.key === "'") {
      setIsSuperLike(e.type === "keydown");
    }
  }, []);

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

  return (
    <GalleryContext.Provider
      value={{
        setProducts,
        products,
        handleSuperLikeKey,
        currentProductIndex,
        imageStartIndex,
        setDisplayedImages,
        displayedImages,
        isSuperLike,
        setSuperLikes,
        setSelectedImages,
        setImageStartIndex,
        saveSelectedImages,
        setCurrentProductIndex,
        selectedImages,
        goToNextImages,
        saveAndGoToNextProduct,
        superLikes,
        onImageClick
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export { GalleryProvider, GalleryContext };
