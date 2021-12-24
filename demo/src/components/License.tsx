import React from "react";

const LICENSE_TO_LINK = {
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
  "Creative Commons Attribution": "https://creativecommons.org/licenses/by/4.0/"
};

export default ({ items = [] }: {
  items: Array<{
    name: string;
    link: string;
    author: string;
    authorLink: string;
    license: string;
  }>;
}) => (
  <article className="message">
    <div className="message-body">
      <div className="mb-2 is-flex"><img className="mr-1" src="/icon/info.svg" /><span className="has-text-weight-bold">Asset License</span></div>
      {
        items.map((item, idx) => (
          <div key={idx}>
            <span className="mx-2">▪</span><a href={item.link}>{ item.name }</a> by <a href={item.authorLink}>{ item.author }</a> licensed under <a href={LICENSE_TO_LINK[item.license]}>{ item.license }</a>
          </div>
        ))
      }
    </div>
  </article>
);
