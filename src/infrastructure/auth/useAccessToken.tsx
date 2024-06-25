import { useContext } from 'react';
import { AccessTokenContext } from './AccessTokenProvider';

export const useAccessToken = () => useContext(AccessTokenContext);
