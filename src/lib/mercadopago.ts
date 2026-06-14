import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const mpPayment = new Payment(mp);
export const mpPreference = new Preference(mp);
