import Head from "next/head";
// import { AnalyticConfig } from "../../dist/graphql/modules/shop/shopConfig/analytic/analyticConfig.graphql";

export function DefaultHead({}: { googleAnalytics?: string; facebookPixel?: string }) {
  // const analyticConfig: any = useMemo(() => {
  //   if (typeof window !== "undefined") {
  //     const config = sessionStorage.getItem("analyticConfig");
  //     return config ? JSON.parse(config) : null;
  //   } else {
  //     return null;
  //   }
  // }, []);

  return (
    <>
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7G5K593S56"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  
                  gtag('config', 'G-7G5K593S56');
                `,
          }}
        ></script>
        {/* {analyticConfig?.googleAnalytic && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticConfig.googleAnalytic}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${analyticConfig.googleAnalytic}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )} */}
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* <link rel="manifest" crossOrigin="use-credentials" href="/manifest.json" /> */}
        {/* <link rel="stylesheet" href={`/api/setting/theme/${shopCode || "DEFAULT"}`}></link> */}
        {/* <link rel="stylesheet" href={`/api/setting/theme/${"DEFAULT"}`}></link> */}
        {/* Facebook Pixel Code */}
        {/* {analyticConfig?.facebookPixel && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${analyticConfig?.facebookPixel}');
                    fbq('track', 'PageView');
                  `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${analyticConfig?.facebookPixel}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )} */}
        {/* End Facebook Pixel Code  */}
      </Head>
    </>
  );
}
