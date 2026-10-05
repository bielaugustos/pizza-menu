// Informações usadas na landing page. Preencha o que estiver vazio:
// campos vazios simplesmente não aparecem no site.
export const SITE = {
  name: "Pizzaria Choupana",

  // Vem do .env.local (NEXT_PUBLIC_WHATSAPP_NUMBER). Sem ele, o botão de WhatsApp não aparece.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",

  // Horário em que a pizzaria começa a atender (aparece nos textos da landing).
  opensAt: "18h",

  // Exemplos: "Rua das Flores, 120, Centro, Cidade - SP"
  address: "",
  // Exemplos: "Terça a domingo, a partir das 18h" (confirme os dias com a pizzaria)
  hours: "",

  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Pizzaria Choupana"),
};
