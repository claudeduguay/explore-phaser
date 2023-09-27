export type IMutationFunction = (x: number) => number;

export default class Vector {
  constructor(
    public readonly x: number = 0,
    public readonly y: number = 0) {
  }

  plus(value: number): Vector;
  plus(vector: Vector): Vector;
  plus(x: number, y: number): Vector;
  plus(valueVectorOrX: number | Vector, yValue?: number) {
    if (valueVectorOrX instanceof Vector) {
      return this.mutation(x => x + valueVectorOrX.x, y => y + valueVectorOrX.y);
    } else {
      return this.mutation(x => x + valueVectorOrX, y => y + (yValue || valueVectorOrX));
    }
  }

  scale(value: number): Vector;
  scale(vector: Vector): Vector;
  scale(x: number, y: number): Vector;
  scale(valueVectorOrX: number | Vector, yValue?: number) {
    if (valueVectorOrX instanceof Vector) {
      return this.mutation(x => x * valueVectorOrX.x, y => y * valueVectorOrX.y);
    } else {
      return this.mutation(x => x * valueVectorOrX, y => y * (yValue || valueVectorOrX));
    }
  }

  mutation(
    xFunc: IMutationFunction = x => x,
    yFunc: IMutationFunction = y => y) {
    return new Vector(xFunc(this.x), yFunc(this.y));
  }

}
