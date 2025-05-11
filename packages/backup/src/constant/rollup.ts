import {
  makeHtmlAttributes,
  RollupHtmlTemplateOptions,
} from "@rollup/plugin-html";

export const htmlTemplate = ({
  attributes,
  files,
  meta,
  publicPath,
  title,
}: RollupHtmlTemplateOptions) => {
  const scripts = (files.js || [])
    .map((file) => {
      if ("code" in file) {
        return `<script>${file.code}</script>`;
      }
      return "";
    })
    .join("\n");

  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
    .join("\n");

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    })
    .join("\n");

  return `
  <!doctype html>
  <html${makeHtmlAttributes(attributes.html)}>
    <head>
      ${metas}
      <title>${title}</title>
      ${links}
    </head>
    <body>
      ${scripts}
    </body>
  </html>`;
};
