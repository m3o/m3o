import {NextPage} from 'next';
import {LoginUserPayload} from '@m3o/m3o-node';
import {useForm} from 'react-hook-form';
import {Button} from '../components/Button';
import {useAuth} from '../components/AuthProvider';

type LoginFields = Required<Pick<LoginUserPayload, 'email' | 'password'>>;

const Login: NextPage = () => {
  const {register, handleSubmit} = useForm<LoginFields>();
  const {login} = useAuth();

  return (
    <div className="bg-gray-50 flex p-8">
      <div className="bg-white p-6 md:w-5/12 mx-auto border border-gray-200 rounded-md">
        <h1 className="font-bold text-2xl mb-6">Login</h1>
        <form onSubmit={handleSubmit(login)}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full p-4 border border-solid border-gray-200"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full p-4 border border-solid border-gray-200"
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
