// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const isDev = process.env.NODE_ENV === "development";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "View3D",
  tagline: "Fast & customizable 3D model viewer for everyone based on three.js & typescript",
  url: "https://naver.github.io",
  baseUrl: isDev ? "/" : "/egjs-view3d/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "naver",
  projectName: "naver.github.io",
  plugins: ["docusaurus-plugin-sass"],
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/naver/egjs-view3d/edit/master/docs/"
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/naver/egjs-view3d/edit/master/blog/"
        },
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
            require.resolve("./src/css/bulma-override.sass")
          ]
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "egjs",
          src: "img/view3d.png"
        },
        items: [
          {
            type: "doc",
            docId: "installation",
            label: "Docs",
            position: "left"
          },
          {
            type: "doc",
            docId: "api/View3D",
            label: "API",
            position: "left"
          },
          {
            to: "Options",
            label: "Options",
            position: "left"
          },
          {
            to: "Demos",
            label: "Demos",
            position: "left"
          },
          {
            type: "docsVersionDropdown",
            position: "right",
            dropdownActiveClassDisabled: true
          },
          {
            type: "localeDropdown",
            position: "right"
          },
          {
            href: "https://github.com/naver/egjs-view3d",
            label: "GitHub",
            position: "right"
          }
        ]
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro"
              }
            ]
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/docusaurus"
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/docusaurus"
              },
              {
                label: "Twitter",
                href: "https://twitter.com/docusaurus"
              }
            ]
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog"
              },
              {
                label: "GitHub",
                href: "https://github.com/facebook/docusaurus"
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
