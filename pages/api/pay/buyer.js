import axios from 'axios';
import nc from 'next-connect';
import config from '../../../utils/config'; // Adjust the path based on your project structure
import { v4 as uuidv4 } from 'uuid';
const handler = nc();

handler.post(async (req, res) => {
  try {
    const { userName, id, products } = req.body;
    const buyerKey = uuidv4();
    // Loop through each product in the products array
    for (const product of products) {
      // Create a mutation to update the buyer field in the product document
      const mutation = {
        patch: {
          id: product._id, // Use the product's _id as the ID
          insert: {
            before:'buyer[-1]',
            items: [
              {
               
                _type: 'object',
                _key:buyerKey,
                userName: userName,
                id: id,
              },
              
            ],
          },
        },
      };
      

      // Send the mutation to Sanity
      await axios.post(
        `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
        { mutations: [mutation] },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${config.token}`,
          },
        }
      );
    }

    res.status(200).json({ message: 'Buyer information updated in products.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating buyer information.' });
  }
});

export default handler;
