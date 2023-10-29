// pages/index.js
'use client';
import React, { useEffect, useState } from 'react';

function Home() {
  // const [message, setMessage] = useState('');

  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000/api/home/')
  //     .then((response) => response.json())
  //     .then((data) => setMessage(data.message))
  //     .catch((error) => console.error(error));
  // }, []);

  return (
    <div>
      <h1>Hello, Next.js!</h1>
      {/* <p>Message from the API: {message}</p> */}
    </div>
  );
}

export default Home;
