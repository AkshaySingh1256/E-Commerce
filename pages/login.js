import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useForm, Controller } from 'react-hook-form';
import NextLink from 'next/link';
import Form from '../components/Form';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import jsCookie from 'js-cookie';
import { getError } from '../utils/error';
import PasswordForget from '../components/PasswordForget';

export default function LoginScreen() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const { redirect } = router.query;
  const [open, setOpen] = useState(false);
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 
  useEffect(() => {
    if (userInfo) {
      router.push(redirect || '/');
    }
  }, [router, userInfo, redirect]);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar } = useSnackbar();
  const submitHandler = async ({ email, password }) => {
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      jsCookie.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  

  
  return (
    <>
   
   <div className='bg-cover bg-center w-full h-screen' style={{backgroundImage:'url("/bg2.svg")'}}>
      <img src='/headphone.gif' width={450} height={450} className='absolute top-[30%] transform -translate-y-1/2 animate-slideleft right-0'/>
      <img src='/headphone.gif' width={450} height={450} className='absolute top-[30%] transform -translate-y-1/2 animate-slideright left-0'/>
      
    <Layout  title="Login">
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem >
            Do not have an account?{' '}
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>Register</Link>
            </NextLink>
            
          </ListItem>
          <p className='text-end text-yellow-300 cursor-pointer' onClick={handleOpen}>Forget Password?</p>
        </List>
      </Form>
      <PasswordForget open={open} onClose={handleClose} />
      
    </Layout>
    </div>
    </>
  );
}
