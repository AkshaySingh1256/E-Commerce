import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button
} from '@mui/material';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useContext,  useReducer } from 'react';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import getStripe from '../../utils/load';
import React, { useEffect } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
  }
}
function OrderScreen({ params }) {

  const { enqueueSnackbar } = useSnackbar();
  const { id: orderId } = params;
  
  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  );
 

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  //const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      
    }
  }, [order, orderId,  router,successPay, userInfo]);
  
 
  const handlepay = async () => {
    const stripe = await getStripe();
  
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({hi:order,email:userInfo.email}),
    });

  
    if (response.status === 500) return;
    const data = await response.json();
  
    
  
    
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const response = await fetch('/api/pay/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: order._id, email_address: userInfo.email }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data
        // Handle success, e.g., show a success message or update the UI
      } else {
        // Handle non-successful responses, e.g., show an error message or handle specific errors
        console.error('Error:', response.status, response.statusText);
      }
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      //enqueueSnackbar('Order is paid', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }

    try {
      // Make a POST request to the API route to store buyer data
      const response = await axios.post('/api/pay/buyer', {
        userName:userInfo.name,
        id:userInfo._id,
        products:orderItems,
      });

      if (response.status === 200) {
        console.log('Buyer data stored successfully:', response.data);
        // Handle success here, e.g., show a success message
      } else {
        console.error('Error storing buyer data:', response.data);
        // Handle errors here
      }
    } catch (error) {
      console.error('Error making POST request:', error);
      // Handle network errors here
    }
    stripe.redirectToCheckout({ sessionId: data.id });
  };
  
  

  

  const Receipt = () => {
    const doc = new jsPDF({
      orientation: 'portrait', 
      unit: 'mm', 
      format: 'a4', 
    });
    const logoData = '/logo.jpg';

    
    doc.addImage(logoData, 'PNG', doc.internal.pageSize.width - 30, 10, 20, 20);
    const marginLeft = 10;
    let marginTop = 10; 
  
   

    doc.setFontSize(16);
    doc.text(`Order id: ${orderId}`, marginLeft, marginTop);
  
    marginTop += 10; // Increase marginTop as needed

    // User Email
doc.setFontSize(12);
doc.text(`Email: ${userInfo.email}`, marginLeft, marginTop);
marginTop += 10;
  
    

const address = {
  headers: ['Name', 'Address', 'City', 'Postal Code', 'Country'],
  rows: [
    [
      shippingAddress.fullName,
      shippingAddress.address,
      shippingAddress.city,
      shippingAddress.postalCode,
      shippingAddress.country,
    ],
  ],
};
marginTop += 2; 
// Add Address Details Table
doc.setFontSize(12);
doc.text('Address Details', marginLeft, marginTop);

doc.autoTable({
  head: [address.headers],
  body: address.rows,
  startY: marginTop + 10, // Adjust the marginTop value here
  margin: { left: marginLeft, right: marginLeft },
  theme: 'grid',
  tableWidth: 'auto',
});

// Update marginTop
marginTop = doc.autoTable.previous.finalY + 20;

const status = {
  headers: ['Status', 'Payment Method', 'Payment Status'],
  rows: [
    [
      `${isDelivered ? `Delivered at ${deliveredAt}` : 'Not Delivered'}`,
      paymentMethod,
      `${isPaid ? `Paid at ${paidAt}` : 'Not Paid'}`,
      
    ],
  ],
};
marginTop += 2; 
// Add Address Details Table
doc.setFontSize(12);
doc.text('Status', marginLeft, marginTop);

doc.autoTable({
  head: [status.headers],
  body: status.rows,
  startY: marginTop + 10, // Adjust the marginTop value here
  margin: { left: marginLeft, right: marginLeft },
  theme: 'grid',
  tableWidth: 'auto',
});

// Update marginTop
marginTop = doc.autoTable.previous.finalY + 20;
  
    // Order Items Table
    const table = {
      headers: ['Name', 'Quantity', 'Price'],
      rows: orderItems.map(item => {
        // Preload the image and draw it onto the PDF
        const imgData = item.image;
        const imageWidth = 30; // Adjust as needed
        const imageHeight = 30; // Adjust as needed
        doc.addImage(imgData, 'JPEG', marginLeft, marginTop, imageWidth, imageHeight);
  
        marginTop += imageHeight + 5; // Adjust marginTop as needed
  
        return [item.name, item.quantity, `Rs.${item.price}`];
      })
    };
  
    // Set styles for the table
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set text color to black
  
    doc.autoTable({
      head: [table.headers],
      body: table.rows,
      startY: marginTop, // Use the updated marginTop
      margin: { left: marginLeft, right: marginLeft },
      theme: 'grid',
      tableWidth: 'auto'
    });
  
    marginTop = doc.autoTable.previous.finalY + 20; // Update marginTop
  
    // Order Summary
    doc.setFontSize(14);
    doc.text('Order Summary', marginLeft, marginTop);
    doc.setFontSize(12);
  
    const summary = [
      ['Email id:',userInfo.email],
      ['Name:',shippingAddress.fullName],
      ['Items:', `Rs.${itemsPrice}`],
      ['Total:', `Rs.${itemsPrice}`]
    ];
  
    doc.autoTable({
      body: summary,
      startY: doc.autoTable.previous.finalY + 10,
      margin: { left: marginLeft, right: marginLeft },
      tableWidth: 'auto',
      theme: 'grid'
    });
  
    // Save or open the PDF
    doc.save(`receipt_${orderId}.pdf`);
  };

  return (
    
    <Layout  title={`Order ${orderId}`}>
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert  variant="error">{error}</Alert>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </ListItem>
                <ListItem>
                  Status:{' '}
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : 'not delivered'}
                </ListItem>
              </List>
            </Card>

            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
                </ListItem>
              </List>
            </Card>

            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._key}>
                            <TableCell>
                            <NextLink href={`/product/${item.name.trim().replace(/\s+/g, '-').toLowerCase()}`} passHref>


                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                            <NextLink href={`/product/${item.name.trim().replace(/\s+/g, '-').toLowerCase()}`} passHref>


                                <Link>
                                  <Typography>{item.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>Rs.{item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">Rs.{itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>Rs.{itemsPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid ? (
                  <ListItem className='print:hidden' >
                  <Box sx={classes.fullWidth} >
                  {paymentMethod=='Cash'? <>
                  
                  <Typography align="center">
                        <strong color="primary">Delivery under 5 Day </strong>
                        
                      </Typography>
                      <Button onClick={Receipt}  variant="contained"
                  color="primary"
                  fullWidth   >Receipt</Button>
                   </>: <Button onClick={handlepay}  variant="contained"
                  color="primary"
                  fullWidth   >Pay</Button> }
                      </Box>
                  </ListItem>
                ):(
                  <ListItem>
                  <Box sx={classes.fullWidth} >
                  <Button  onClick={Receipt}   variant="contained"
                  color="primary"
                  fullWidth   >Receipt</Button>
                      </Box>
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
      
      
    </Layout>
  );
}
export function getServerSideProps({ params }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(OrderScreen), { ssr: false });
