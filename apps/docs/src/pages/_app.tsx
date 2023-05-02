import { ReCompUIProvider } from '@recompui/core';

function MyApp({ Component, pageProps }) {
  return (
    <ReCompUIProvider>
      <Component {...pageProps} />
    </ReCompUIProvider>
  );
}

export default MyApp;
