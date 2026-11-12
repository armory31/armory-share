'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const PACKAGE = 'com.ruben.spotitube';
const INSTALL_URL = 'https://armory31.github.io';
const OG_IMAGE = 'https://armory-19193.web.app/og-default.jpg';

type Phase = 'idle' | 'launching' | 'opened' | 'stalled';

export default function TogetherJoin({ code }: { code: string }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [copied, setCopied] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [mounted, setMounted] = useState(false);

  const timers = useRef<number[]>([]);
  const attempted = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const push = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const intentUrl =
    `intent://together/${code}#Intent;scheme=armory;package=${PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(INSTALL_URL)};end`;

  const launch = useCallback(() => {
    clearTimers();
    setPhase('launching');
    attempted.current = true;

    try {
      window.location.href = intentUrl;
    } catch {
      window.location.href = `armory://together/${code}`;
    }

    push(() => {
      if (!document.hidden) setPhase('stalled');
    }, 1900);
  }, [clearTimers, code, intentUrl, push]);

  useEffect(() => {
    setMounted(true);
    const ua = navigator.userAgent || '';
    const embedded = /WhatsApp|FBAN|FBAV|Instagram|Line\/|MicroMessenger/i.test(ua);
    setInApp(embedded);

    const onVisibility = () => {
      if (document.hidden && attempted.current) {
        clearTimers();
        setPhase('opened');
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onVisibility);

    if (!embedded) {
      timers.current.push(
        window.setTimeout(() => {
          if (!attempted.current) launch();
        }, 700)
      );
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onVisibility);
      clearTimers();
    };
  }, [clearTimers, launch]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    push(() => setCopied(false), 2000);
  }, [code, push]);

  const digits = code.split('');
  const showHelp = inApp || phase === 'stalled';

  return (
    <div className={`tg-root${mounted ? ' tg-in' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="tg-bg" aria-hidden="true">
        <div className="tg-aurora tg-aurora-a" />
        <div className="tg-aurora tg-aurora-b" />
        <div className="tg-grid" />
        <div className="tg-grain" />
        <div className="tg-vignette" />
      </div>

      <header className="tg-top">
        <div className="tg-brand">
          <svg viewBox="0 0 32 32" className="tg-mark" aria-hidden="true">
            <defs>
              <linearGradient id="tgg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F2DFA0" />
                <stop offset="45%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#8A6F2A" />
              </linearGradient>
            </defs>
            <path
              d="M16 2.5 27.5 7v10.2c0 6.6-4.7 10.9-11.5 12.3C9.2 28.1 4.5 23.8 4.5 17.2V7L16 2.5Z"
              fill="none" stroke="url(#tgg)" strokeWidth="1.6"
            />
            <path d="M11.4 21.5 16 10.2l4.6 11.3" fill="none" stroke="url(#tgg)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.2 17.6h5.6" stroke="url(#tgg)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="tg-wordmark">ARMORY</span>
        </div>
        <div className="tg-live">
          <span className="tg-dot" />
          SESIÓN EN DIRECTO
        </div>
      </header>

      <main className="tg-main">
        <section className="tg-card">
          <div className="tg-sheen" aria-hidden="true" />

          <p className="tg-eyebrow">ESCUCHA COMPARTIDA</p>
          <h1 className="tg-title">Únete a mi sesión</h1>
          <p className="tg-sub">
            La misma canción, al mismo segundo. Sin anuncios, sin cortes.
          </p>

          <div className="tg-codeblock">
            <div className="tg-codehead">
              <span className="tg-codelabel">CÓDIGO DE SALA</span>
              <button
                type="button"
                onClick={copyCode}
                className={`tg-copy${copied ? ' is-copied' : ''}`}
                aria-label="Copiar código de sala"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                      <path d="M4 10.5 8 14.5 16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copiado
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                      <rect x="7" y="3" width="10" height="12" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M13 17H5a2 2 0 0 1-2-2V7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>

            <div className="tg-digits" role="text" aria-label={`Código ${code}`}>
              {digits.map((d, i) => (
                <span className="tg-digit" style={{ animationDelay: `${140 + i * 55}ms` }} key={i}>
                  <span className="tg-digit-inner">{d}</span>
                </span>
              ))}
            </div>
          </div>

          <button type="button" onClick={launch} className="tg-cta">
            <span className="tg-cta-shine" aria-hidden="true" />
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
            </svg>
            {phase === 'launching' ? 'Abriendo ARMORY…' : 'Abrir en ARMORY'}
          </button>

          <p className={`tg-status tg-status-${phase}`} role="status" aria-live="polite">
            {phase === 'opened' && '✓ ARMORY abierto. Uniéndote a la sala…'}
            {phase === 'launching' && 'Conectando con la app…'}
            {phase === 'stalled' && 'No se pudo abrir automáticamente. Usa las opciones de abajo.'}
            {phase === 'idle' && (inApp ? 'Pulsa el botón para abrir la app.' : 'Preparando el enlace…')}
          </p>

          {showHelp && (
            <div className="tg-help">
              {inApp && (
                <div className="tg-helprow">
                  <span className="tg-helpnum">1</span>
                  <p>
                    Estás dentro del navegador de la app de mensajería y no puede abrir ARMORY.
                    Toca el menú <strong>⋮</strong> arriba a la derecha y elige
                    <strong> «Abrir en Chrome»</strong> (o «Abrir en el navegador»).
                  </p>
                </div>
              )}
              <div className="tg-helprow">
                <span className="tg-helpnum">{inApp ? '2' : '1'}</span>
                <p>
                  Si ya tienes ARMORY, ábrela, entra en <strong>Together → Unirse</strong> y
                  escribe el código <strong className="tg-inlinecode">{code}</strong>.
                </p>
              </div>
            </div>
          )}

          <div className="tg-divider"><span>¿Aún no tienes ARMORY?</span></div>

          <a href={INSTALL_URL} className="tg-install" target="_blank" rel="noopener noreferrer">
            <img src={OG_IMAGE} alt="" className="tg-installart" />
            <span className="tg-installtext">
              <strong>Instalar ARMORY</strong>
              <em>APK firmado · Gratis · Sin anuncios</em>
            </span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="tg-installarrow">
              <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </section>

        <ul className="tg-chips">
          <li><span className="tg-chipdot" />Sincronización en tiempo real</li>
          <li><span className="tg-chipdot" />Streaming de alta fidelidad</li>
          <li><span className="tg-chipdot" />100% libre de anuncios</li>
        </ul>
      </main>

      <footer className="tg-foot">
        ARMORY · Música blindada en oro y titanio
      </footer>
    </div>
  );
}

const CSS = `
.tg-root{
  --bg:#07070A; --surface:#101015; --surface-2:#16161C; --line:#26262F;
  --gold:#C9A84C; --gold-hi:#F2DFA0; --gold-lo:#8A6F2A; --amber:#E0A33A;
  --ti:#9BA3AE; --ti-hi:#D6DBE2; --live:#4ADE80; --warn:#F5A524; --danger:#EF4444; --info:#60A5FA;
  position:relative; min-height:100dvh; background:var(--bg); color:var(--ti-hi);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  display:flex; flex-direction:column; overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.tg-root *{box-sizing:border-box;}
.tg-root ::selection{background:rgba(201,168,76,.32);color:#fff;}
.tg-root ::-webkit-scrollbar{width:10px;height:10px;}
.tg-root ::-webkit-scrollbar-track{background:#0C0C11;}
.tg-root ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,var(--gold-lo),#3A3020);border-radius:99px;border:2px solid #0C0C11;}
.tg-root ::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,var(--gold),var(--gold-lo));}

.tg-bg{position:fixed;inset:0;pointer-events:none;z-index:0;}
.tg-aurora{position:absolute;border-radius:50%;filter:blur(90px);opacity:.5;}
.tg-aurora-a{width:60vw;height:60vw;max-width:680px;max-height:680px;top:-22vw;left:-14vw;
  background:radial-gradient(circle at 40% 40%,rgba(201,168,76,.42),rgba(224,163,58,.14) 55%,transparent 72%);
  animation:tgFloatA 22s ease-in-out infinite;}
.tg-aurora-b{width:52vw;height:52vw;max-width:560px;max-height:560px;bottom:-20vw;right:-12vw;
  background:radial-gradient(circle at 60% 50%,rgba(96,165,250,.20),rgba(155,163,174,.12) 55%,transparent 74%);
  animation:tgFloatB 27s ease-in-out infinite;}
@keyframes tgFloatA{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(5%,7%,0) scale(1.12)}}
@keyframes tgFloatB{0%,100%{transform:translate3d(0,0,0) scale(1.05)}50%{transform:translate3d(-6%,-5%,0) scale(.94)}}
.tg-grid{position:absolute;inset:0;opacity:.30;
  background-image:linear-gradient(rgba(201,168,76,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.055) 1px,transparent 1px);
  background-size:56px 56px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 40%,#000 30%,transparent 78%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%,#000 30%,transparent 78%);}
.tg-grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.tg-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 45%,transparent 40%,rgba(0,0,0,.72) 100%);}

.tg-top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;
  gap:16px;padding:22px clamp(18px,5vw,44px);flex-wrap:wrap;}
.tg-brand{display:flex;align-items:center;gap:11px;}
.tg-mark{width:30px;height:30px;filter:drop-shadow(0 0 10px rgba(201,168,76,.45));}
.tg-wordmark{font-size:15px;font-weight:800;letter-spacing:.34em;
  background:linear-gradient(100deg,var(--gold-hi),var(--gold) 45%,var(--gold-lo));
  -webkit-background-clip:text;background-clip:text;color:transparent;}
.tg-live{display:inline-flex;align-items:center;gap:8px;font-size:10.5px;font-weight:700;letter-spacing:.18em;
  color:#B9E9CD;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.28);
  padding:7px 13px;border-radius:99px;}
.tg-dot{width:7px;height:7px;border-radius:50%;background:var(--live);box-shadow:0 0 0 0 rgba(74,222,128,.6);animation:tgPulse 2s infinite;}
@keyframes tgPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,.55)}70%{box-shadow:0 0 0 9px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}

.tg-main{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:8px clamp(16px,5vw,44px) 34px;gap:22px;}

.tg-card{position:relative;width:100%;max-width:520px;padding:clamp(26px,5vw,40px);
  border-radius:22px;border:1px solid var(--line);overflow:hidden;text-align:center;
  background:linear-gradient(168deg,rgba(28,28,36,.94),rgba(12,12,17,.97));
  box-shadow:0 34px 90px -30px rgba(0,0,0,.95),0 0 0 1px rgba(201,168,76,.10) inset,0 1px 0 rgba(255,255,255,.05) inset;
  opacity:0;transform:translateY(22px);animation:tgRise .75s cubic-bezier(.2,.8,.25,1) .05s forwards;}
@keyframes tgRise{to{opacity:1;transform:none}}
.tg-sheen{position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(242,223,160,.75),rgba(201,168,76,.35),transparent);}

.tg-eyebrow{margin:0 0 12px;font-size:10.5px;font-weight:700;letter-spacing:.26em;color:var(--gold);}
.tg-title{margin:0 0 10px;font-size:clamp(27px,6.4vw,36px);line-height:1.1;font-weight:800;letter-spacing:-.02em;
  background:linear-gradient(180deg,#FFFFFF,#C6CCD6);-webkit-background-clip:text;background-clip:text;color:transparent;}
.tg-sub{margin:0 auto 26px;max-width:38ch;font-size:14.5px;line-height:1.6;color:var(--ti);}

.tg-codeblock{border:1px solid rgba(201,168,76,.24);border-radius:16px;padding:16px 16px 18px;margin-bottom:24px;
  background:linear-gradient(180deg,rgba(201,168,76,.07),rgba(201,168,76,.015));}
.tg-codehead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;}
.tg-codelabel{font-size:9.5px;font-weight:700;letter-spacing:.22em;color:var(--gold-lo);}
.tg-copy{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:11.5px;font-weight:600;
  color:var(--ti-hi);background:rgba(255,255,255,.05);border:1px solid var(--line);
  padding:6px 11px;border-radius:8px;cursor:pointer;transition:.18s ease;}
.tg-copy:hover{border-color:rgba(201,168,76,.5);color:var(--gold-hi);background:rgba(201,168,76,.10);}
.tg-copy:focus-visible{outline:2px solid var(--gold);outline-offset:2px;}
.tg-copy.is-copied{color:#0B0B0F;background:var(--live);border-color:var(--live);}

.tg-digits{display:flex;justify-content:center;gap:clamp(5px,1.6vw,9px);}
.tg-digit{flex:1 1 0;min-width:0;max-width:62px;aspect-ratio:3/4;display:grid;place-items:center;
  border-radius:11px;border:1px solid rgba(201,168,76,.26);
  background:linear-gradient(180deg,#1B1B22,#0D0D12);
  box-shadow:0 6px 16px -8px rgba(0,0,0,.9),0 1px 0 rgba(255,255,255,.05) inset;
  opacity:0;transform:translateY(12px) scale(.94);animation:tgDigit .5s cubic-bezier(.2,.8,.25,1) forwards;}
@keyframes tgDigit{to{opacity:1;transform:none}}
.tg-digit-inner{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:clamp(24px,7vw,34px);font-weight:700;line-height:1;
  background:linear-gradient(180deg,var(--gold-hi),var(--gold) 60%,var(--gold-lo));
  -webkit-background-clip:text;background-clip:text;color:transparent;}

.tg-cta{position:relative;width:100%;display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font:inherit;font-size:15px;font-weight:800;letter-spacing:.04em;color:#0A0A0C;
  padding:16px 24px;border:none;border-radius:13px;cursor:pointer;overflow:hidden;
  background:linear-gradient(100deg,var(--gold-hi),var(--gold) 42%,var(--amber));
  box-shadow:0 14px 34px -12px rgba(201,168,76,.7),0 1px 0 rgba(255,255,255,.5) inset;
  transition:transform .16s ease,box-shadow .16s ease,filter .16s ease;}
.tg-cta:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 20px 44px -12px rgba(201,168,76,.85),0 1px 0 rgba(255,255,255,.55) inset;}
.tg-cta:active{transform:translateY(0) scale(.99);}
.tg-cta:focus-visible{outline:2px solid var(--gold-hi);outline-offset:3px;}
.tg-cta-shine{position:absolute;top:0;bottom:0;width:45%;left:-60%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);
  transform:skewX(-18deg);animation:tgShine 3.6s ease-in-out infinite;}
@keyframes tgShine{0%{left:-60%}55%,100%{left:130%}}

.tg-status{margin:14px 0 0;font-size:12.5px;line-height:1.5;min-height:19px;color:var(--ti);}
.tg-status-opened{color:var(--live);}
.tg-status-stalled{color:var(--warn);}
.tg-status-launching{color:var(--gold);}

.tg-help{margin-top:18px;text-align:left;border:1px solid rgba(245,165,36,.26);border-radius:13px;
  background:rgba(245,165,36,.06);padding:15px 16px;display:flex;flex-direction:column;gap:12px;
  animation:tgRise .4s ease forwards;}
.tg-helprow{display:flex;gap:11px;align-items:flex-start;}
.tg-helpnum{flex:0 0 auto;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;
  font-size:11px;font-weight:800;color:#0A0A0C;background:var(--warn);margin-top:1px;}
.tg-help p{margin:0;font-size:12.8px;line-height:1.6;color:#D9C9A8;}
.tg-help strong{color:var(--gold-hi);font-weight:700;}
.tg-inlinecode{font-family:ui-monospace,Menlo,monospace;letter-spacing:.1em;}

.tg-divider{display:flex;align-items:center;gap:12px;margin:26px 0 16px;
  font-size:10.5px;letter-spacing:.16em;font-weight:600;color:#5C626E;}
.tg-divider::before,.tg-divider::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--line),transparent);}

.tg-install{display:flex;align-items:center;gap:13px;text-decoration:none;padding:12px 14px;border-radius:13px;
  border:1px solid var(--line);background:rgba(255,255,255,.028);transition:.18s ease;text-align:left;}
.tg-install:hover{border-color:rgba(201,168,76,.45);background:rgba(201,168,76,.075);transform:translateY(-1px);}
.tg-install:focus-visible{outline:2px solid var(--gold);outline-offset:2px;}
.tg-installart{width:42px;height:42px;border-radius:10px;object-fit:cover;flex:0 0 auto;border:1px solid rgba(201,168,76,.25);}
.tg-installtext{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;}
.tg-installtext strong{font-size:13.5px;font-weight:700;color:var(--ti-hi);}
.tg-installtext em{font-style:normal;font-size:11px;color:#6E7480;}
.tg-installarrow{color:var(--gold);flex:0 0 auto;}

.tg-chips{position:relative;z-index:2;list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;
  justify-content:center;gap:9px;max-width:560px;}
.tg-chips li{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;color:#8A919D;
  border:1px solid var(--line);background:rgba(255,255,255,.022);padding:7px 13px;border-radius:99px;}
.tg-chipdot{width:5px;height:5px;border-radius:50%;background:linear-gradient(180deg,var(--gold-hi),var(--gold-lo));}

.tg-foot{position:relative;z-index:2;text-align:center;padding:20px 18px 26px;
  font-size:10.5px;letter-spacing:.14em;color:#4E545F;}

@media (max-width:400px){
  .tg-card{padding:22px 18px;border-radius:18px;}
  .tg-codeblock{padding:13px 12px 15px;}
  .tg-top{padding:18px;}
}
@media (prefers-reduced-motion:reduce){
  .tg-root *,.tg-root *::before,.tg-root *::after{animation:none!important;transition:none!important;}
  .tg-card,.tg-digit{opacity:1!important;transform:none!important;}
}
`;
