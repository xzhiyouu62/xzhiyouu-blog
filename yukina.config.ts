import I18nKeys from "./src/locales/keys";
import type { Configuration } from "./src/types/config";

const YukinaConfig: Configuration = {
  title: "Xzhiyouu's Blog",
  subTitle: "This space is a record of quiet effort.",
  brandTitle: "xzhiyouu",

  description: "Personal Blog",

  site: "https://yukina-blog.vercel.app",

  locale: "en", // set for website language and date format

  navigators: [
    {
      nameKey: I18nKeys.nav_bar_home,
      href: "/",
    },
    {
      nameKey: I18nKeys.nav_bar_archive,
      href: "/archive",
    },
    {
      nameKey: I18nKeys.nav_bar_about,
      href: "/about",
    },
    {
      nameKey: I18nKeys.nav_bar_github,
      href: "https://github.com/xzhiyouu62",
    },
    {
      nameKey: I18nKeys.nav_bar_flag,
      href: "/flag",
      hidden: true,
    }
  ],

  username: "xzhiyouu",
  sign: "A high school student learning cybersecurity.",
  avatarUrl: "https://scontent.ftpe8-3.fna.fbcdn.net/v/t39.30808-6/495081349_1956045761870905_221920331418930353_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ly-1NafnawUQ7kNvwG795YS&_nc_oc=AdlIo9ZdAL-ZWDaXNJqb6hY1oHiXKpNabdZJD-SWbVPqe8S0nVyK_wjeeJyhB0Ajywc&_nc_zt=23&_nc_ht=scontent.ftpe8-3.fna&_nc_gid=tE5iXuUfitlKZV9rnbXK9w&oh=00_AfOgbwws_r7onjMbAzyn2zaa8qBByauSAQWmJ6u3uItHIw&oe=684CDCDB",
  socialLinks: [
    {
      icon: "line-md:github-loop",
      link: "https://github.com/xzhiyouu62",
    },
  {
    icon: "mingcute:facebook-line", 
    link: "https://www.facebook.com/nelson.hsieh.2025/",
  },
  {
    icon: "mingcute:instagram-line", 
    link: "https://www.instagram.com/xzhiyouu/",
  },
  ],
  maxSidebarCategoryChip: 6, // It is recommended to set it to a common multiple of 2 and 3
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,

  banners: [
    "https://i.pinimg.com/736x/1c/68/6e/1c686eea5580f43241c7fc23df12e698.jpg",
    "https://i.pinimg.com/736x/e7/95/81/e7958142b5a4135a5494ceecd6016fb0.jpg",
    "https://i.pinimg.com/736x/2e/40/dc/2e40dc63dacbb648982ddc2589a76356.jpg",
    "https://i.pinimg.com/736x/a1/b2/dd/a1b2dd33e636981158b4b5b689896bed.jpg",
    "https://i.pinimg.com/736x/ca/92/30/ca923012f2da62ba5ba20a99e6c0ff91.jpg",
    "https://i.pinimg.com/736x/7f/f7/1e/7ff71e6d41a30a3e9058c91da4330760.jpg",
    "https://i.pinimg.com/736x/aa/98/4d/aa984df5a8ce94689588b835a8754fd4.jpg",
    "https://i.pinimg.com/736x/06/62/58/066258b891c677c7276a730c51a549c7.jpg",
  ],

  slugMode: "HASH", // 'RAW' | 'HASH'

  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },

  // WIP functions
  bannerStyle: "LOOP", // 'loop' | 'static' | 'hidden'
};

export default YukinaConfig;
