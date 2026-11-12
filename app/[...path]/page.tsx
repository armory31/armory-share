import { Metadata } from 'next';

// Esta función se ejecuta EN EL SERVIDOR antes de enviar nada a WhatsApp
export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const path = params?.path || [];
  const type = path[0] || 'song';
    // === TOGETHER ===
  if (type === 'together') {
    const code = path[1] || '';
    if (!/^\d{6}$/.test(code)) {
      return {
        title: 'Enlace no válido',
        description: 'Código de sesión inválido',
      };
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
  // === FIN TOGETHER ===
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

  // Construir la ruta interna limpia AQUÍ para usarla en el JSX y el Script
  const internalPathStr = pathArray.join('/');

    // === TOGETHER ===
  if (pathArray[0] === 'together') {
    const togetherCode = pathArray[1] || '';
    if (!/^\d{6}$/.test(togetherCode)) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem'
        }}>
          <h1 style={{ color: '#c9a84c' }}>Código de sesión inválido</h1>
        </div>
      );
    }
    return (
      <div id="together-page" style={{
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
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>Código de la sala</p>
        <div style={{
          background: '#141414', border: '1px solid #c9a84c', borderRadius: '8px',
          padding: '1rem 2.5rem', marginBottom: '2rem'
        }}>
          <span style={{
            fontSize: '3rem', fontWeight: 900, color: '#c9a84c',
            letterSpacing: '0.5rem', fontFamily: 'monospace'
          }}>{togetherCode}</span>
        </div>

        <a href={`armory://together/${togetherCode}`} style={{
          display: 'inline-block', padding: '1rem 3rem', background: '#c9a84c',
          color: '#0a0a0a', fontWeight: 800, textDecoration: 'none',
          borderRadius: '4px', textTransform: 'uppercase', marginBottom: '1rem'
        }}>Abrir en ARMORY</a>

        <a id="install-link" href="https://armory31.github.io" style={{
          display: 'none', padding: '0.75rem 2rem', background: 'transparent',
          color: '#c9a84c', fontWeight: 600, textDecoration: 'none',
          borderRadius: '4px', border: '1px solid #c9a84c', textTransform: 'uppercase'
        }}>Instalar ARMORY</a>

        <p id="install-msg" style={{ display: 'none', color: '#888', marginTop: '1rem', fontSize: '0.9rem' }}>
          ¿No tienes ARMORY? Instálalo para unirte a la sesión.
        </p>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var code = "${togetherCode}";
            var appUrl = "armory://together/" + code;
            var installLink = document.getElementById('install-link');
            var installMsg = document.getElementById('install-msg');
            var opened = false;

            // Intenta abrir la app
            var start = Date.now();
            window.location.href = appUrl;

            // Si tras 1.5s seguimos aquí, la app NO está instalada
            setTimeout(function() {
              if (Date.now() - start < 2500 && !document.hidden) {
                installLink.style.display = 'inline-block';
                installMsg.style.display = 'block';
              }
            }, 1500);

            // Si el usuario vuelve a la pestaña (app no se abrió), mostramos instalar
            window.addEventListener('focus', function() {
              if (Date.now() - start > 2000) {
                installLink.style.display = 'inline-block';
                installMsg.style.display = 'block';
              }
            });
          })();
        `}} />
      </div>
    );
  }
  // === FIN TOGETHER ===
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
      
      {/* Botón principal de descarga (fallback) */}
      <a href="https://armory31.github.io" style={{
        display: 'inline-block', padding: '1rem 3rem', background: '#c9a84c',
        color: '#0a0a0a', fontWeight: 800, textDecoration: 'none',
        borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em',
        boxShadow: '0 0 25px rgba(201, 168, 76, 0.4)', marginBottom: '1rem'
      }}>Descargar ARMORY</a>

      {/* Enlace manual por si el automático falla */}
      <a 
        href={`armory://${internalPathStr}`} 
        style={{ color: '#c9a84c', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer' }}
      >
        ¿No se abre automáticamente? Toca aquí para abrir en la app
      </a>

      {/* Script corregido: Inyectamos la variable directamente en el template string */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          // La ruta se inyecta aquí desde el servidor: "${internalPathStr}"
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
