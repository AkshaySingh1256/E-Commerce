import axios from 'axios';
import nc from 'next-connect';
import config from '../../../utils/config'; 
import { v4 as uuidv4 } from 'uuid';
const handler = nc();

handler.post(async (req, res) => {
  try {
    const { userName,comment,id } = req.body;
    const buyerKey = uuidv4();
    
      const mutation = {
        patch: {
          id: id, 
          insert: {
            before:'reviews[-1]',
            items: [
              {
               
                _type: 'object',
                _key:buyerKey,
                userName: userName,
                comment: comment,
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
    

    res.status(200).json({ message: 'feedback added.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating feedack information.' });
  }
});

export default handler;
