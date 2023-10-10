import { useCallback, useState } from 'react';
import { Split } from 'app/components';
import styled from 'styled-components';
import { useBoardSlice } from 'app/pages/DashBoardPage/pages/Board/slice';
import { useEditBoardSlice } from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import { useStoryBoardSlice } from 'app/pages/StoryBoardPage/slice';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import { dispatchResize } from 'app/utils/dispatchResize';
import { Main } from './Main';
import { SaveForm } from './SaveForm';
import { SaveFormContext, useSaveFormContext } from './SaveFormContext';
import { Sidebar } from './Sidebar';
import { useVizSlice } from './slice';
import { Menu } from 'antd';

export function VizPage() {
  useVizSlice();
  useBoardSlice();
  useEditBoardSlice();
  useStoryBoardSlice();

  const saveFormContextValue = useSaveFormContext();
  const [sliderVisible, setSliderVisible] = useState<boolean>(false);

  const { sizes, setSizes } = useSplitSizes({
    limitedSide: 0,
    range: [256, 768],
  });
  const tg = useI18NPrefix('global');
  const [isDragging, setIsDragging] = useState(false);

  const siderDragEnd = useCallback(
    sizes => {
      setSizes(sizes);
      dispatchResize();
      setIsDragging(false);
    },
    [setSizes, setIsDragging, dispatchResize],
  );

  const siderDragStart = useCallback(() => {
    if (!isDragging) setIsDragging(true);
  }, [setIsDragging, isDragging]);

  const handleSliderVisible = useCallback(
    (status: boolean) => {
      setSliderVisible(status);
      setTimeout(() => {
        dispatchResize();
      }, 300);
    },
    [setSliderVisible],
  );

  return (
    <SaveFormContext.Provider value={saveFormContextValue}>
      <Container
        sizes={sizes}
        minSize={[256, 0]}
        maxSize={[768, Infinity]}
        gutterSize={0}
        onDragStart={siderDragStart}
        onDragEnd={siderDragEnd}
        className="datart-split"
        sliderVisible={sliderVisible}
      >
        <Sidebar
          width={sizes[0]}
          isDragging={isDragging}
          i18nPrefix={'viz.sidebar'}
          sliderVisible={sliderVisible}
          handleSliderVisible={handleSliderVisible}
        />
        <Main sliderVisible={sliderVisible} />
        <SaveForm
          width={400}
          formProps={{
            labelAlign: 'left',
            labelCol: { offset: 1, span: 7 },
            wrapperCol: { span: 14 },
          }}
          okText={tg('button.save')}
        />
      </Container>
    </SaveFormContext.Provider>
  );
}

const Container = styled(({ sliderVisible, ...props }) => (
  <Split {...props} />
))<{ sliderVisible: boolean }>`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  .gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
  }
  .gutter-horizontal {
    display: ${p => (p.sliderVisible ? 'none' : 'block')};
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
    z-index: 9;
  }
`;
