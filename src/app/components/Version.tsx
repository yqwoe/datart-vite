import { SPACE_LG } from 'styles/StyleConstants';
import styled from 'styled-components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';

interface VersionProps {
  version?: string;
}

export function Version({ version }: VersionProps) {
  const t = useI18NPrefix('global');
  return version ? (
    <Title>
      {t('version')}: {version}
    </Title>
  ) : null;
}

const Title = styled.h3`
  position: absolute;
  right: ${SPACE_LG};
  bottom: ${SPACE_LG};
  color: ${p => p.theme.textColorDisabled};
`;
