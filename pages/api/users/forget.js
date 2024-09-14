import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import config from '../../../utils/config';
import client from '../../../utils/client';

const handler = nc();

handler.post(async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the user with the provided email exists
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      {
        email,
      }
    );

    if (!user) {
      return res.status(401).send({ message: 'User not found' });
    }

    // Update the user's password
    const updatedUser = {
      ...user,
      password: bcrypt.hashSync(newPassword),
    };

    // Use mutations to update the user's password
    const updateMutation = {
      patch: {
        id: updatedUser._id,
        set: {
          password: updatedUser.password,
        },
      },
    };

    const projectId = config.projectId;
    const dataset = config.dataset;
    const tokenWithWriteAccess = config.token;

    // Execute the mutation to update the password
    const { data } = await axios.post(
      `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
      { mutations: [updateMutation] },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${tokenWithWriteAccess}`,
        },
      }
    );

    // Check if the update was successful
    if (data.results.length === 0) {
      return res.status(500).send({ message: 'Password update failed' });
    }

    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

export default handler;
