import { Alert, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

SwiperCore.use([Pagination]);
export default function Related({brand}) {
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const [slidesPerView, setSlidesPerView] = useState(2); // Default value for desktop
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    products: [],
    error: '',
    loading: true,
  });
 
  const { loading, error, products } = state;


 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`);
        setState({ products, loading: false });
      } catch (err) {
        setState({ loading: false, error: err.message });
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      // Check the screen width and set slidesPerView accordingly
      if (window.innerWidth <= 768) {
        // Mobile view
        setSlidesPerView(1);
      } else {
        // Laptop/Desktop view
        setSlidesPerView(4);
      }
    };

    // Initial check on component mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });
    enqueueSnackbar(`${product.name} added to the cart`, {
      variant: 'success',
    });
    router.push('/cart');
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
        
        
        <p className='text-3xl/none my-10 '>You May Also Like❤️</p>
        <Swiper slidesPerView={slidesPerView} spaceBetween={10} pagination={{ clickable: true }} style={{zIndex:'0'}}>
        
          
        {products
            .filter((product) => product.brand === brand) 
            .map((product,index) => (
              <SwiperSlide key={index}>
              <Grid item  key={product.slug}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                ></ProductItem>
              </Grid>
              </SwiperSlide>
            ))}
        
        </Swiper>
        
        
        </>
      )}
    </>
  );
}
