import { CheckOutlined } from '@ant-design/icons';
import { SortActionType } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { updateBy } from 'app/utils/mutation';
import { useState } from 'react';
import { isEmpty } from 'utils/object';

export const useSortAction = (config, options, onConfigChange) => {
  const actionNeedNewRequest = isEmpty(options?.backendSort)
    ? true
    : Boolean(options?.backendSort);
  const t = useI18NPrefix(`viz.palette.data.actions`);
  const [direction, setDirection] = useState(
    config?.sort?.type || SortActionType.None,
  );

  const handleSortTypeChange = direction => {
    setDirection(direction);

    if (SortActionType.Customize !== direction) {
      onConfigChange &&
        onConfigChange(
          updateBy(config, draft => {
            draft.sort = { type: direction };
          }),
          actionNeedNewRequest,
        );
    }
  };
  return [SortActionType.None, SortActionType.ASC, SortActionType.DESC].map(
    sort => {
      return {
        key: sort,
        eventKey: sort,
        icon: direction === sort ? CheckOutlined : '',
        onClick: () => handleSortTypeChange(sort),
        label: t(`sort.${sort?.toLowerCase()}`),
      };
    },
  );
};
