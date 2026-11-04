import Head from 'next/head'

export default function Share({ title, subtitle, image, type, id, path }) {
  const appUrl = `armory:/${path}`
  const webUrl = `https://armory31.github.io`

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} — ARMORY</title>

        {/* Open Graph para WhatsApp/Telegram/Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={subtitle} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="ARMORY" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={subtitle} />
        <meta name="twitter:image" content={image} />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: center;
          padding: 2rem;
        }
        .cover {
          width: 200px;
          height: 200px;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 40px rgba(201, 168, 76, 0.3);
          object-fit: cover;
        }
        h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #c9a84c;
          margin-bottom: 0.5rem;
          max-width: 400px;
        }
        p {
          color: #888;
          margin-bottom: 2.5rem;
          font-size: 1.1rem;
        }
        .btn {
          display: inline-block;
          padding: 1rem 3rem;
          background: #c9a84c;
          color: #0a0a0a;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          text-transform: uppercase;
          border-radius: 4px;
          box-shadow: 0 0 25px rgba(201, 168, 76, 0.4);
          transition: all 0.2s;
        }
        .btn:hover {
          background: #e0bc60;
          box-shadow: 0 0 35px rgba(201, 168, 76, 0.6);
        }
      `}</style>

      <img src={image} alt={title} className="cover" />
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <a href={webUrl} className="btn">Descargar ARMORY</a>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          try {
            var start = Date.now();
            window.location.href = '${appUrl}';
            setTimeout(function() {
              if (Date.now() - start < 2000) {
                // la app no estaba instalada, no redirigimos a ningún lado
              }
            }, 500);
          } catch(e) {}
        })();
      `}} />
    </>
  )
}

export async function getServerSideProps({ params, query }) {
  const path = '/' + (params.path || []).join('/')
  const type = (params.path || [])[0] || 'song'
  const id = (params.path || [])[1] || ''
  const title = query.t ? decodeURIComponent(query.t) : 'ARMORY'
  const subtitle = query.s ? `Por ${decodeURIComponent(query.s)}` : 'Abre este enlace con la app ARMORY'
  const image = query.i ? decodeURIComponent(query.i) : 'https://armory-19193.web.app/og-default.jpg'

  return { props: { title, subtitle, image, type, id, path } }
}
