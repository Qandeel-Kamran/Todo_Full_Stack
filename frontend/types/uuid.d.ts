declare module 'uuid' {
  export function v4(): string;
  const v4: typeof import('uuid').v4;
  export default v4;
}