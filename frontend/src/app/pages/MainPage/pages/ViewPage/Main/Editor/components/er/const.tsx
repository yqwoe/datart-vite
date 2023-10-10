export enum GraphMode {
  INFO = 'INFO', // 缩略模式
  DETAIL = 'DETAIL', // 详情模式
}

export enum EntityType {
  FACT = 'FACT',
  DIM = 'DIM',
  OTHER = 'OTHER',
}

export const EntityTypeDisplay = {
  [EntityType.FACT]: '事实',
  [EntityType.DIM]: '维度',
  [EntityType.OTHER]: '其他',
};
