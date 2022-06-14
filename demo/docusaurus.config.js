// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/oceanicNext");
const darkCodeTheme = require("prism-react-renderer/themes/palenight");
const glslify = require("./plugin/glslify");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "View3D",
  tagline: "Fast & customizable 3D model viewer for everyone based on three.js & typescript",
  url: "https://naver.github.io",
  baseUrl: "/egjs-view3d/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  organizationName: "naver",
  projectName: "naver.github.io",
  trailingSlash: false,
  plugins: ["docusaurus-plugin-sass", glslify],
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/naver/egjs-view3d/edit/main/demo/",
          remarkPlugins: [require("remark-breaks")],
          breadcrumbs: false
        },
        pages: {
          remarkPlugins: [require("remark-breaks")]
        },
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
            require.resolve("./src/css/global.css"),
            require.resolve("../sass/view3d-bundle.sass"),
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
        title: "View3D",
        logo: {
          alt: "egjs",
          src: "img/cube.svg",
          srcDark: "img/cube_white.svg"
        },
        items: [
          {
            type: "doc",
            docId: "tutorials/installation",
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
            type: "doc",
            docId: "options/model/src",
            label: "Options",
            position: "left"
          },
          {
            type: "doc",
            docId: "events/register",
            label: "Events",
            position: "left"
          },
          {
            type: "doc",
            docId: "plugins/about",
            label: "Plugins",
            position: "left"
          },
          {
            type: "doc",
            docId: "ar/default",
            label: "AR",
            position: "left"
          },
          {
            to: "Playground",
            label: "Playground",
            position: "left"
          },
          {
            href: "https://www.npmjs.com/package/@egjs/view3d",
            className: "header-npm-link",
            "aria-label": "NPM Package",
            position: "right"
          },
          {
            href: "https://github.com/naver/egjs-view3d",
            className: "header-github-link",
            "aria-label": "GitHub Repository",
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
                label: "Getting Started",
                to: "docs/"
              },
              {
                label: "API",
                to: "docs/api/View3D"
              },
              {
                label: "Options",
                to: "docs/options/model/src"
              },
              {
                label: "Events",
                to: "docs/events"
              },
              {
                label: "Plugins",
                to: "docs/plugins"
              }
            ]
          },
          {
            title: "Demo",
            items: [
              {
                label: "Playground",
                to: "Playground/"
              }
            ]
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/naver/egjs-view3d"
              },
              {
                label: "Issues",
                href: "https://github.com/naver/egjs-view3d/issues"
              },
              {
                label: "Naver Open Source",
                href: "https://naver.github.io/"
              }
            ]
          }
        ],
        logo: {
          alt: "egjs",
          src: "img/egjs_white.svg",
          href: "https://naver.github.io/egjs/"
        },
        copyright: `Copyright © ${new Date().getFullYear()} NAVER, Inc. Built with Docusaurus & Bulma.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
