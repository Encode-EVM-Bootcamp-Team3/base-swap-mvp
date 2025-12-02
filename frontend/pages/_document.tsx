// frontend/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Base Swap MVP" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
