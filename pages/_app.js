import '../app/globals.css';
import { VotingProvider } from '../context/Voter';
import NavBar from '../components/NavBar/NavBar';

function MyApp({ Component, pageProps }) {
  return (  // Added return statement here
    <VotingProvider>
      <div> 
        <NavBar />
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </VotingProvider>
  );
}

export default MyApp;
