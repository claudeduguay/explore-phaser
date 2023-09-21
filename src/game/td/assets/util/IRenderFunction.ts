
export default interface IRenderFunction<T = any> {
  (g: CanvasRenderingContext2D, options?: T): void
}
