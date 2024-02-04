import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { Address } from 'viem';

const NEXT_PUBLIC_URL = 'https://zizzamia.xyz';

async function getResponse(req: NextRequest): Promise<NextResponse> {
    let accountAddress: Address | undefined;
    let text: string | undefined = '';

    const body: FrameRequest = await req.json();

    console.log("body", body)

    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY! });

    if (isValid) {
        accountAddress = message.interactor.verified_accounts[0] as Address;
    }


    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `https://etherscan.io/address/${accountAddress}`,
                    action: "post_redirectss"
                },
            ],
            image: `${NEXT_PUBLIC_URL}/park-2.png`,
            post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
    );
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';