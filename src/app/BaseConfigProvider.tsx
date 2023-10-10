import { ConfigProvider, theme } from 'antd';
import { antdLocales } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectThemeKey } from 'styles/theme/slice/selectors';

const BaseConfigProvider = ({ children }) => {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={antdLocales[i18n.language]}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0d61a0',
          colorLink: '#0e558b',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default BaseConfigProvider;
