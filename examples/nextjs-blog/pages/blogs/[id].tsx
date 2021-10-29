import {GetServerSideProps} from 'next';
import React from 'react';

export default function Blog() {
  return <div>Blog</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch(
    `http://localhost:3000/api/blog/${context.params?.id}`,
  );

  // console.log(response);

  return {
    props: {},
  };
};
