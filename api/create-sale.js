export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.api_key || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Variavel de ambiente api_key nao configurada na Vercel.'
      });
    }

    const blackcatResponse = await fetch('https://api.blackcatpay.com.br/api/sales/create-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(req.body || {})
    });

    const data = await blackcatResponse.json();
    return res.status(blackcatResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao criar venda PIX.',
      error: error?.message || 'unknown_error'
    });
  }
}
