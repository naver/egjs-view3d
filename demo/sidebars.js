module.exports = {
  docs: [
    {
      type: "autogenerated",
      dirName: "tutorials"
    }
  ],
  options: [
    {
      type: "category",
      label: "Model",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/model"
        }
      ]
    },
    {
      type: "category",
      label: "Control",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/control"
        }
      ]
    },
    {
      type: "category",
      label: "Environment",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/environment"
        }
      ]
    },
    {
      type: "category",
      label: "Animation",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/animation"
        }
      ]
    },
    {
      type: "category",
      label: "Annotation",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/annotation"
        }
      ]
    },
    {
      type: "category",
      label: "Augmented Reality",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/ar"
        }
      ]
    },
    {
      type: "category",
      label: "Miscellaneous",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/miscellaneous"
        }
      ]
    },
    {
      type: "category",
      label: "PostProcessing",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "autogenerated",
          dirName: "options/postProcessing"
        }
      ]
    },
  ],
  events: [
    {
      type: "autogenerated",
      dirName: "events"
    }
  ],
  plugins: [
    {
      type: "autogenerated",
      dirName: "plugins"
    }
  ],
  ar: [
    {
      type: "autogenerated",
      dirName: "ar"
    }
  ],
  ...require("./sidebars-api.js")
};
