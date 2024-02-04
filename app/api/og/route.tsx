import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // const logo = searchParams.get('logo');
    // const logo = "https://docs-og-pimlico.vercel.app/pimlico-purple.svg"
    // const logo = "./pimlico-purple.svg"
    const userOpHash = searchParams.get('userOpHash');
    const address = searchParams.get('address');
    const fid = searchParams.get('fid');

    if (!userOpHash) {
      return new Response(`The userOpHash parameter is required`, {
        status: 400,
      });
    }

    if (!address) {
      return new Response(`The address parameter is required`, {
        status: 400,
      });
    }

    // const imageData = await fetch(new URL('./pimlico-purple.svg', import.meta.url)).then(
    //   (res) => res.arrayBuffer(),
    // );

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            // justifyContent: 'center',
            paddingTop: "50",
            paddingLeft: "100",
            paddingRight: "100",
            backgroundColor: '#1F0430',
            color: "#fff",
            fontSize: 32,
            fontWeight: 600,
            gap: "30px"
          }}
        >
          <div style={{ display: 'flex' }}>User Operation hash: {userOpHash.slice(0, 8)}...{userOpHash.slice(60)}</div>
          <div style={{ display: 'flex' }}>Smart Account Address: {address}</div>
          <div style={{ display: 'flex' }}>FID: {fid}</div>
          <div style={{ display: 'flex' }}>Your smart account has been deployed (might take a minute to show up as indexed on Etherscan)</div>
          <div style={{ display: 'flex' }}>Source code: https://github.com/pimlicolabs/smart-account-frame-template</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
