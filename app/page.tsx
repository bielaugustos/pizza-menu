import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import "./landing.css";
import { CATEGORIES, DELIVERY_AREAS, MENU, brl } from "@/lib/menu";
import { SITE } from "@/lib/site";

// Fotos reais: coloque arquivos .jpg/.png/.webp em public/fotos e a seção aparece sozinha.
function listPhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "fotos");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .slice(0, 9)
      .map((f) => `/fotos/${f}`);
  } catch {
    return [];
  }
}

// Ponto em coordenadas polares a partir do centro da pizza (200, 200).
const pt = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: +(200 + r * Math.cos(a)).toFixed(1), y: +(200 + r * Math.sin(a)).toFixed(1) };
};

// [raio, ângulo] — metade esquerda fica entre 100° e 260°, metade direita entre -80° e 80°.
const LEFT_MELT: [number, number][] = [[40, 140], [90, 150], [70, 200], [120, 170], [50, 230], [110, 250], [140, 222], [30, 180]];
const LEFT_PEPPERS: [number, number, number][] = [[128, 132, 20], [84, 172, -30], [122, 198, 60], [62, 244, 10], [130, 236, -50]];
const LEFT_OLIVES: [number, number][] = [[62, 150], [112, 185], [90, 225], [138, 205], [100, 122]];
const RIGHT_SLICES: [number, number][] = [[60, 0], [110, 40], [100, -40], [70, 76], [75, -74], [142, 16], [150, -22]];
const RIGHT_ONIONS: [number, number][] = [[90, 20], [70, -30], [128, 56], [125, -62], [115, 5], [100, 80], [40, -70]];
const RIGHT_OLIVES: [number, number][] = [[46, 32], [140, -50]];
const SPECKS: [number, number][] = Array.from({ length: 30 }, (_, i) => [30 + ((i * 37) % 130), (i * 67) % 360]);

function Olive({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="11" fill="#6b7a2a" />
      <circle r="4.5" fill="#d9a050" />
    </g>
  );
}

function Specks() {
  return (
    <>
      {SPECKS.map(([r, d], i) => {
        const { x, y } = pt(r, d);
        return <circle key={i} cx={x} cy={y} r="1.8" fill="#3d5a1f" />;
      })}
    </>
  );
}

function Pizza() {
  return (
    <svg
      className="cp-pizza"
      viewBox="0 0 400 410"
      role="img"
      aria-label="Pizza meio a meio: metade mussarela com pimentão e azeitonas, metade calabresa com cebola"
    >
      <defs>
        <clipPath id="cp-clip-l">
          <rect x="0" y="0" width="197" height="410" />
        </clipPath>
        <clipPath id="cp-clip-r">
          <rect x="203" y="0" width="197" height="410" />
        </clipPath>
      </defs>
      <ellipse cx="200" cy="402" rx="150" ry="8" fill="rgba(0,0,0,0.28)" />

      <g className="cp-half-l" clipPath="url(#cp-clip-l)">
        <path d="M200 8 A192 192 0 0 0 200 392 Z" fill="#d9a050" />
        <path d="M200 30 A170 170 0 0 0 200 370 Z" fill="#f2c85a" />
        {LEFT_MELT.map(([r, d], i) => {
          const { x, y } = pt(r, d);
          return <circle key={i} cx={x} cy={y} r={i % 2 ? 9 : 14} fill={i % 2 ? "#e3b043" : "#f8dc86"} opacity="0.8" />;
        })}
        {LEFT_PEPPERS.map(([r, d, rot], i) => {
          const { x, y } = pt(r, d);
          return (
            <path
              key={i}
              d="M-17 0 q17 -17 34 0"
              transform={`translate(${x} ${y}) rotate(${rot})`}
              fill="none"
              stroke="#e8761e"
              strokeWidth="9"
              strokeLinecap="round"
            />
          );
        })}
        {LEFT_OLIVES.map(([r, d], i) => (
          <Olive key={i} {...pt(r, d)} />
        ))}
        <Specks />
      </g>

      <g className="cp-half-r" clipPath="url(#cp-clip-r)">
        <path d="M200 8 A192 192 0 0 1 200 392 Z" fill="#d9a050" />
        <path d="M200 30 A170 170 0 0 1 200 370 Z" fill="#f2c85a" />
        {RIGHT_SLICES.map(([r, d], i) => {
          const { x, y } = pt(r, d);
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="21" fill="#b5332d" stroke="#8f2420" strokeWidth="3" />
              <circle cx="-6" cy="-5" r="3" fill="#d4605a" />
              <circle cx="7" cy="-3" r="2.5" fill="#d4605a" />
              <circle cx="1" cy="8" r="3" fill="#d4605a" />
            </g>
          );
        })}
        {RIGHT_ONIONS.map(([r, d], i) => {
          const { x, y } = pt(r, d);
          return (
            <path
              key={i}
              d="M-18 0 a18 18 0 0 1 36 0"
              transform={`translate(${x} ${y}) rotate(${i * 47})`}
              fill="none"
              stroke="#f6efe2"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          );
        })}
        {RIGHT_OLIVES.map(([r, d], i) => (
          <Olive key={i} {...pt(r, d)} />
        ))}
        <Specks />
      </g>
    </svg>
  );
}

const STEPS = [
  { title: "Escolha os sabores", text: "Veja o cardápio e monte o pedido. Também dá para pedir meio a meio." },
  { title: "Informe a entrega", text: "Endereço e bairro. A taxa aparece antes de você enviar." },
  { title: "Mande pelo WhatsApp", text: "O pedido chega pronto para a pizzaria. Pague em dinheiro, cartão ou Pix." },
];

export default function Landing() {
  const photos = listPhotos();
  const whatsappLink = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Olá! Vim pelo site da ${SITE.name}.`)}`
    : null;

  const order = ["steps", "menu", "delivery", ...(photos.length > 0 ? ["photos"] : []), "contact"];
  const tone = (id: string) => (order.indexOf(id) % 2 === 1 ? "cp-section cp-alt" : "cp-section");

  const pizzas = MENU.filter((p) => p.category === "Pizzas");
  const others = CATEGORIES.filter((c) => c !== "Pizzas");

  return (
    <div className="cp">
      <header className="cp-hero">
        <div className="cp-inner">
          <nav className="cp-nav" aria-label="Principal">
            <span className="cp-brand">{SITE.name}</span>
            <div className="cp-nav-links">
              <a className="cp-nav-link" href="#cardapio">
                Cardápio
              </a>
              <a className="cp-nav-link" href="#entrega">
                Entrega
              </a>
              <Link className="cp-btn cp-btn-cheese cp-btn-small" href="/pedido">
                Fazer pedido
              </Link>
            </div>
          </nav>

          <div className="cp-hero-grid">
            <div>
              <h1 className="cp-h1">Pizza quente na sua porta</h1>
              <p className="cp-lead">
                Monte o pedido no site, envie pelo WhatsApp e pague do jeito que preferir. Atendemos a partir das{" "}
                {SITE.opensAt}.
              </p>
              <div className="cp-cta">
                <Link className="cp-btn cp-btn-cheese" href="/pedido">
                  Fazer pedido
                </Link>
                <a className="cp-btn cp-btn-ghost" href="#cardapio">
                  Ver cardápio
                </a>
              </div>
            </div>
            <figure className="cp-figure">
              <Pizza />
              <figcaption className="cp-caption">Meio a meio: mussarela de um lado, calabresa do outro.</figcaption>
            </figure>
          </div>
        </div>
      </header>

      <div className="cp-strip">
        <ul className="cp-inner cp-strip-list">
          <li>Delivery de pizza</li>
          <li>Atendemos a partir das {SITE.opensAt}</li>
          <li>Pague em dinheiro, cartão ou Pix</li>
        </ul>
      </div>

      <main>
        <section className={tone("steps")} id="como-pedir">
          <div className="cp-inner">
            <h2 className="cp-h2">Peça em três passos</h2>
            <ol className="cp-steps">
              {STEPS.map((s, i) => (
                <li className="cp-step" key={s.title}>
                  <span className="cp-step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="cp-step-title">{s.title}</h3>
                  <p className="cp-step-text">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={tone("menu")} id="cardapio">
          <div className="cp-inner">
            <h2 className="cp-h2">Cardápio</h2>
            <p className="cp-intro">Os mesmos itens da página de pedido.</p>
            <div className="cp-menu">
              <div>
                <h3 className="cp-h3">Pizzas</h3>
                <ul className="cp-rows">
                  {pizzas.map((p) => (
                    <li key={p.id}>
                      <div className="cp-row">
                        <span className="cp-name">{p.name}</span>
                        <span className="cp-price">{brl(p.price)}</span>
                      </div>
                      {p.description && <p className="cp-desc">{p.description}</p>}
                    </li>
                  ))}
                </ul>
                <p className="cp-callout">Não consegue escolher? Peça meio a meio: dois sabores na mesma pizza.</p>
              </div>
              <div>
                {others.map((cat) => (
                  <div key={cat} className="cp-group">
                    <h3 className="cp-h3">{cat}</h3>
                    <ul className="cp-rows">
                      {MENU.filter((p) => p.category === cat).map((p) => (
                        <li key={p.id}>
                          <div className="cp-row">
                            <span className="cp-name">{p.name}</span>
                            <span className="cp-price">{brl(p.price)}</span>
                          </div>
                          {p.description && <p className="cp-desc">{p.description}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <p className="cp-block-cta">
              <Link className="cp-btn cp-btn-tomato" href="/pedido">
                Fazer pedido
              </Link>
            </p>
          </div>
        </section>

        <section className={tone("delivery")} id="entrega">
          <div className="cp-inner cp-split">
            <div>
              <h2 className="cp-h2">Onde entregamos</h2>
              <p className="cp-intro">A taxa depende do bairro e aparece no pedido antes de você enviar.</p>
            </div>
            <ul className="cp-rows">
              {DELIVERY_AREAS.map((a) => (
                <li key={a.name}>
                  <div className="cp-row">
                    <span className="cp-name">{a.name}</span>
                    <span className="cp-price">{brl(a.fee)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {photos.length > 0 && (
          <section className={tone("photos")} id="fotos">
            <div className="cp-inner">
              <h2 className="cp-h2">Fotos</h2>
              <div className="cp-photos">
                {photos.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt={`Foto ${i + 1} da pizzaria`} loading="lazy" />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={tone("contact")} id="contato">
          <div className="cp-inner cp-split">
            <div>
              <h2 className="cp-h2">Fale com a gente</h2>
              <p className="cp-intro">Dúvida sobre sabores, prazo ou entrega? Mande uma mensagem.</p>
              <div className="cp-cta cp-cta-dark">
                {whatsappLink && (
                  <a className="cp-btn cp-btn-tomato" href={whatsappLink} target="_blank" rel="noreferrer">
                    Chamar no WhatsApp
                  </a>
                )}
                <a
                  className={whatsappLink ? "cp-btn cp-btn-outline" : "cp-btn cp-btn-tomato"}
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no Google Maps
                </a>
              </div>
            </div>
            {(SITE.address || SITE.hours) && (
              <dl className="cp-facts">
                {SITE.address && (
                  <div className="cp-fact">
                    <dt className="cp-fact-title">Endereço</dt>
                    <dd className="cp-fact-text">{SITE.address}</dd>
                  </div>
                )}
                {SITE.hours && (
                  <div className="cp-fact">
                    <dt className="cp-fact-title">Horário</dt>
                    <dd className="cp-fact-text">{SITE.hours}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </section>

        <section className="cp-final">
          <div className="cp-inner">
            <h2 className="cp-h2 cp-h2-light">A pizza sai quando o pedido chega</h2>
            <p className="cp-final-text">
              Escolha os sabores, informe o endereço e envie para o WhatsApp da pizzaria.
            </p>
            <Link className="cp-btn cp-btn-cheese" href="/pedido">
              Fazer pedido
            </Link>
          </div>
        </section>
      </main>

      <footer className="cp-footer">
        <div className="cp-inner">
          <p>{SITE.name}. Pedidos pelo site e pelo WhatsApp.</p>
        </div>
      </footer>
    </div>
  );
}
