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
import { FC, memo, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import styled from 'styled-components';
import { Group, WithColorPicker } from '../../Basic/components/Group';
import { ColorPickerPopover } from 'app/components/ColorPicker';
import { UploadDragger } from 'app/pages/DashBoardPage/pages/BoardEditor/components/SlideSetting/SettingItem/BasicSet/ImageUpload';
import { BackgroundConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ItemLayoutProps } from '../../types';

export const Background: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange, ...rest }) => {
    const { value, options } = data;
    const gt = useI18NPrefix(`viz.board.setting`);
    const valRef = useRef<BackgroundConfig>();
    useEffect(() => {
      valRef.current = value;
    }, [value]);

    const handleChange = (obj: { key: string; val: string }) => {
      const newVal = {
        ...valRef.current,
        [obj.key]: obj.val,
      };
      onChange?.(ancestors, newVal);
    };
    const onImageChange = imageUrl => {
      handleChange({ key: 'image', val: imageUrl });
    };
    const onImageUrlChange = e => {
      handleChange({ key: 'image', val: e.target.value });
    };
    const onColorChange = value => {
      handleChange({ key: 'color', val: value });
    };
    return (
      <Wrap>
        <Group>
          {gt('color')}
          <WithColorPicker>
            <ColorPickerPopover
              {...rest}
              {...options}
              defaultValue={data.value?.color}
              onSubmit={onColorChange}
            />
          </WithColorPicker>
        </Group>
        <span>{gt('image')}</span>
        <UploadDragger
          value={value.image as string}
          onChange={onImageChange}
          placeholder={gt('uploadTip')}
        />
        <div>URL</div>
        <Input
          className="datart-ant-input"
          value={value.image}
          onChange={onImageUrlChange}
        />
      </Wrap>
    );
  },
);
const Wrap = styled.div`
  display: block;
  .ant-upload-list {
    display: none;
  }
`;
