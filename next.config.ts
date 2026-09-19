import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Proof-phase placeholder assets are local SVGs (public/proof/*).
    // Revisit when real product photography replaces these fixtures.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    // Next 16 deprecates bare `images.domains`; production media is
    // entirely local (CSS/SVG material compositions, Section 10 of the
    // production plan), so only localPatterns is needed, not remotePatterns.
    localPatterns: [{ pathname: "/proof/**" }, { pathname: "/catalog/**" }],
  },
};

export default nextConfig;
