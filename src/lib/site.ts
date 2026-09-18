export const site = {
  name: "garden",
  author: "cosine",
  description: "记录用的网站",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "",
  instagram: "",
  socials: [
    {
      name: "GitHub",
      icon: "/images/social/github-cute.svg",
      url: "https://github.com/c0sc0s",
    },
    {
      name: "Bilibili",
      icon: "/images/social/bilibili-cute.svg",
      url: "https://space.bilibili.com/180492401",
    },
    {
      name: "Twitter",
      icon: "/images/social/twitter-cute.svg",
      url: "https://x.com/020307cosine",
    },
  ],
  portrait: "/images/cosine-portrait-car.png",
  portraitAlt: "好久以前的照片了...曾经还很瘦很帅",
  about: [
    "Hi，这里是文杰。曾经是最年轻的一代（00后），如今也即将跨入中登的行列。",
    "毕业至今在 TikTok 直播工作，平时靠代码 💻（其实是靠鞭策 Agent）维持生计，最大的爱好是电子游戏，有一个无无无敌的电竞房,拥有大部分旗舰游戏设备。",
    "这个博客没有固定的主题，主要关于我的生活和我的认知。",
  ],
};
