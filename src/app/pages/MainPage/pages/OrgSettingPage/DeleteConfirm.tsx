import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message, Modal, ModalProps } from 'antd';
import {
  selectCurrentOrganization,
  selectDeleteOrganizationLoading,
} from 'app/pages/MainPage/slice/selectors';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { deleteOrganization } from '../../slice/thunks';

export const DeleteConfirm = (props: ModalProps) => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const history = useNavigate();
  const currentOrganization = useSelector(selectCurrentOrganization);
  const loading = useSelector(selectDeleteOrganizationLoading);
  const confirmDisabled = inputValue !== currentOrganization?.name;
  const t = useI18NPrefix('orgSetting');
  const tg = useI18NPrefix('global');

  const inputChange = useCallback(e => {
    setInputValue(e.target.value);
  }, []);

  const deleteOrg = useCallback(() => {
    dispatch(
      deleteOrganization(() => {
        history('/');
        message.success(tg('operation.deleteSuccess'));
      }),
    );
  }, [dispatch, history, tg]);

  return (
    <Modal
      {...props}
      footer={[
        <Button key="cancel" onClick={props.onCancel}>
          {t('cancel')}
        </Button>,
        <Button
          key="confirm"
          loading={loading}
          disabled={confirmDisabled}
          onClick={deleteOrg}
          danger
        >
          {t('delete')}
        </Button>,
      ]}
    >
      <Form.Item>
        <Input
          placeholder={t('enterOrgName')}
          value={inputValue}
          onChange={inputChange}
        />
      </Form.Item>
    </Modal>
  );
};
