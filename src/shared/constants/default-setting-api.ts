import { getSession } from '../utils/get-session';

export const DEFAULT_SETTING_API = {
  headers: {
    Authorization: `Bearer ${getSession()!.token}`,
  },
};
