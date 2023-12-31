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
import { request2 } from 'utils/request';
import { IUserInfo } from './types';

export const searchUserEmails = async (keyword: string) => {
  const { data } = await request2<IUserInfo[]>({
    url: '/users/search',
    method: 'GET',
    params: { keyword },
  });
  return data;
};

export const executeSchedule = async scheduleId => {
  const { data } = await request2<boolean>({
    url: `/schedules/execute/${scheduleId}`,
    method: 'POST',
  });
  return data;
};

export const startSchedule = async scheduleId => {
  const { data } = await request2<boolean>({
    url: `/schedules/start/${scheduleId}`,
    method: 'PUT',
  });
  return data;
};

export const stopSchedule = async scheduleId => {
  const { data } = await request2<boolean>({
    url: `/schedules/stop/${scheduleId}`,
    method: 'PUT',
  });
  return data;
};
