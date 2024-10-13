import React, { useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillLock, AiFillUnlock } from "react-icons/ai"; // Correct import

import { VotingContext } from '../../context/Voter';
import Style from './NavBar.module.css';
import loading from '../../assets/loading.png'; // Ensure this is correct

const NavBar = () => {
  const { connectWallet, currentAccount } = useContext(VotingContext); // Removed 'error'
  const [openNav, setOpenNav] = useState(true);

  const openNavigation = () => {
    setOpenNav(!openNav);
  };

  return (
    <div className={Style.navBar}>
      <div className={Style.navBar_box}>
        <div className={Style.title}>
          <Link href={{ pathname: '/' }}>
            <Image src={loading} alt="logo" width={80} height={80} />
          </Link>
        </div>

        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={openNavigation}>
                  {currentAccount.slice(0, 10)}...
                </button>
                {currentAccount && (
                  <span>
                    {openNav ? (
                      <AiFillUnlock onClick={openNavigation} />
                    ) : (
                      <AiFillLock onClick={openNavigation} />
                    )}
                  </span>
                )}
              </div>

              {openNav && (
                <div className={Style.navigation}>
                  <p>
                    <Link href={{ pathname: '/' }}>home</Link>
                  </p>
                  <p>
                    <Link href={{ pathname: 'candidate-registration' }}>candidate registration</Link>
                  </p>
                  <p>
                    <Link href={{ pathname: 'allowed-voters' }}>voter registration</Link>
                  </p>
                  <p>
                    <Link href={{ pathname: 'voterList' }}>voter list</Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => connectWallet()}>connect wallet</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
