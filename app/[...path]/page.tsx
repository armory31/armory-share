import { Metadata } from 'next';
import { notFound } from 'next/navigation'; // AÑADIDO

// Esta función se ejecuta EN EL SERVIDOR antes de enviar nada a WhatsApp
export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const path = params?.path || [];
  const type = path[0] || 'song';
  
  // AÑADIDO: Validación para Together
  if (type === 'together') {
    const code = path[1] || '';
    if (!/^\d{6}$/.test(code)) notFound(); // 404 si no son 6 dígitos
    
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

  let title = 'ARMORY';
  let description = 'Abre este enlace con la app ARMORY';
  let image = 'https://armory-19193.web.app/og-default.jpg'; 

  if (searchParams?.t) {
    try { title = decodeURIComponent(searchParams.t); } catch(e) {}
  }
  if (searchParams?.s) {
    try { description = `Por ${decodeURIComponent(searchParams.s)}`; } catch(e) {}
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

  return {
    title: `${title} — ARMORY`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: image, width: 544, height: 544 }],
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

export default function SharePage({ params, searchParams }: any) {
  const pathArray = params?.path || [];
  const type = pathArray[0] || ''; // AÑADIDO

  // AÑADIDO: Vista específica para Together
  if (type === 'together') {
    const code = pathArray[1] || '';
    if (!/^\d{6}$/.test(code)) notFound();
    
    const deepLink = `armory://together/${code}`;
    
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#0a0a0a',
        color: '#fff', fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem'
      }}>
        <img src="https://armory-19193.web.app/og-default.jpg" alt="ARMORY" style={{
          width: '160px', height: '160px', borderRadius: '12px', marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(201, 168, 76, 0.3)', objectFit: 'cover'
        }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c9a84c', marginBottom: '0.5rem' }}>
          Únete a mi sesión en ARMORY
        </h1>
        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '1rem' }}>
          Código de la sala
        </p>
        <div style={{
          background: '#141414', border: '1px solid #c9a84c', borderRadius: '8px',
          padding: '1rem 2.5rem', marginBottom: '2rem',
          boxShadow: '0 0 25px rgba(201, 168, 76, 0.25)'
        }}>
          <span style={{
            fontSize: '3rem', fontWeight: 900, color: '#c9a84c',
            letterSpacing: '0.5rem', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
          }}>
            {code}
          </span>
        </div>
        
        <a href={deepLink} style={{
          display: 'inline-block', padding: '1rem 3rem', background: '#c9a84c',
          color: '#0a0a0a', fontWeight: 800, textDecoration: 'none',
          borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em',
          boxShadow: '0 0 25px rgba(201, 168, 76, 0.4)', marginBottom: '1rem'
        }}>
          Abrir en ARMORY
        </a>

        <a href="https://armory31.github.io" style={{
          display: 'inline-block', padding: '0.75rem 2rem', background: 'transparent',
          color: '#c9a84c', fontWeight: 600, textDecoration: 'none',
          borderRadius: '4px', border: '1px solid #c9a84c',
          textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          Descargar ARMORY
        </a>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var url = "${deepLink}";
            setTimeout(function() {
              try { window.location.replace(url); } catch(e) {}
            }, 300);
          })();
        `}} />
      </div>
    );
  }

  // Código original para song/album/artist/playlist (sin cambios)
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

  const internalPathStr = pathArray.join('/');

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
        boxShadow: '0 0 25px rgba(201, 168, 76, 0.4)', marginBottom: '1rem'
      }}>Descargar ARMORY</a>

      <a 
        href={`armory://${internalPathStr}`} 
        style={{ color: '#c9a84c', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer' }}
      >
        ¿No se abre automáticamente? Toca aquí para abrir en la app
      </a>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var path = "${internalPathStr}";
          
          if (!path) {
            console.log("No hay ruta para redirigir");
            return;
          }
          
          var appUrl = "armory://" + path;
          
          setTimeout(function() {
            window.location.replace(appUrl);
          }, 300);
        })();
      `}} />
    </div>
  );
}
