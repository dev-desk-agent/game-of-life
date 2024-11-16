export type Grid = number[][];

export interface GameState {
  grid: Grid;
  rows: number;
  cols: number;
}

export interface InitializeGameRequest {
  rows: number;
  cols: number;
  initialState?: number[][];
}
