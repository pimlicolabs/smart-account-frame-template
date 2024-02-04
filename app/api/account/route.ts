import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { bundlerActions, createSmartAccountClient } from 'permissionless';
import { privateKeyToSafeSmartAccount } from 'permissionless/accounts';
import { pimlicoBundlerActions } from 'permissionless/actions/pimlico';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { Address, createPublicClient, hexToBigInt, http } from 'viem';
import { sepolia } from 'viem/chains';

const NEXT_PUBLIC_URL = 'https://zizzamia.xyz';

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

export async function POST(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY! });

    if (!isValid) {
        return new NextResponse('Invalid Frame message', { status: 400 });
    }

    if (!message) {
        return new NextResponse('Invalid Frame message', { status: 400 });
    }

    const accountAddress = message.interactor.verified_accounts[0] as Address;

    // send transaction
    const account = await privateKeyToSafeSmartAccount(publicClient, {
        privateKey: privateKey as Address,
        safeVersion: "1.4.1", // simple version
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
        saltNonce: hexToBigInt(accountAddress)
    })

    const smartAccountClient = createSmartAccountClient({
        account,
        chain: sepolia,
        transport: http(bundlerUrl),
        sponsorUserOperation: paymasterClient.sponsorUserOperation,
    })
        .extend(bundlerActions)
        .extend(pimlicoBundlerActions)
        
    const gasPrices = await smartAccountClient.getUserOperationGasPrice()    
    
    console.log(gasPrices)

    smartAccountClient.sendTransaction({
        to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        data: "0x1234",
        maxFeePerGas: gasPrices.fast.maxFeePerGas,
        maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas,
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `View Smart Account`,
                    action: "post_redirect"
                },
            ],
            image: `${NEXT_PUBLIC_URL}/main.png`,
            post_url: `${NEXT_PUBLIC_URL}/api/etherscan`,
        }),
    );
    


}
  

export const dynamic = 'force-dynamic';