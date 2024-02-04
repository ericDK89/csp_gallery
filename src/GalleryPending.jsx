import { useEffect, useContext } from 'react';
import { getImages } from './api'
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { GalleryContext } from "./GalleryContext"
import { ImageComponent } from './ImageComponent';

const GalleryPending = () => {
  const {
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
  } = useContext(GalleryContext)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getImages();
        setProducts(response);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  useEffect(() => {
    window.addEventListener("keydown", handleSuperLikeKey);
    window.addEventListener("keyup", handleSuperLikeKey);

    return () => {
      window.removeEventListener("keydown", handleSuperLikeKey);
      window.removeEventListener("keyup", handleSuperLikeKey);
    };
  }, [handleSuperLikeKey]);

  useEffect(() => {
    if (products.length > 0 && currentProductIndex < products.length) {
      const newImages = products[currentProductIndex].images_url
        .slice(imageStartIndex, imageStartIndex + 9)
        .map(img => img.url);
      setDisplayedImages(newImages);
    }
  }, [currentProductIndex, products, imageStartIndex, setDisplayedImages]);

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
        const confirm_save = window.confirm('Deseja salvar as imagens selecionadas?');
        if (confirm_save === false) return;

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

  if (currentProductIndex >= products.length) {
    return (
      <>
        <Typography component='h6' variant='body1' sx={{ position: 'fixed', top: '10px', left: '10px' }}>CSP GALLERY</Typography>

        <Box sx={{ width: '100vw', textAlign: 'center' }}>
          <Typography component='p' variant='body1'>Acabaram os produtos, para voltar a página inicial clique no botão abaixo.</Typography>
          <Link to='/'>Retornar a página principal.</Link>
        </Box>
      </>
    )
  }

  return (
    <Box variant='page' sx={{ //! Alterar para Container variant='page'
      display: 'flex',
      justifyContent: 'center',
      gap: '5rem',
      flexDirection: 'row-reverse',
      margin: '0 auto',
      width: '100vw',
      height: '28rem',
    }}>

      <Typography component='h6' variant='body1' sx={{ position: 'fixed', top: '10px', left: '10px' }}>CSP GALLERY</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography component='p' variant='body1' sx={{ fontSize: '1.25rem' }}>Nome: {products[currentProductIndex]?.product_name || 'Nome do Produto'}</Typography>
          <Typography component='p' variant='body1' sx={{ fontSize: '1.25rem' }}>EAN: {products[currentProductIndex]?.ean || 'EAN'}</Typography>
          <Typography component='p' variant='body1' sx={{ fontSize: '1.25rem' }}>Categoria: {products[currentProductIndex]?.category_id}</Typography>
          <Typography component='p' variant='body1' sx={{ fontSize: '1.25rem' }}>Marca: {products[currentProductIndex]?.brand_id}</Typography>
          <Typography component='p' variant='body1' sx={{ fontSize: '1.25rem' }}>OEM: {products[currentProductIndex]?.oem}</Typography>
          <Typography component='p' variant='body1' sx={{ fontSize: '1.25rem' }}>Código de Fabricação: {products[currentProductIndex]?.manufacture_code}</Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: 'end',
          marginTop: '20px',
          gap: '20px'
        }}>
          <Button
            onClick={goToNextImages}
            sx={{
              padding: '10px',
              backgroundColor: 'orange',
            }}
          >
            Próximo
          </Button>

          <Button
            onClick={saveAndGoToNextProduct}
            sx={{
              padding: '10px',
              height: '100px',
              width: 'min-content',
              backgroundColor: 'orange',
            }}
          >
            Salvar
          </Button>
        </Box>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: 'gray'
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
      </Box>
    </Box>
  );
};

export default GalleryPending;
