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
import Editor, { useMonaco } from '@monaco-editor/react';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Divider, Row, Spin } from 'antd';
import {
  ChartComputedFieldHandle,
  FunctionDescription,
} from 'app/types/ComputedFieldEditor';
import { selectTheme } from 'styles/theme/slice/selectors';
import ChartComputedFieldEditorDarkTheme from './ChartComputedFieldEditorDarkTheme';
import DatartQueryLanguageSpecification from './DatartQueryLanguageSpecification';

const ChartComputedFieldEditor: ForwardRefRenderFunction<
  ChartComputedFieldHandle,
  {
    value?: string;
    functionDescriptions?: FunctionDescription[];
    onChange: (expression: string) => void;
  }
> = (props, ref) => {
  const editorRef = useRef<any>(null);
  const [editorText, setEditorText] = useState(props.value);
  const [description, setDescription] = useState<FunctionDescription>();

  const theme = useSelector(selectTheme);

  useImperativeHandle(ref, () => ({
    insertField: (value, funcDesc) => {
      if (!value) {
        return;
      }
      if (funcDesc) {
        setDescription(funcDesc);
      }

      const selection = editorRef.current?.getSelection();
      const id = { major: 1, minor: 1 };
      const op = {
        identifier: id,
        range: {
          startLineNumber: selection?.selectionStartLineNumber || 1,
          startColumn: selection?.selectionStartColumn || 1,
          endLineNumber: selection?.endLineNumber || 1,
          endColumn: selection?.endColumn || 1,
        },
        text: value,
        forceMoveMarkers: true,
      };
      editorRef.current.executeEdits('type', [op]);
      // editorRef?.current?.editor?.trigger('keyboard', 'type', { text: value });
      // editorRef?.current?.editor?.focus();
    },
  }));

  const getEditorNewLineCharactor = () => {
    return editorRef?.current?.editor?.getModel()?.getEOL();
  };

  const onChange = debounce(newValue => {
    setEditorText(newValue);

    const removeNewLineCharactor = value =>
      value.replace(getEditorNewLineCharactor(), ' ');
    props.onChange && props.onChange(removeNewLineCharactor(newValue));
  }, 200);

  const handleDescriptionChange = debounce(descKey => {
    if (!descKey) {
      return;
    }
    const funcDesc = props.functionDescriptions?.find(d => d.name === descKey);
    if (funcDesc) {
      setDescription(funcDesc);
    }
  }, 200);

  const handleEdtiorWillMount = monacoEditor => {
    monacoEditor.languages.register({ id: 'dql' });
    monacoEditor.languages.setMonarchTokensProvider('dql', {
      ...DatartQueryLanguageSpecification,
      builtinFunctions: (props?.functionDescriptions || []).map(f => f.name),
    });
    monacoEditor.editor.defineTheme('dqlTheme', {
      ...ChartComputedFieldEditorDarkTheme,
      colors: {
        'editor.foreground': theme.bodyBackground,
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    const model = editor.getModel();
    editor.onDidChangeCursorPosition(listener => {
      const positionWord = model.getWordAtPosition(listener.position);
      handleDescriptionChange(positionWord?.word);
    });
  };

  const renderFunctionDescriptionInfo = () => {
    if (!description) {
      return '';
    }
    return `${description.description}: ${description.syntax}`;
  };

  return (
    <StyledChartComputedFieldEditor>
      <Row>
        <Editor
          theme="dqlTheme"
          defaultLanguage="dql"
          defaultValue={editorText}
          beforeMount={handleEdtiorWillMount}
          onMount={handleEditorDidMount}
          options={{
            lineDecorationsWidth: 1,
          }}
          onChange={onChange}
          loading={<Spin />}
        />
      </Row>
      <Row>
        <Divider />
        <p>{renderFunctionDescriptionInfo()}</p>
      </Row>
    </StyledChartComputedFieldEditor>
  );
};

export default forwardRef(ChartComputedFieldEditor);

const StyledChartComputedFieldEditor = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;

  & > .ant-row:first-child {
    height: 300px;
  }
`;
