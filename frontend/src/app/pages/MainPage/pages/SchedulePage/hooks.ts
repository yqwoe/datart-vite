import { useNavigate } from 'react-router-dom';

export const useToScheduleDetails = () => {
  const history = useNavigate();
  return {
    toDetails: (orgId: string, scheduleId?: string) => {
      if (scheduleId) {
        history(`/organizations/${orgId}/schedules/${scheduleId}`);
      } else {
        history(`/organizations/${orgId}/schedules`);
      }
    },
  };
};
