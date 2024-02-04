import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Deploy Smart Account'
    }
  ],
  image: `${NEXT_PUBLIC_URL}/main.png`,
  post_url: `${NEXT_PUBLIC_URL}/api/account`,
});

export const metadata: Metadata = {
  title: 'Smart Account Frame Template',
  description: 'LFG',
  openGraph: {
    title: 'Smart Account Frame Templatess',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/main.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Smart Account Frame Template</h1>
    </>
  );
}