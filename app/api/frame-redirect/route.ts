import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY! });

    if (isValid === false) {
        return new NextResponse('Invalid Frame message', { status: 400 });
    }

    return NextResponse.redirect(
        `https://etherscan.io/address/${message?.interactor.verified_accounts[0]}`,
        { status: 302 },
    );
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';