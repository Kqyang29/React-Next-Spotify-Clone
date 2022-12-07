import Head from 'next/head'
import Sidebar from '../components/Sidebar';
import Center from '../components/Center';
import Player from '../components/Player';
import { getSession } from 'next-auth/react';


function Home() {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <Head>
        <title>Spotify Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex'>
        {/* sidebar */}
        <Sidebar />

        {/* center */}
        <Center />
      </main>

      <div className='sticky bottom-0'>
        {/* player */}
        <Player />
      </div>

    </div>
  )
}

export default Home;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  }
};
