import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const DEFAULT_IMAGE = 'https://armory-19193.web.app/og-default.jpg';
const SHARE_HOST = 'https://armory-share.vercel.app';

// ============================================
// METADATA (servidor) - WhatsApp, Telegram, etc.
// ============================================
export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  // ⚠️ CLAVE: En Next.js 15+, params y searchParams son Promises
  const resolvedParams = await Promise.resolve(params || {});
  const resolvedSearchParams = await Promise.resolve(searchParams || {});

  const path: string[] = resolvedParams?.path || [];
  const type = path[0] || '';

  // ---------- Ruta /together/{code} ----------
  if (type === 'together') {
    const code = path[1] || '';
    if (!/^\d{6}$/.test(code)) notFound();

    return {
      title: 'Únete a mi sesión en ARMORY',
      description: `Código: ${code}`,
      openGraph: {
        title: 'Únete a mi sesión en ARMORY',
        description: `Código: ${code}`,
        images: [{ url: DEFAULT_IMAGE, width: 544, height: 544 }],
        type: 'website',
        url: `${SHARE_HOST}/together/${code}`,
        siteName: 'ARMORY',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Únete a mi sesión en ARMORY',
        description: `Código: ${code}`,
        images: [DEFAULT_IMAGE],
      },
    };
  }

  // ---------- Rutas /song, /album, /artist, /playlist ----------
  let title = 'ARMORY';
  let description = 'Abre este enlace con la app ARMORY';
  let image = DEFAULT_IMAGE;

  if (resolvedSearchParams?.t) {
    try { title = decodeURIComponent(String(resolvedSearchParams.t)); } catch (e) {}
  }
  if (resolvedSearchParams?.s) {
    try { description = `Por ${decodeURIComponent(String(resolvedSearchParams.s))}`; } catch (e) {}
  }
  if (resolvedSearchParams?.i) {
    try {
      const decodedImg = decodeURIComponent(String(resolvedSearchParams.i));
      if (
        decodedImg.startsWith('https://') &&
        (decodedImg.includes('yt3.googleusercontent.com') ||
          decodedImg.includes('i.ytimg.com') ||
          decodedImg.includes('lh3.googleusercontent.com'))
      ) {
        image = decodedImg;
      }
    } catch (e) {}
  }

  return {
    title: `${title} — ARMORY`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: image, width: 544, height: 544 }],
      type: type === 'artist' ? 'profile' : 'music.song',
      url: `${SHARE_HOST}/${path.join('/')}`,
      siteName: 'ARMORY',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [image],
    },
  };
}

// ============================================
// PÁGINA VISIBLE (humano que hace clic)
// ============================================
export default async function SharePage({ params, searchParams }: any) {
  // ⚠️ CLAVE: await en el componente también
  const resolvedParams = await Promise.resolve(params || {});
  const resolvedSearchParams = await Promise.resolve(searchParams || {});

  const pathArray: string[] = resolvedParams?.path || [];
  const type = pathArray[0] || '';

  // ---------- Vista /together/{code} ----------
  if (type === 'together') {
    const code = pathArray[1] || '';
    if (!/^\d{6}$/.test(code)) notFound();

    const deepLink = `armory://together/${code}`;

    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <img src={DEFAULT_IMAGE} alt="ARMORY" style={styles.image} />
          <h1 style={styles.title}>Únete a mi sesión en ARMORY</h1>
          <p style={styles.subtitle}>Código de la sala</p>
          <div style={styles.codeBox}>
            <span style={styles.codeText}>{code}</span>
          </div>
          <a href={deepLink} style={styles.primaryButton}>
            Abrir en ARMORY
          </a>
          <a href="https://armory31.github.io" style={styles.secondaryButton}>
            Descargar ARMORY
          </a>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              var url = ${JSON.stringify(deepLink)};
              setTimeout(function() {
                try { window.location.replace(url); } catch(e) {}
              }, 300);
            })();
          `,
          }}
        />
      </div>
    );
  }

  // ---------- Vista de contenido ----------
  let title = 'ARMORY';
  let subtitle = 'Abre este enlace con la app ARMORY';
  let image = DEFAULT_IMAGE;

  if (resolvedSearchParams?.t) {
    try { title = decodeURIComponent(String(resolvedSearchParams.t)); } catch (e) {}
  }
  if (resolvedSearchParams?.s) {
    try { subtitle = `Por ${decodeURIComponent(String(resolvedSearchParams.s))}`; } catch (e) {}
  }
  if (resolvedSearchParams?.i) {
    try {
      const decodedImg = decodeURIComponent(String(resolvedSearchParams.i));
      if (
        decodedImg.startsWith('https://') &&
        (decodedImg.includes('yt3.googleusercontent.com') ||
          decodedImg.includes('i.ytimg.com') ||
          decodedImg.includes('lh3.googleusercontent.com'))
      ) {
        image = decodedImg;
      }
    } catch (e) {}
  }

  const internalPathStr = pathArray.join('/');

  return (
    <div style={styles.page}>
      <img src={image} alt={title} style={styles.image} />
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>

      <a href="https://armory31.github.io" style={styles.primaryButton}>
        Descargar ARMORY
      </a>

      <a href={`armory://${internalPathStr}`} style={styles.fallbackLink}>
        ¿No se abre automáticamente? Toca aquí para abrir en la app
      </a>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function() {
            var path = ${JSON.stringify(internalPathStr)};
            if (!path) return;
            var appUrl = "armory://" + path;
            setTimeout(function() {
              try { window.location.replace(appUrl); } catch(e) {}
            }, 300);
          })();
        `,
        }}
      />
    </div>
  );
}

// ============================================
// ESTILOS
// ============================================
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textAlign: 'center',
    padding: '2rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 480,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: '2rem',
    objectFit: 'cover',
    boxShadow: '0 10px 40px rgba(201, 168, 76, 0.3)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#c9a84c',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#888',
    marginBottom: '2.5rem',
    fontSize: '1.1rem',
  },
  codeBox: {
    background: '#141414',
    border: '1px solid #c9a84c',
    borderRadius: 8,
    padding: '1rem 2.5rem',
    marginBottom: '2rem',
    boxShadow: '0 0 25px rgba(201, 168, 76, 0.25)',
  },
  codeText: {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#c9a84c',
    letterSpacing: '0.5rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  primaryButton: {
    display: 'inline-block',
    padding: '1rem 3rem',
    background: '#c9a84c',
    color: '#0a0a0a',
    fontWeight: 800,
    textDecoration: 'none',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    boxShadow: '0 0 25px rgba(201, 168, 76, 0.4)',
    marginBottom: '1rem',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    background: 'transparent',
    color: '#c9a84c',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: 4,
    border: '1px solid #c9a84c',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  fallbackLink: {
    color: '#c9a84c',
    textDecoration: 'underline',
    fontSize: '0.9rem',
    marginTop: '1rem',
  },
};
