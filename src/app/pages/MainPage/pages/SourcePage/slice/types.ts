import { ReactElement } from 'react';
import { TreeNodeProps } from 'antd';

export interface SourceState {
  sources: SourceSimpleViewModel[];
  archived: SourceSimpleViewModel[];
  editingSource: string;
  sourceListLoading: boolean;
  archivedListLoading: boolean;
  sourceDetailLoading: boolean;
  saveSourceLoading: boolean;
  unarchiveSourceLoading: boolean;
  deleteSourceLoading: boolean;
  currentCategory: string;
  syncSourceSchemaLoading: boolean;
  updateLoading: boolean;
}

export interface Source {
  config: string;
  createBy?: string;
  createTime?: string;
  id: string;
  name: string;
  orgId: string;
  status?: number;
  type: string;
  index: number | null;
  updateBy?: string;
  updateTime?: string;
  permission?: number;
  schemaUpdateDate?: string;
  category?: string | null;
}

export interface SelectSourceTreeProps {
  getIcon: (
    o: SourceSimpleViewModel,
  ) => ReactElement | ((props: TreeNodeProps) => ReactElement);
  getDisabled: (o: SourceSimpleViewModel) => boolean;
}

export interface SelectSourceFolderTreeProps {
  id?: string;
  getDisabled: (o: SourceSimpleViewModel, path: string[]) => boolean;
}

export interface UpdateSourceBaseParams {
  source: SourceBase;
  resolve: () => void;
}

export interface SourceBase {
  id: string;
  name: string;
  parentId: string | null;
  index: number | null;
}

export interface SourceSimple extends Source {
  isFolder: boolean;
  parentId: string | null;
}

export interface SourceSimpleViewModel extends SourceSimple {
  deleteLoading: boolean;
}

export interface SourceFormModel
  extends Pick<
    SourceSimple,
    'isFolder' | 'name' | 'type' | 'parentId' | 'orgId' | 'index' | 'category'
  > {
  config: object;
}

export interface AddSourceParams {
  config: string;
  parentId: string | null;
  index: number | null;
  orgId: string;
  isFolder: boolean;
  id?: string | undefined;
  name: string;
  type?: string;
}

export interface SourceParamsResolve {
  source: AddSourceParams;
  resolve: (redirectId: string) => void;
}

export interface EditSourceParams {
  source: SourceSimple;
  resolve: () => void;
  reject?: () => void;
}

export interface UnarchiveSourceParams {
  source: SourceBase;
  resolve: () => void;
}

export interface DeleteSourceParams {
  id: string;
  archive?: boolean;
  resolve: () => void;
}
