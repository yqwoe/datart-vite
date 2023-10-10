/**
 * Datart Vite
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  CloudDownloadOutlined,
  CopyFilled,
  DeleteOutlined,
  FileAddOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { DownloadFileType } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useSaveAsViz } from 'app/pages/MainPage/pages/VizPage/hooks/useSaveAsViz';
import { FC, memo, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useRecycleViz } from '../../../../hooks/useRecycleViz';
import { usePublishBoard } from '../../hooks/usePublishBoard';
import { widgetsQueryAction } from '../../pages/Board/slice/asyncActions';
import { BoardActionContext } from '../ActionProvider/BoardActionProvider';
import { BoardContext } from '../BoardProvider/BoardProvider';

interface Props {
  onOpenShareLink: () => void;
  openStoryList: () => void;
  openMockData: () => void;
}
export const BoardDropdownList: FC<Props> = memo(
  ({ onOpenShareLink, openStoryList, openMockData }) => {
    const t = useI18NPrefix(`viz.action`);
    const tg = useI18NPrefix(`global`);
    const dispatch = useDispatch();
    const {
      allowDownload,
      allowShare,
      allowManage,
      renderMode,
      status,
      orgId,
      boardId,
    } = useContext(BoardContext);
    const recycleViz = useRecycleViz(orgId, boardId, 'DASHBOARD');
    const saveAsViz = useSaveAsViz();
    const reloadData = () => {
      dispatch(widgetsQueryAction({ boardId, renderMode }));
    };
    const { onBoardToDownLoad } = useContext(BoardActionContext);
    const { publishBoard } = usePublishBoard(boardId, 'DASHBOARD', status);

    const items = [
      {
        key: 'reloadData',
        onClick: reloadData,
        icon: <ReloadOutlined />,
        label: t('syncData'),
      },
    ]
      .concat(
        allowShare
          ? [
              {
                type: 'divider',
                key: 'shareLinkLine',
              },
              {
                key: 'shareLink',
                onClick: onOpenShareLink,
                icon: <ShareAltOutlined />,
                label: t('share.shareLink'),
              },
            ]
          : [],
      )
      .concat(
        allowDownload
          ? [
              {
                type: 'divider',
                key: 'exportDataLine',
              },
              {
                key: 'exportData',
                icon: <CloudDownloadOutlined />,
                label: (
                  <Popconfirm
                    placement="left"
                    title={t('common.confirm')}
                    okText={t('common.ok')}
                    cancelText={t('common.cancel')}
                    onConfirm={() => {
                      onBoardToDownLoad?.(DownloadFileType.Excel);
                    }}
                  >
                    {t('share.exportData')}
                  </Popconfirm>
                ),
              },
              {
                key: 'exportPDF',
                icon: <CloudDownloadOutlined />,
                label: (
                  <Popconfirm
                    placement="left"
                    title={t('common.confirm')}
                    okText={t('common.ok')}
                    cancelText={t('common.cancel')}
                    onConfirm={() => {
                      onBoardToDownLoad?.(DownloadFileType.Pdf);
                    }}
                  >
                    {t('share.exportPDF')}
                  </Popconfirm>
                ),
              },
              {
                key: 'exportPicture',
                icon: <CloudDownloadOutlined />,
                label: (
                  <Popconfirm
                    placement="left"
                    title={t('common.confirm')}
                    okText={t('common.ok')}
                    cancelText={t('common.cancel')}
                    onConfirm={() => {
                      onBoardToDownLoad?.(DownloadFileType.Image);
                    }}
                  >
                    {t('share.exportPicture')}
                  </Popconfirm>
                ),
              },
              {
                key: 'exportTpl',
                icon: <CloudDownloadOutlined />,
                label: (
                  <Popconfirm
                    placement="left"
                    title={t('common.confirm')}
                    okText={t('common.ok')}
                    cancelText={t('common.cancel')}
                    onConfirm={openMockData}
                  >
                    {t('share.exportTpl')}
                  </Popconfirm>
                ),
              },
            ]
          : [],
      )
      .concat(
        allowManage
          ? [
              {
                type: 'divider',
                key: 'unpublishLine',
              },
            ]
          : [],
      )
      .concat(
        allowManage && status === 2
          ? [
              {
                key: 'unpublish',
                icon: <FileAddOutlined />,
                label: t('unpublish'),
                onClick: publishBoard,
              },
            ]
          : [],
      )
      .concat(
        allowManage
          ? [
              {
                key: 'saveAs',
                icon: <CopyFilled />,
                label: tg('button.saveAs'),
                onClick: () => saveAsViz(boardId, 'DASHBOARD'),
              },
              {
                key: 'addToStory',
                icon: <FileAddOutlined />,
                label: t('addToStory'),
                onClick: openStoryList,
              },
              {
                key: 'archive',
                icon: <DeleteOutlined />,
                label: tg('button.archive'),
                onClick: recycleViz,
              },
            ]
          : [],
      );

    return <Menu items={items}></Menu>;
  },
);
