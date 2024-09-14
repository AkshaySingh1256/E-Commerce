import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import client from '../../utils/client';
import { urlFor, urlForThumbnail } from '../../utils/image';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import Related from '../../components/Related';
import Reviews from '../../components/Reviews';
import FeedBack from '../../components/FeedBack';
import {FaShareFromSquare} from 'react-icons/fa6';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FiShoppingCart} from 'react-icons/fi';
import {VscFeedback} from 'react-icons/vsc';
export default function ProductScreen(props) {
  const router = useRouter();
  const { slug } = props;
  const {
    state: { cart,userInfo },
    dispatch,
    
  } = useContext(Store);
  
  const { enqueueSnackbar } = useSnackbar();
  const [feedbackOption,setfeedbackOption]=useState(false);
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: '',
  });
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { product, loading, error } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await client.fetch(
          `
            *[_type == "product" && slug.current == $slug][0]`,
          { slug }
        );
        if (product && product.buyer && product.buyer.length > 0 && userInfo ) {
          if(product.buyer.some(buyer => buyer.id ===  userInfo._id)){
            setfeedbackOption(true)
          } 
          else{
            setfeedbackOption(false)
          }
        } else {
          console.log("buyer data is null or user not login");
        }
        
        setState({ ...state, product, loading: false });
        
      } catch (err) {
        setState({ ...state, error: err.message, loading: false });
      }
    };
    fetchData();
  }, [slug]);

  const addToCartHandler = async () => {
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
    <Layout title={product?.title}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : (
        <Box>
          <Box sx={classes.section}>
            <NextLink href="/" passHref>
              <Link>
                <Typography>back to result</Typography>
              </Link>
            </NextLink>
          </Box>
          <Grid  container spacing={2}>
            <Grid item md={6} xs={12}>
              <List>
                
              <Image
                src={urlFor(product.image && product.image[index])}
                alt={product.name}
                layout="responsive"
                width={540}
                height={540}
                className='bg-gray-600/60 rounded-2xl'
              />
              
              <Grid item md={9} xs={12}>
             <div className='flex'>
               {product.image?.map((item, i) => (
                <div className='flex-row m-2'>
              <img
                key={i}
                src={urlFor(item)}
                className={i === index ? 'bg-red-500/50 rounded-xl border-white/75 border-[2px] ' : 'bg-gray-600/50 rounded-xl'}
                onClick={() => setIndex(i)}
                width={300}
                height={300}
              />
              </div>
            ))}
            </div>
            </Grid>
           
            </List>
            </Grid>
            
            <Grid item md={6} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                  <b> {product.name}</b> 
                  </Typography>
                  
                  <CopyToClipboard text={window.location.href}>
                  <FaShareFromSquare size={25} className='mx-5 cursor-pointer hover:text-yellow-500' onClick={()=>{ enqueueSnackbar(`Copied! now paste sent `, {
      variant: 'success',
    });}}/> 
                  </CopyToClipboard>
                </ListItem>
                <Grid item md={6} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography>{product.pre_price && (<><span className="text-gray-500 line-through mr-2">Rs.{product.pre_price}</span><span className="text-green-500 mx-2">{(100-((product.price/product.pre_price)*100)).toFixed(2)}% off</span></>)}Rs.{product.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? `In stock (${product.countInStock})`
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    {feedbackOption ? (<Grid container spacing={1}>
                      <Grid item xs={6}>
                      {product.countInStock > 0
                            ? (<button
                              className="bg-blue-500 w-full text-white hover:bg-blue-600 py-2 rounded-lg mt-2"
                              onClick={() => addToCartHandler(product)}
                            >
                              <FiShoppingCart className="inline-block mr-2" /> Add to cart
                            </button>)
                            : (<button
                              className=" w-full text-white bg-blue-600 py-2 rounded-lg mt-2"
                              onClick={()=>{ enqueueSnackbar(`This product Unavailable `, {
                                variant: 'error',
                              });}}
                            >
                              <FiShoppingCart className="inline-block mr-2" /> Unavailable
                            </button>)}
                      </Grid>
                      <Grid item xs={6}>
                      
                           <button
                              className="bg-blue-500 w-full text-white hover:bg-blue-600 py-2 rounded-lg mt-2"
                              onClick={handleOpen}
                            >
                              <VscFeedback className="inline-block mr-2" /> FeedBack
                            </button>
                      
                      
                        
                      </Grid>
                    </Grid>):(<>{product.countInStock > 0
                            ? (<button
                              className="bg-blue-500 w-full text-white hover:bg-blue-600 py-2 rounded-lg mt-2"
                              onClick={() => addToCartHandler(product)}
                            >
                              <FiShoppingCart className="inline-block mr-2" /> Add to cart
                            </button>)
                            : (<button
                              className=" w-full text-white bg-blue-600 py-2 rounded-lg mt-2"
                              onClick={()=>{ enqueueSnackbar(`This product Unavailable `, {
                                variant: 'error',
                              });}}
                            >
                              <FiShoppingCart className="inline-block mr-2" />Unavailable
                            </button>)}</>)}
                  
                    
                  </ListItem>
                </List>
              </Card>
              </Grid>
                <ListItem><b>Category:</b> {product.category}</ListItem>
                <ListItem><b>Brand:</b> {product.brand}</ListItem>
                <ListItem>
                  <Rating value={product.rating} readOnly></Rating>
                  <Typography sx={classes.smallText}>
                    ({product.numReviews} reviews)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography ><b>Description:</b> {product.description}</Typography>
                </ListItem>
                <ListItem>
                  <Typography ><b>Specification:</b> {product.specification}</Typography>
                </ListItem>
              </List>
            </Grid>
            
            
          </Grid>
        </Box>
      )}
{product && product.reviews && <Reviews reviews={product.reviews} />}

      
{product && <Related brand={product.brand} />} 
<div className='flex justify-center items-center'>
  {userInfo && product && <FeedBack id={product._id} onClose={handleClose} open={open} setOpen={setOpen} username={userInfo.name}/>}
</div>

    </Layout>
  );
}

export function getServerSideProps(context) {
  return {
    props: { slug: context.params.slug },
  };
}
