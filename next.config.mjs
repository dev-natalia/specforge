/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Export estático: gera um site 100% estático em `out/`, sem servidor/funções.
  // Pode ser hospedado de graça em Cloudflare Pages, GitHub Pages, Netlify, etc.
  output: "export",
};

export default nextConfig;
