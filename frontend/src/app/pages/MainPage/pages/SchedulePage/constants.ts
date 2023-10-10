import { prefixI18N } from 'app/hooks/useI18NPrefix';
import { FormValues } from './types';

const Prefix = 'schedule.constants.';
export enum JobTypes {
  Email = 'EMAIL',
  WeChat = 'WECHAT',
  Dingtalk = 'DINGTALK',
}

export enum FileTypes {
  Excel = 'EXCEL',
  Image = 'IMAGE',
  ShareUrl = 'SHARE_URL',
}
export const JOB_TYPES_OPTIONS = [
  { label: prefixI18N(Prefix + 'email'), value: JobTypes.Email },
  { label: prefixI18N(Prefix + 'weChat'), value: JobTypes.WeChat },
  { label: prefixI18N(Prefix + 'dingtalk'), value: JobTypes.Dingtalk },
];
export const FILE_TYPE_OPTIONS = [
  { label: 'Excel', value: FileTypes.Excel },
  { label: prefixI18N(Prefix + 'picture'), value: FileTypes.Image },
];
export const WECHAT_FILE_TYPE_OPTIONS = [
  { label: prefixI18N(Prefix + 'picture'), value: FileTypes.Image },
];

export const DINGTALK_FILE_TYPE_OPTIONS = [
  { label: '链接', value: FileTypes.ShareUrl },
];

export enum TimeModes {
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}
export enum VizTypes {
  StoryBoard = 'STORYBOARD',
}

// http://emailregex.com/
export const EMAIL_REG =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const DEFAULT_VALUES: FormValues = {
  name: '',
  jobType: JobTypes.Email,
  type: [FileTypes.Image],
  imageWidth: 1920,
  periodUnit: TimeModes.Minute,
  hour: 0,
  minute: 1,
  day: 1,
  month: 1,
  cronExpression: ' 0 0 0 * * ?',
  textContent: '',
  parentId: null,
  index: null,
};

export const DefaultSchedulePeriodExpression: {
  [key in TimeModes]: string;
} = {
  // Every 10 minutes
  [TimeModes.Minute]: '0 */1 * * * ?',

  // At second :00 of minute :00 of every hour
  [TimeModes.Hour]: '0 0 * * * ?',

  // At 00:00:00am every day
  [TimeModes.Day]: '0 0 0 * * ?',

  // At 00:00:00am, on every Monday, every month
  [TimeModes.Week]: '0 0 0 ? * 1',

  // At 00:00:00am, on the 1st day, every month
  [TimeModes.Month]: '0 0 0 1 * ?',

  // At 00:00:00am, on the 1st day, in January
  [TimeModes.Year]: '0 0 0 1 1 ?',
};

export enum LogStatus {
  S1 = 1,
  S3 = 3,
  S7 = 7,
  S15 = 15,
}

export const LOG_STATUS_TEXT = {
  [LogStatus.S1]: prefixI18N(Prefix + 'taskExecution'),
  [LogStatus.S3]: prefixI18N(Prefix + 'configurationAnalysis'),
  [LogStatus.S7]: prefixI18N(Prefix + 'getData'),
  [LogStatus.S15]: prefixI18N(Prefix + 'send'),
};
export const JOB_TYPE_TEXT = {
  [JobTypes.Email]: prefixI18N(Prefix + 'email'),
  [JobTypes.WeChat]: prefixI18N(Prefix + 'weChat'),
  [JobTypes.Dingtalk]: prefixI18N(Prefix + 'dingtalk'),
};

export enum ScheduleViewModelStages {
  NotLoaded = -1,
  Loading = 0,
  Fresh = 1,
  Initialized = 2,
  Running = 3,
  Saveable = 4,
  Saving = 5,
  Saved = 6,
}
