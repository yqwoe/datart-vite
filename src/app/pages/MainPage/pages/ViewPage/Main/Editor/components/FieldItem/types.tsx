import { AggregateFieldActionType, DataViewFieldType } from 'app/constants';

export const AggregateTypes = {
  [AggregateFieldActionType.Sum]: [DataViewFieldType.NUMERIC],
  [AggregateFieldActionType.Count]: [
    DataViewFieldType.NUMERIC,
    DataViewFieldType.DATE,
    DataViewFieldType.STRING,
  ],
  [AggregateFieldActionType.Count_Distinct]: [
    DataViewFieldType.NUMERIC,
    DataViewFieldType.DATE,
    DataViewFieldType.STRING,
  ],
  [AggregateFieldActionType.Avg]: [DataViewFieldType.NUMERIC],
  [AggregateFieldActionType.Max]: [DataViewFieldType.NUMERIC],
  [AggregateFieldActionType.Min]: [DataViewFieldType.NUMERIC],
};

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const SortTypes = [Sort.ASC, Sort.DESC];

export enum Filter {
  EQ = 'EQ',
  NOT_EQ = 'NOT_EQ',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  NULL = 'NULL',
  NOT_NULL = 'NOT_NULL',
  START_WITH = 'START_WITH',
  END_WITH = 'END_WITH',
  LT = 'LT',
  LTE = 'LTE',
  GT = 'GT',
  GTE = 'GTE',
  RANGE = 'RANGE',
}

export const FilterTypes = {
  [DataViewFieldType.STRING]: [
    Filter.EQ,
    Filter.NOT_EQ,
    Filter.IN,
    Filter.NOT_IN,
    Filter.NULL,
    Filter.NOT_NULL,
    Filter.START_WITH,
    Filter.END_WITH,
  ],
  [DataViewFieldType.NUMERIC]: [
    Filter.EQ,
    Filter.NOT_EQ,
    Filter.IN,
    Filter.NOT_IN,
    Filter.NULL,
    Filter.NOT_NULL,
    Filter.LT,
    Filter.LTE,
    Filter.GT,
    Filter.GTE,
    Filter.RANGE,
  ],
  [DataViewFieldType.DATE]: [
    Filter.NULL,
    Filter.NOT_NULL,
    Filter.LT,
    Filter.LTE,
    Filter.GT,
    Filter.GTE,
    Filter.RANGE,
  ],
};
