import React, {ComponentPropsWithoutRef, ReactElement} from 'react';

export function Button({
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>): ReactElement {
  return (
    <button
      {...props}
      className="flex items-center justify-center px-6 py-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700"
    >
      {children}
    </button>
  );
}
