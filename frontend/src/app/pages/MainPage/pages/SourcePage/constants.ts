export enum SourceViewModelStages {
  NotLoaded = -1,
  Loading = 0,
  Fresh = 1,
  Initialized = 2,
  Running = 3,
  Saveable = 4,
  Saving = 5,
  Saved = 6,
}

export enum Category {
  ANALYZE = 'ANALYZE',
  EXTRACT = 'EXTRACT',
}

export const CATEGORY_LABEL = {
  [Category.ANALYZE]: '数据分析',
  [Category.EXTRACT]: '数据采集',
};
