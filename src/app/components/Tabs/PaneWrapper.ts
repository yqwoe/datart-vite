import styled from 'styled-components';

export const PaneWrapper = styled.div<{
  selected: boolean;
  display?: string;
}>`
  display: ${p => (p.selected ? p.display || 'flex' : 'none')};
  flex: 1;
  flex-direction: column;
`;
