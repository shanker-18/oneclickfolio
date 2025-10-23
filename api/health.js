export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Backend running fine on Vercel!',
    timestamp: new Date().toISOString()
  });
}
