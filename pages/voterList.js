import React , {useEffect , useState , useContext} from 'react'



import VoterCard from '../components/VoterCard/VoterCard'
import Style from '../styles/voterList.module.css'
import { VotingContext } from '../context/Voter'

const VoterList = () => {
  const {getAllVoterData , voterArray} = useContext(VotingContext)
  useEffect(() =>{
    getAllVoterData();
  },[])

  return (
    <div className={Style.voterList}>
      <VoterCard voterArray={voterArray} />
    </div>
  )
}

export default VoterList
