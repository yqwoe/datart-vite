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
import { createContext, useCallback, useMemo, useState } from 'react';
import { CommonFormTypes } from 'globalConstants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';

interface SaveFormModel {
  id?: string;
  name: string;
  parentId: string | null;
  config?: object;
}

interface SaveFormState {
  type: CommonFormTypes;
  visible: boolean;
  simple?: boolean;
  initialValues?: SaveFormModel;
  parentIdLabel: string;
  onSave: (values: SaveFormModel, onClose: () => void) => void;
  onAfterClose?: () => void;
}

interface SaveFormContextValue extends SaveFormState {
  onCancel: () => void;
  showSaveForm: (formState: SaveFormState) => void;
}

const saveFormContextValue: SaveFormContextValue = {
  type: CommonFormTypes.Add,
  visible: false,
  simple: false,
  parentIdLabel: '',
  onSave: () => {},
  onCancel: () => {},
  showSaveForm: () => {},
};

export const SaveFormContext = createContext(saveFormContextValue);

export const useSaveFormContext = (): SaveFormContextValue => {
  const t = useI18NPrefix('view.saveForm');
  const [type, setType] = useState(CommonFormTypes.Add);
  const [visible, setVisible] = useState(false);
  const [simple, setSimple] = useState<boolean | undefined>(false);
  const [initialValues, setInitialValues] = useState<
    undefined | SaveFormModel
  >();
  const [parentIdLabel, setParentIdLabel] = useState(t('folder'));
  const [onSave, setOnSave] = useState(() => () => {});
  const [onAfterClose, setOnAfterClose] = useState(() => () => {});

  const onCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const showSaveForm = useCallback(
    ({
      type,
      visible,
      simple,
      initialValues,
      parentIdLabel,
      onSave,
      onAfterClose,
    }: SaveFormState) => {
      setType(type);
      setVisible(visible);
      setSimple(simple);
      setInitialValues(initialValues);
      setParentIdLabel(parentIdLabel);
      setOnSave(() => onSave);
      setOnAfterClose(() => onAfterClose);
    },
    [],
  );

  return useMemo(
    () => ({
      type,
      visible,
      simple,
      initialValues,
      parentIdLabel,
      onSave,
      onCancel,
      onAfterClose,
      showSaveForm,
    }),
    [
      type,
      visible,
      simple,
      initialValues,
      parentIdLabel,
      onSave,
      onCancel,
      onAfterClose,
      showSaveForm,
    ],
  );
};
