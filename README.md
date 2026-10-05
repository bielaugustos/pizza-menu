# Pizzaria Choupana — site e pedidos online

Next.js + Supabase. O site tem duas páginas:

- `/` — **landing page** que apresenta a pizzaria (como pedir, cardápio, taxas de entrega, contato).
- `/pedido` — **cardápio e pedido**. O cliente monta o carrinho, preenche os dados de entrega,
  escolhe a forma de pagamento (dinheiro, cartão na entrega ou Pix) e o pedido abre no WhatsApp
  da pizzaria, já formatado. Se o Supabase estiver configurado, cada pedido também é salvo no banco.

## Instalação

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: só dígitos, com DDI (ex.: `5511999999999`)
   - `NEXT_PUBLIC_PIX_KEY` / `NEXT_PUBLIC_PIX_NAME`
   - URL e service role key do Supabase (opcional)
3. No Supabase, rode `supabase/schema.sql` no SQL editor.
4. `npm run dev` e abra http://localhost:3000

## O que personalizar

| Arquivo | O que muda |
|---|---|
| `lib/menu.ts` | **Cardápio e taxas de entrega de exemplo (placeholder).** Troque pelos valores reais. Alimenta a landing e a página de pedido. |
| `lib/site.ts` | Horário de abertura, endereço e horário detalhado da landing. Campos vazios não aparecem. |
| `public/fotos/` | Coloque fotos reais (`.jpg`, `.png`, `.webp`). A seção "Fotos" aparece sozinha na próxima publicação. |
| `app/landing.css` | Visual da landing (cores, tipografia, espaçamentos). |
| `app/globals.css` | Visual da página de pedido. |
| `app/page.tsx` | Textos da landing e a ilustração da pizza meio a meio. |

As fontes (Bowlby One e DM Sans) são carregadas do Google Fonts no navegador do visitante.
Se não carregarem, o site usa Impact e a fonte padrão do sistema.

## Segurança

- Preços e totais são recalculados no servidor (`app/api/orders/route.ts`); preços enviados pelo navegador são ignorados.
- `SUPABASE_SERVICE_ROLE_KEY` só é usada no servidor. Nunca use o prefixo `NEXT_PUBLIC_` nela.

## Próximos passos

- Painel de administração para ver pedidos e mudar o status (`recebido` → `entregue`).
- Pix dinâmico com QR code via provedor (Mercado Pago, Asaas), com confirmação automática.
- Mensagens automáticas de status para o cliente (WhatsApp Business API).
- Publicar na Vercel.
