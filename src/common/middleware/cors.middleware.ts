import cors from 'cors';

const TWO_HOURS_IN_SECONDS = 7200;

export function specifyCors() {
  const isProd = process.env.NODE_ENV === 'production';
  const allowedOrigins: Array<string | RegExp> = [process.env.FRONT_END_URL];

  if (!isProd) {
    const originsList = [...[3000, 3001].map((port) => `http://localhost:${port}`)];
    allowedOrigins.push(...originsList);
  }

  return cors({
    origin: allowedOrigins,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: TWO_HOURS_IN_SECONDS,
  });
}
