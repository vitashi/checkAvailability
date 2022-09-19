import { Moment } from "moment";
import { IAPIResult } from "../common/types";

export interface IResultObject {
    status: number;
    message: string;
    data?: IAPIResult;
  }

export type TimeSlotBounds = {
    start: Moment,
    end: Moment
  }