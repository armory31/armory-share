import { Metadata } from 'next';

// Esta función se ejecuta EN EL SERVIDOR antes de enviar nada a WhatsApp
export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const path = params?.path || [];
  const type = path[0] || 'song';
  
  // Decodificar parámetros de forma segura
  let title = 'ARMORY';
  let description = 'Abre este enlace con la app ARMORY';
  let image = 'https://armory-19193.web.app/og-default.jpg'; // Imagen por defecto

  if (searchParams?.t) {
    try { title = decodeURIComponent(searchParams.t); } catch(e) {}
  }
  if (searchParams?.s) {
    try { description = `Por ${decodeURIComponent(searchParams.s)}`; } catch(e) {}
  }
  if (searchParams?.i) {
    try {
      const decodedImg = decodeURIComponent(searchParams.i);
      // Validar dominio seguro
      if (decodedImg.startsWith('https://') && 
         (decodedImg.includes('yt3.googleusercontent.com') || 
          decodedImg.includes('i.ytimg.com') || 
          decodedImg.includes('lh3.googleusercontent.com'))) {
        image = decodedImg;
      }
    } catch(e) {}
  }

  return {
    title: `${title} — ARMORY`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [image],
      type: type === 'artist' ? 'profile' : 'music.song',
      url: `https://armory-share.vercel.app/${path.join('/')}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [image],
    },
  };
}

// El componente visual para humanos (lo que ven al hacer clic)
export default function SharePage({ params, searchParams }: any) {
  const path = params?.path || [];
  const type = path[0] || 'song';
  
  let title = 'ARMORY';
  let subtitle = 'Abre este enlace con la app ARMORY';
  let image = 'https://armory-19193.web.app/og-default.jpg';

  if (searchParams?.t) {
    try { title = decodeURIComponent(searchParams.t); } catch(e) {}
  }
  if (searchParams?.s) {
    try { subtitle = `Por ${decodeURIComponent(searchParams.s)}`; } catch(e) {}
  }
  if (searchParams?.i) {
    try {
      const decodedImg = decodeURIComponent(searchParams.i);
      if (decodedImg.startsWith('https://') && 
         (decodedImg.includes('yt3.googleusercontent.com') || 
          decodedImg.includes('i.ytimg.com') || 
          decodedImg.includes('lh3.googleusercontent.com'))) {
        image = decodedImg;
      }
    } catch(e) {}
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#0a0a0a',
      color: '#fff', fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem'
    }}>
      <img src={image} alt={title} style={{
        width: '200px', height: '200px', borderRadius: '8px', marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(201, 168, 76, 0.3)', objectFit: 'cover'
      }} />
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c9a84c', marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '1.1rem' }}>{subtitle}</p>
      
      <a href="https://armory31.github.io" style={{
        display: 'inline-block', padding: '1rem 3rem', background: '#c9a84c',
        color: '#0a0a0a', fontWeight: 800, textDecoration: 'none',
        borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em',
        boxShadow: '0 0 25px rgba(201, 168, 76, 0.4)'
      }}>Descargar ARMORY</a>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var path = "${internalPath}";
          if (!path) return;
          
          // Intentar abrir la app usando el esquema correcto (doble barra)
          var appUrl = "armory://" + path;
          
          // Usamos window.location.replace para intentar el deep link
          // Si la app está instalada, saltará. Si no, se quedará aquí.
          setTimeout(function() {
            window.location.replace(appUrl);
          }, 300); // Pequeño delay para asegurar que la página cargó
        })();
      `}} />
    </div>
  );
}
