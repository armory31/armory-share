import { Metadata } from 'next';
import TogetherJoin from './TogetherJoin';

export async function generateMetadata(
  { params }: { params: { code: string } }
): Promise<Metadata> {
  const code = params.code ?? '';

  if (!/^\d{6}$/.test(code)) {
    return { title: 'Enlace no válido', description: 'Código de sesión inválido' };
  }

  return {
    title: 'Únete a mi sesión en ARMORY',
    description: `Código: ${code}`,
    openGraph: {
      title: 'Únete a mi sesión en ARMORY',
      description: `Código: ${code}`,
      images: [{ url: 'https://armory-19193.web.app/og-default.jpg', width: 544, height: 544 }],
      type: 'website',
      url: `https://armory-share.vercel.app/together/${code}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Únete a mi sesión en ARMORY',
      description: `Código: ${code}`,
      images: ['https://armory-19193.web.app/og-default.jpg'],
    },
  };
}

export default function TogetherPage({ params }: { params: { code: string } }) {
  const code = params.code ?? '';

  if (!/^\d{6}$/.test(code)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0a0a', color: '#fff',
        fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: '#c9a84c' }}>Código de sesión inválido</h1>
      </div>
    );
  }

  return <TogetherJoin code={code} />;
}
