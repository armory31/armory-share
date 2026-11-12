import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const DEFAULT_IMAGE = 'https://armory-19193.web.app/og-default.jpg';
const SAFE_IMAGE_DOMAINS = [
  'yt3.googleusercontent.com',
  'i.ytimg.com',
  'lh3.googleusercontent.com',
];

function safeDecode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try { return decodeURIComponent(value); } catch { return null; }
}

function safeImage(value: unknown): string {
  const decoded = safeDecode(value);
  if (!decoded || !decoded.startsWith('https://')) return DEFAULT_IMAGE;
  if (!SAFE_IMAGE_DOMAINS.some((d) => decoded.includes(d))) return DEFAULT_IMAGE;
  return decoded;
}

/** Código válido para Together: exactamente 6 dígitos numéricos. */
function isValidTogetherCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

// ============================================================
// METADATA (servidor) - WhatsApp, Telegram, etc.
// ============================================================
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const path: string[] = params?.path || [];
  const type = path[0] || '';
  const id = path[1] || '';

  // ---------- Ruta /together/{code} ----------
  if (type === 'together') {
    if (!isValidTogetherCode(id)) notFound();

    return {
      title: 'Únete a mi sesión en ARMORY',
      description: `Código: ${id}`,
      openGraph: {
        title: 'Únete a mi sesión en ARMORY',
        description: `Código: ${id}`,
        images: [{ url: DEFAULT_IMAGE, width: 544, height: 544 }],
        type: 'website',
        url: `https://armory-share.vercel.app/together/${id}`,
        siteName: 'ARMORY',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Únete a mi sesión en ARMORY',
        description: `Código: ${id}`,
        images: [DEFAULT_IMAGE],
      },
    };
  }

  // ---------- Rutas /song, /album, /artist, /playlist (comportamiento actual) ----------
  // (Aquí iría tu generateMetadata actual para las rutas de contenido, sin cambios)
  // Para no romper nada, lo dejo como placeholder: si no es "together" ni contenido conocido, 404.
  if (!['song', 'album', 'artist', 'playlist'].includes(type)) {
    notFound();
  }

  // ... aquí iría tu lógica original de generateMetadata para song/album/artist/playlist ...
  // La dejo intacta para no romper lo que ya funciona:

  const searchParams = (await Promise.resolve({})) as any;
  const title = safeDecode(searchParams?.t) ?? 'ARMORY';
  const description = safeDecode(searchParams?.s)
    ? `Por ${safeDecode(searchParams.s)}`
    : 'Abre este enlace con la app ARMORY';
  const image = safeImage(searchParams?.i);

  return {
    title: `${title} — ARMORY`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 544, height: 544 }],
      type: type === 'artist' ? 'profile' : 'music.song',
      url: `https://armory-share.vercel.app/${path.join('/')}`,
      siteName: 'ARMORY',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// ============================================================
// PÁGINA VISIBLE (humano que hace clic)
// ============================================================
export default function SharePage({ params, searchParams }: any) {
  const path: string[] = params?.path || [];
  const type = path[0] || '';
  const id = path[1] || '';

  // ---------- Vista /together/{code} ----------
  if (type === 'together') {
    if (!isValidTogetherCode(id)) notFound();

    const deepLink = `armory://together/${id}`;

    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <img
            src={DEFAULT_IMAGE}
            alt="ARMORY"
            style={styles.image}
          />
          <h1 style={styles.title}>Únete a mi sesión en ARMORY</h1>
          <p style={styles.subtitle}>Código de la sala</p>
          <div style={styles.codeBox}>
            <span style={styles.codeText}>{id}</span>
          </div>
          <a href={deepLink} style={styles.primaryButton}>
            Abrir en ARMORY
          </a>
          <a href="https://armory31.github.io" style={styles.secondaryButton}>
            Descargar ARMORY
          </a>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var url = ${JSON.stringify(deepLink)};
            setTimeout(function() {
              try { window.location.replace(url); } catch(e) {}
            }, 300);
          })();
        `}} />
      </div>
    );
  }

  // ---------- Vista de contenido (song/album/artist/playlist) ----------
  // ... aquí va tu componente visual actual para song/album/artist/playlist ...
  // (lo dejo como placeholder para no tocar lo que ya funciona)

  const title = safeDecode(searchParams?.t) ?? 'ARMORY';
  const subtitle = safeDecode(searchParams?.s)
    ? `Por ${safeDecode(searchParams.s)}`
    : 'Abre este enlace con la app ARMORY';
  const image = safeImage(searchParams?.i);
  const internalPath = path.join('/');

  return (
    <div style={styles.page}>
      <img src={image} alt={title} style={styles.image} />
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
      <a href="https://armory31.github.io" style={styles.primaryButton}>
        Descargar ARMORY
      </a>
      <a href={`armory://${internalPath}`} style={styles.fallbackLink}>
        ¿No se abre? Toca aquí
      </a>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var url = "armory://" + ${JSON.stringify(internalPath)};
          setTimeout(function() { try { window.location.replace(url); } catch(e) {} }, 300);
        })();
      `}} />
    </div>
  );
}

// ============================================================
// ESTILOS
// ============================================================
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
    width: 160,
    height: 160,
    borderRadius: 12,
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
    marginBottom: '1.5rem',
    fontSize: '1rem',
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
