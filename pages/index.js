export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Receptionist</h1>
      <p style={styles.description}>Status: Running</p>
      <p style={styles.description}>API Endpoint: /api/chat</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#f9f9f9',
    color: '#111',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#0070f3',
  },
  description: {
    fontSize: '1.2rem',
    margin: '0.2rem 0',
  },
};
