import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // 여기에 허용할 이미지 도메인 목록을 추가합니다.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net", // ⚠️ 이 부분을 정확히 추가해야 합니다.
        port: "",
        pathname: "/harrypotter/images/**", // 필요에 따라 특정 경로를 지정할 수 있지만, 와일드카드를 사용하면 해당 도메인의 모든 이미지를 허용합니다.
      },
      {
        protocol: "https",
        hostname: "www.wizardingworld.com", // ⬅️ ⚠️ 새로 추가해야 할 도메인
        port: "",
        pathname: "/**", // 해당 도메인의 모든 경로 허용
      },
    ],
    // 이전에 images.domains를 사용했다면, Next.js 13.0.0 이후 버전에서는 remotePatterns를 사용하는 것이 권장됩니다.
    // 만약 이전 버전이라면 아래와 같이 사용할 수도 있습니다.
    // domains: ['static.wikia.nocookie.net'],
  },
};

export default nextConfig;
