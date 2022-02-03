// Definitions to let TS understand .vs, .fs, .glsl shader files
declare module "*.module.css" {
  const value: Record<string, any>;
  export default value;
}
declare module "*.svg" {
  const value: React.FC<React.SVGProps<SVGSVGElement>>;
  export default value;
}
