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
import React, { FC, memo, useContext, useState } from 'react';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
import {
  FONT_SIZE_ICON_SM,
  FONT_WEIGHT_MEDIUM,
  LEVEL_100,
  LINE_HEIGHT_ICON_SM,
  SPACE_LG,
  SPACE_XS,
} from 'styles/StyleConstants';
import {
  CloseOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import useI18NPrefix from 'app/hooks/useI18NPrefix';

interface TitleHeaderProps {
  name?: string;
  onShareDownloadData?: () => void;
  loadVizData?: () => void;
}
const IconStyle = {
  marginLeft: '20px',
  fontSize: 14,
  cursor: 'pointer',
};

const TitleForShare: FC<TitleHeaderProps> = memo(
  ({ name, onShareDownloadData, loadVizData, children }) => {
    const t = useI18NPrefix(`viz.action`);

    const [showTitle, setShowTitle] = useState<boolean>(false);
    const { allowDownload } = useContext(BoardContext);

    if (!showTitle) {
      return (
        <FixedButton onClick={() => setShowTitle(true)}>
          <SettingOutlined />
        </FixedButton>
      );
    }
    return (
      <Wrapper>
        <Space>
          {allowDownload && (
            <>
              {children}
              <Popconfirm
                placement="left"
                title={t('common.confirm')}
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
                onConfirm={() => {
                  onShareDownloadData?.();
                }}
              >
                <Tooltip title={t('share.exportData')} placement="bottom">
                  <Button
                    type="text"
                    size="small"
                    ghost
                    icon={<DownloadOutlined style={IconStyle} />}
                  >
                    {t('share.exportData')}
                  </Button>
                </Tooltip>
              </Popconfirm>
            </>
          )}
          <Tooltip title={t('syncData')} placement="bottom">
            <Button
              type="text"
              size="small"
              ghost
              onClick={loadVizData}
              icon={<ReloadOutlined style={IconStyle} />}
            >
              {t('syncData')}
            </Button>
          </Tooltip>
          <Button
            type="text"
            size="small"
            ghost
            onClick={() => setShowTitle(false)}
            icon={<CloseOutlined style={IconStyle} />}
          >
            {t('close')}
          </Button>
        </Space>
      </Wrapper>
    );
  },
);

export default TitleForShare;

const FixedButton = styled.div`
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: ${LEVEL_100};
  cursor: pointer;
`;

const Wrapper = styled.div`
  position: fixed;
  z-index: ${LEVEL_100};
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: ${SPACE_XS} ${SPACE_LG};

  h1 {
    flex: 1;
    font-size: ${FONT_SIZE_ICON_SM};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    line-height: ${LINE_HEIGHT_ICON_SM};

    &.disabled {
      color: ${p => p.theme.textColorLight};
    }
  }
`;
