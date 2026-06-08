import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acesso aos recursos de dev (HMR, chunks de hidratação) a partir
  // de dispositivos na rede local (ex: testar no iPhone via IP da LAN).
  // Sem isto, o Next 16 bloqueia os chunks → React não hidrata em mobile.
  allowedDevOrigins: ["192.168.1.22"],
};

export default nextConfig;
