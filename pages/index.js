import { Alert, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';
import HeroBanner from '../components/HeroBanner';
import FooterBanner from '../components/FooterBanner';
import Link from 'next/link';
import SwiperProduct from '../components/SwiperProduct';

export default function Home() {
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [Banner,setBanner]=useState(null);
  const [brands,setBrand]=useState(['boat','samsung','apple','sony','ptron','jbl','zebronics','bose','oneplus','realme']);
  const [state, setState] = useState({
    products: [],
    error: '',
    loading: true,
  });
 
  const { loading, error, products } = state;

  useEffect(() => {
    const BannerData = async () => {
      try {
        const bannerQuery = '*[_type == "banner"]';
        const bannerData = await client.fetch(bannerQuery);
        setBanner(bannerData)
      } catch (err) {
        //setState({ loading: false, error: err.message });
      }
    };
    BannerData();
  }, []);
 

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
        _id: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image[0]),
        quantity,
      },
    });
    enqueueSnackbar(`${product.name} added to the cart`, {
      variant: 'success',
    });
    router.push('/cart');
  };

  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
        {Banner && (<HeroBanner heroBanner={Banner[0]}  />) }
        {brands.map((brand) => (
  <SwiperProduct key={brand} addToCartHandler={addToCartHandler} brand={brand} products={products} />
))}
        {Banner && (<FooterBanner footerBanner={Banner[0]}/>)}
        
        </>
      )}
    </Layout>
  );
}