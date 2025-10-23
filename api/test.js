export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Minimal test endpoint working!',
    method: req.method,
    url: req.url
  });
}
