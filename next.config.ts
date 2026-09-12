import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // firebase-admin يستخدم require ديناميكي لا يتوافق مع تجميع Next.js للسيرفر —
  // لازم يستثنى ويُحمّل مباشرة من node_modules وقت التشغيل، وإلا يفشل على Vercel
  // بخطأ "Failed to load external module firebase-admin".
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
    localPatterns: [{ pathname: "/placeholder" }, { pathname: "/images/**" }],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // ImgBB بطيء جداً بالاستجابة أحياناً (7-40 ثانية)، مما يسبب فشل خادم تحسين الصور
    // في Next.js (مهلته الزمنية أقصر من ذلك). نعطّل التحسين مؤقتاً حتى ننتقل لاستضافة أسرع.
    unoptimized: true,
  },
};

export default nextConfig;
