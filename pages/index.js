import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [frontendPort, setFrontendPort] = useState('3000')

  useEffect(() => {
    // Detect frontend port
    setFrontendPort(window.location.port || '3000')

    // Check backend status
    fetch('http://localhost:3001/health')
      .then(response => response.json())
      .then(data => {
        setBackendStatus('Connected')
      })
      .catch(error => {
        setBackendStatus('Not Connected')
      })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Receptionist</title>
        <meta name="description" content="AI Receptionist for automated customer service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>AI Receptionist</h1>
      <div className={styles.statusContainer}>
        <p className={styles.description}>Frontend: Running (Port {frontendPort})</p>
        <p className={styles.description}>Backend: {backendStatus} (Port 3001)</p>
        <p className={styles.description}>API Endpoint: /api/chat</p>
      </div>
    </div>
  );
}
