import { NextApiRequest, NextApiResponse } from 'next';
import { getFunnelURL } from '@/lib/geolocation';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown';

    const override = typeof req.query.country === 'string' ? req.query.country : '';

    const countryCode =
      override ||
      (req.headers['x-vercel-ip-country-code'] as string) ||
      (req.headers['x-vercel-ip-country'] as string) ||
      (req.headers['cf-ipcountry'] as string) ||
      'DEFAULT';

    const funnelURL = getFunnelURL(countryCode);

    console.log(
      `[Redirect] IP: ${ip} | Country: ${countryCode} | Override: ${override || 'none'} | Target: ${funnelURL}`
    );

    if (req.query.debug === '1') {
      res.status(200).json({
        ip,
        countryCode,
        override: override || null,
        funnelURL,
        headers: {
          'x-vercel-ip-country': req.headers['x-vercel-ip-country'] || null,
          'x-vercel-ip-country-region': req.headers['x-vercel-ip-country-region'] || null,
          'x-vercel-ip-city': req.headers['x-vercel-ip-city'] || null,
          'cf-ipcountry': req.headers['cf-ipcountry'] || null,
        },
      });
      return;
    }

    res.redirect(302, funnelURL);
  } catch (error) {
    console.error('Redirect error:', error);
    res.redirect(
      302,
      process.env.NEXT_PUBLIC_DEFAULT_FUNNEL_URL || 'https://courses.systeme.io/default-funnel'
    );
  }
}
