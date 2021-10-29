import {LoginUserPayload} from '@m3o/m3o-node';

export type LoginFields = Required<
  Pick<LoginUserPayload, 'email' | 'password'>
>;
