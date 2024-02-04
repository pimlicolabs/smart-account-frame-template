import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { privateKeyToSafeSmartAccount } from 'permissionless/accounts';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { Address, Hash, createPublicClient, http } from 'viem';

const privateKey = process.env.PRIVATE_KEY!;
const apiKey = process.env.PIMLICO_API_KEY!;
const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`
const bundlerUrl = `https://api.pimlico.io/v1/sepolia/rpc?apikey=${apiKey}`

const publicClient = createPublicClient({
	transport: http("https://rpc.ankr.com/eth_sepolia"),
})
 
const paymasterClient = createPimlicoPaymasterClient({
	transport: http(paymasterUrl),
})


async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY! });

    if (isValid === false) {
        return new NextResponse('Invalid Frame message', { status: 400 });
    }

    if (!message) {
        return new NextResponse('Invalid Frame message', { status: 400 });
    }

    const accountAddress = message.interactor.verified_accounts[0] as Address;

    const account = await privateKeyToSafeSmartAccount(publicClient, {
        privateKey: privateKey as Hash,
        safeVersion: "1.4.1", // simple version
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
        saltNonce: BigInt(message.interactor.fid)
    })

    return NextResponse.redirect(
        `https://sepolia.etherscan.io/address/${account.address}`,
        { status: 302 },
    );
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';