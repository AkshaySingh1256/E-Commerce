import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { getError } from '../utils/error';

export default function FeedBack({ open, onClose, setOpen, id, username }) {
  console.log("product id \n", id, "username:\n", username);
  const { enqueueSnackbar } = useSnackbar();
  const [inputValue, setInputValue] = useState('');
  const maxLength = 100; // Maximum length for inputValue

  const handleSubmit = async () => {
    if (inputValue) {
      try {
        const response = await axios.post('/api/pay/feedback', {
          userName: username,
          id: id,
          comment: inputValue
        });

        if (response.status === 200) {
          enqueueSnackbar(`Feedback added`, {
            variant: 'success',
          });
          setInputValue('');
          setOpen(false);
        } else {
          // Handle other error cases
          console.error('Feedback submission failed');
        }
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    } else {
      enqueueSnackbar(`Enter some feedback`, {
        variant: 'error',
      });
    }
  };

  return (
    <div className={`fixed inset-0 ${open ? 'backdrop-blur-sm' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-black/80 z-50 overflow-hidden w-full max-w-md p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-500 mb-4">Feedback</h2>
          <div className="p-4">
            <textarea
              rows="4"
              placeholder="Feedback ...."
              value={inputValue}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setInputValue(e.target.value);
                }
              }}
              className="w-full text-black p-2 border rounded resize-y"
              style={{ maxHeight: '150px' }}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
