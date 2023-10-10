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
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LayoutWithBrand } from 'app/components';
import { selectSetupLoading, selectSystemInfo } from 'app/slice/selectors';
import { SUCCESS } from 'styles/StyleConstants';
import { CheckCircleOutlined } from '@ant-design/icons';
import * as AuthLayout from 'app/components/styles/AuthLayout';
import { Version } from 'app/components/Version';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { SetupForm } from './SetupForm';

export function SetupPage() {
  const history = useNavigate();
  const systemInfo = useSelector(selectSystemInfo);
  const loading = useSelector(selectSetupLoading);
  const t = useI18NPrefix('setup');

  const toLogin = useCallback(() => {
    history('/login');
  }, [history]);

  const initialized = !!systemInfo?.initialized;
  const title = initialized ? t('success') : t('welcome');
  const desc = initialized ? (
    <>
      {t('successDesc')}
      <Button type="link" size="small" className="btn" onClick={toLogin}>
        {t('goLogin')}
      </Button>
    </>
  ) : (
    t('welcomeDesc')
  );

  return (
    <LayoutWithBrand className="alert">
      {initialized && (
        <AuthLayout.Picture>
          <CheckCircleOutlined style={{ color: SUCCESS }} />
        </AuthLayout.Picture>
      )}
      <AuthLayout.Title>{title}</AuthLayout.Title>
      <AuthLayout.Description>{desc}</AuthLayout.Description>
      {initialized || <SetupForm loading={loading} />}

      <Version version={systemInfo?.version} />
    </LayoutWithBrand>
  );
}
