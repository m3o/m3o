import React, {ReactElement} from 'react';
import Link from 'next/link';
import {Button} from './Button';
import {useAuth} from './AuthProvider';

export function SiteHeader(): ReactElement {
  const {user, logout} = useAuth();

  return (
    <header className="py-4 px-6 border-b border-solid border-gray-200">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">
          <Link href="/">
            <a>Micro Blog</a>
          </Link>
        </h1>
        <div className="flex items-center">
          {user ? (
            <>
              <Link href="/blogs/create">
                <a className="inline-block mr-6 hover:text-indigo-500">
                  Create Post
                </a>
              </Link>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <Link href="/login">
              <a>Login</a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
