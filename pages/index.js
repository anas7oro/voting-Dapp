import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Countdown from 'react-countdown';

import { VotingContext } from '../context/Voter';
import Style from '../styles/index.module.css';
import Card from "../components/Card/Card";

const Index = () => {
  const {
    getNewCandidate,
    voterLength,
    currentAccount,
    candidateArray,
    getAllVoterData,
    giveVote,
    checkIfWalletIsConnected,
    candidateLength
  } = useContext(VotingContext);

  // Fetch wallet connection status and candidate data
  useEffect(() => {
    checkIfWalletIsConnected(); // Ensure wallet is connected
    getNewCandidate();    
    getAllVoterData();      
  }, []);

  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                No Candidate: <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                No Voter: <span>{voterLength}</span>
              </p>
            </div>
          </div>

          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 100000} />
            </small>
          </div>
        </div>
      )}

      {/* Render the list of candidates */}
      {candidateArray && candidateArray.length > 0 ? (
        <Card candidateArray={candidateArray} giveVote={giveVote} />
      ) : (
        <p>No candidates available</p>
      )}
    </div>
  );
};

export default Index;
