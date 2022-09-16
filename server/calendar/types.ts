import { IAPIResult } from "../types";

export interface IResultObject {
    status: number;
    message: string;
    data?: IAPIResult;
  }