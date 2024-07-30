// https://github.com/nuxt-themes/docus/blob/main/nuxt.schema.ts
export default defineAppConfig({
  docus: {
    title: "LicenseAPI",
    description: "The best place to start your documentation.",
    socials: {
      github: "gnmyt/LicenseAPI"
    },
    github: {
      dir: "docs/content",
      branch: "main",
      repo: "LicenseAPI",
      owner: "gnmyt",
      edit: true
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },
    main: {
      padded: true,
      fluid: true
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true
    }
  }
})
