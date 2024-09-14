import nc from 'next-connect';
import client from '../../utils/client';

const handler = nc();

handler.get(async (req, res) => {
const bannerQuery = '*[_type == "banner"]';
const bannerData = await client.fetch(bannerQuery);
  res.send(bannerData);
});
export default handler;