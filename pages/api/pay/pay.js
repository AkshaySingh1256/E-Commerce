import axios from 'axios';
import nc from 'next-connect';
import { isAuth } from '../../../utils/auth'; // Adjust the path based on your project structure
import config from '../../../utils/config'; // Adjust the path based on your project structure

const handler = nc();

//handler.use(isAuth);
handler.post(async (req, res) => {
  const tokenWithWriteAccess = config.token;
  try {
    // Modify your code to access request parameters or body directly
    const { id, email_address } = req.body;

    await axios.post(
      `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
      {
        mutations: [
          {
            patch: {
              id: id, // Use the id from the request body
              set: {
                isPaid: true,
                paidAt: new Date().toISOString(),
                'paymentResult.id': id, // Use the id from the request body
                'paymentResult.status': email_address, // Use the email_address from the request body
                'paymentResult.email_address': email_address, // Use the email_address from the request body
              },
            },
          },
        ],
      },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${tokenWithWriteAccess}`,
        },
      }
    );

    res.status(200).json({ message: 'order paid' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the payment.' });
  }
});

export default handler;
