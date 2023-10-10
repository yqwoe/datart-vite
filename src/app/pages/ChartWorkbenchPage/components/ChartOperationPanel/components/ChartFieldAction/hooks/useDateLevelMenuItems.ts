import {
  ChartDataViewFieldCategory,
  RUNTIME_DATE_LEVEL_KEY,
} from 'app/constants';
import { updateBy } from 'app/utils/mutation';
import { useCallback } from 'react';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { CheckOutlined } from '@ant-design/icons';
import { getAllColumnInMeta } from 'app/utils/chartHelper';
import { FieldTemplate } from '../../ChartDataViewPanel/components/utils';
import { DATE_LEVEL_DELIMITER } from 'globalConstants';
import { DATE_LEVELS } from 'app/pages/ChartWorkbenchPage/slice/constant';

export const useDateLevelMenuItems = (
  availableSourceFunctions,
  config,
  metas,
  onChange,
) => {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const handleChangeFn = useCallback(
    selectedConfig => {
      /**
       * If the current category is DateLevelComputedField
       */
      if (
        config.category === ChartDataViewFieldCategory.DateLevelComputedField
      ) {
        /**
         * If default is selected
         */
        if (selectedConfig.category === ChartDataViewFieldCategory.Field) {
          return onChange(
            updateBy(config, draft => {
              delete draft.expression;
              delete draft.field;
              draft.category = selectedConfig.category;
              draft.colName = selectedConfig.colName;
              draft[RUNTIME_DATE_LEVEL_KEY] = null;
            }),
          );
        }

        return onChange({
          ...config,
          colName: selectedConfig.colName,
          expression: selectedConfig.expression,
          [RUNTIME_DATE_LEVEL_KEY]: null,
        });
      } else {
        /**
         * If the current category is Field, only the selected category is judged to be DateLevelComputedField
         */
        if (
          selectedConfig.category ===
          ChartDataViewFieldCategory.DateLevelComputedField
        ) {
          return onChange(
            updateBy(config, draft => {
              draft.expression = selectedConfig.expression;
              draft.field = config.colName;
              draft.category =
                ChartDataViewFieldCategory.DateLevelComputedField;
              draft.colName = selectedConfig.colName;
              draft[RUNTIME_DATE_LEVEL_KEY] = null;
            }),
          );
        }
      }
    },
    [config, onChange],
  );

  return [
    {
      key: 'defaultDateComputerField',
      icon: !config.expression ? CheckOutlined : '',
      eventKey: 'defaultDateComputerField',
      onClick: () => {
        config.field &&
          handleChangeFn({
            category: ChartDataViewFieldCategory.Field,
            colName: config.field,
          });
      },
      label: t('default'),
    },
    ...DATE_LEVELS.map(item => {
      if (availableSourceFunctions?.includes(item.expression)) {
        const configColName =
          config.category === ChartDataViewFieldCategory.Field
            ? config.colName
            : config.field;
        const row = getAllColumnInMeta(metas)?.find(
          v => v.name === configColName,
        );
        const expression = `${item.expression}(${FieldTemplate(row?.path)})`;
        return {
          key: expression,
          eventKey: expression,
          icon: config.expression === expression ? CheckOutlined : '',
          onClick: () =>
            handleChangeFn({
              category: ChartDataViewFieldCategory.DateLevelComputedField,
              colName: configColName + DATE_LEVEL_DELIMITER + item.expression,
              expression,
            }),
          label: item.name,
        };
      }
      return null;
    }),
  ];
};
