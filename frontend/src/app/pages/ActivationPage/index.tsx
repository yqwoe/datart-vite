import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthorizationStatus } from 'app/constants';
import { getUserInfoByToken } from 'app/slice/thunks';
import { Alert } from 'app/components/Alert';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { request2 } from 'utils/request';

export const ActivationPage = () => {
  const [status, setStatus] = useState<AuthorizationStatus>(
    AuthorizationStatus.Initialized,
  );
  const history = useNavigate();
  const dispatch = useDispatch();
  const t = useI18NPrefix('authorization');

  const activateAndLogin = useCallback(
    async (token: string) => {
      try {
        const { data } = await request2<string>(`/users/active?token=${token}`);

        if (!data) {
          throw new Error();
        }

        dispatch(
          getUserInfoByToken({
            token: data,
            resolve: () => {
              history('/', { replace: true });
            },
            reject: () => {
              setStatus(AuthorizationStatus.Error);
            },
          }),
        );
      } catch (error) {
        setStatus(AuthorizationStatus.Error);
      }
    },
    [dispatch, history],
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('activation_token');

    if (token) {
      setStatus(AuthorizationStatus.Pending);
      activateAndLogin(token);
    }
  }, [activateAndLogin]);

  return (
    <Alert
      status={status}
      pendingTitle={t('activating')}
      pendingMessage={t('activatingDesc')}
      errorTitle={t('activatingError')}
    />
  );
};
