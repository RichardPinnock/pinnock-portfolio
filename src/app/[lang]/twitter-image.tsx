import OpenGraphImage, { generateStaticParams } from "./opengraph-image";

// Same card as Open Graph. Route segment config has to be declared here, not re-exported.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export { generateStaticParams };
export default OpenGraphImage;
