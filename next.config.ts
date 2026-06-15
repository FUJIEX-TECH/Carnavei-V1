import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `node_modules` é um symlink para `node_modules.nosync` (mantido fora da
  // sincronização do iCloud). Sem fixar a raiz, o Turbopack tenta inferi-la
  // pelo symlink e falha ("couldn't find next/package.json"). Fixar resolve.
  turbopack: {
    root: import.meta.dirname,
  },
  // Permite acesso aos recursos de dev (HMR, chunks de hidratação) a partir
  // de dispositivos na rede local (ex: testar no iPhone via IP da LAN).
  // Sem isto, o Next 16 bloqueia os chunks → React não hidrata em mobile.
  allowedDevOrigins: [
    "192.168.1.22",
    "192.168.15.4",
    "tali.fujiex.com.br",
  ],
};

export default nextConfig;
