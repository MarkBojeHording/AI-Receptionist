import Head from 'next/head'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>AI Receptionist</title>
        <meta name="description" content="AI Receptionist for automated customer service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Welcome to <span className="highlight">AI Receptionist</span>
        </h1>

        <p className="description">
          Your automated customer service solution
        </p>

        <div className="status">
          <p>Status: Ready to receive messages</p>
          <p>API Endpoint: /api/chat</p>
        </div>
      </main>
    </div>
  )
}
