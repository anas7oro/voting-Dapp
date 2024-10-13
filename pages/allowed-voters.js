import React , {useEffect , useState , useCallback , useContext} from 'react'
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';


import { VotingContext } from '../context/Voter';
import Style from '../styles/allowedVoter.module.css';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import uploadImage from '../assets/upload.png';
import profileImage from '../assets/profile (Small).png'

const allowedVoters = ()=>{
  const [fileUrl , setFileUrl] = useState(null);
  const [formInput , setFormInput] = useState({
    name: "",
    address: "",
    position: ""
  });

  const router = useRouter();
  const {uploadToIPFS , createVoter , voterArray , getAllVoterData} = useContext(VotingContext)

  ///voter image drop

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];  // Get the selected file
  
    // Upload file to IPFS using the context function
    const ipfsUrl = await uploadToIPFS(file);
  
    // Set the IPFS URL to display the image uploaded to IPFS, not a local one
    setFileUrl(ipfsUrl); 
  }, [uploadToIPFS]);
  

  const {getRootProps , getInputProps}=useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000
  });

  useEffect(()=>{
    getAllVoterData();
  }, [])

  //jsx

  return (
  <div className={Style.createVoter}>
    <div>
      {fileUrl && (
        <div className={Style.voterInfo}>
          <img src={fileUrl} alt="Voter image"/>
          <div className={Style.voterInfo_paragraph}>
            <p>
              Name: <span> &nbps; {formInput.name}</span>
            </p>
            <p>
              address: <span> &nbps; {formInput.address.slice(0,20)}</span>
            </p>
            <p>
              position: <span> &nbps; {formInput.position}</span>
            </p>
            
          </div>
        </div>
      )}
      {
        !fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>create candidate for voting</h4>
                <p>
                  blockchain voting system built with ethereum
                </p>
                <p className={Style.sideInfo_para}>
                  contract candidate list
                </p>
            </div>

            <div className={Style.card}>
              {voterArray.map((el, i) => {
                <div key={i+1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[4]} alt="profile photo" />
                  </div>

                  <div className={Style.card_info}>
                    <p>
                      {el[1]}
                    </p>
                    <p>
                      Address: {el[3].slice(0,10)}...
                    </p>
                  </div>
                </div>
              })}
            </div>
          </div>   
        )
      }
      
    </div>
    <div className={Style.voter}>
      <div className={Style.voter__container}>
        <h1>create new voter</h1>
        <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={Style.voter__container__box__div__info}>
                  <p>upload file : JPG, PNG, GIF ,WEBM MAX 10MB</p>

                  <div className={Style.voter__container__box__div__image}>
                    <Image src={uploadImage}  width={150} height={150} objectFit='contain'
                    alt="File upload" />
                  </div>
                  <p>Drag & drop file</p>
                  <p>or browse media on your device</p>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div className={Style.input__container}>
        <Input inputType="text" title="name" placeholder='voter name' handleClick={(e) => setFormInput({...formInput, name: e.target.value })} />
        <Input inputType="text" title="address" placeholder='voter address' handleClick={(e) => setFormInput({...formInput, address: e.target.value })} />
        <Input inputType="text" title="position" placeholder='voter position' handleClick={(e) => setFormInput({...formInput, position: e.target.value })} />      

        <div className={Style.Button}>
          <Button btnName="Authorized voter" handleClick={() => createVoter(formInput ,fileUrl , router)} />
        </div>
      </div>
    </div>
    
    <div className={Style.createdVoter}>
      <div className={Style.createdVoter__info}>
        <Image src={profileImage} alt="user profile" />
        <p>notice for user</p>
        <p>organizer <span>0x987890789</span></p>
        <p>only organizer of the voting contract can create voter for the voting election</p>
      </div>
    </div>
  </div>
  );
};


export default allowedVoters
