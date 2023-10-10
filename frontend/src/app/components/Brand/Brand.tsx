import logo from 'app/assets/images/logo.svg';
import {
  FONT_SIZE_ICON_XXL,
  FONT_WEIGHT_BOLD,
  LINE_HEIGHT_ICON_XXL,
  SPACE_MD,
  SPACE_TIMES,
} from 'styles/StyleConstants';
import styled from 'styled-components';

export function Brand({ logoUrl = logo, name = 'Datart' }) {
  return (
    <Header>
      <img src={logoUrl} alt="logo" />
      <h1>{name}</h1>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;

  h1 {
    padding: 0 ${SPACE_TIMES(7)} 0 ${SPACE_MD};
    font-size: ${FONT_SIZE_ICON_XXL};
    font-weight: ${FONT_WEIGHT_BOLD};
    line-height: ${LINE_HEIGHT_ICON_XXL};
    color: ${p => p.theme.textColorSnd};
  }

  img {
    width: 56px;
    height: 56px;
  }
`;
