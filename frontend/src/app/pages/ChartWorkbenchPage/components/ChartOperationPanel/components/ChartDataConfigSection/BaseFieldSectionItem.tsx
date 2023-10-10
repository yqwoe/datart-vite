import { useState } from 'react';
import styled from 'styled-components';

const BaseFieldSectionItem = props => {
  const [state, setState] = useState({
    tags: [],
    visible: false,
    value: '',
    editIndex: -1,
    editValue: '',
  });

  return (
    <ItemWrapper>
      {/* {
      state.tags.map((tag, index) => {
        if (state.editIndex === index) {
          return (<input></input>)
        }
      })
    }

    {
      !state.visible && <></>
    } */}
    </ItemWrapper>
  );
};

const ItemWrapper = styled.div``;

export default BaseFieldSectionItem;
