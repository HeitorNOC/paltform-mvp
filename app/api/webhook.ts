import { NextApiRequest, NextApiResponse } from 'next';
import { updatePaymentStatus } from '@/actions/paymentStatus';

export default async function webhook(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { type, data } = req.body;

    if (type === 'payment') {
      try {
        await updatePaymentStatus(data.id);
        return res.status(200).json({ message: 'Payment status updated' });
      } catch (error) {
        console.error('Error updating payment status:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    return res.status(400).json({ error: 'Bad Request' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
