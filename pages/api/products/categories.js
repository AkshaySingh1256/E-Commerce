import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  const categories = ['Headphone', 'Earphone','Neckband'];
  res.send(categories);
});

export default handler;
