import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';


export default function PasswordForget({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const handleSubmit = async () => {
    try {
      
      const response = await axios.post('/api/users/forget', {
        email,
        newPassword: password,
      });
  
      if (response.status === 200) {
        setResetSuccess(true);
      } else {
        // Handle other error cases
        console.error('Password reset failed');
      }
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forget Password</DialogTitle>
      <DialogContent>

        {resetSuccess ? (
          <p>Password reset successful. You can now login with your new password.</p>
        ) : (
          <>
          
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {!resetSuccess && (
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
