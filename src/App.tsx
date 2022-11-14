import React, {FunctionComponent,useEffect, useState} from 'react';
import {useDispatch,useSelector} from "react-redux";
import './App.css';
import { manageAccess } from './redux/store/slice';


type AppProps = {
  simple: ''
}

const App:FunctionComponent<AppProps> = ({simple}) : JSX.Element => {

  let firstTimeRender = 1;

  let firstTimeRender2 = 1;

  const [rerender, setRerender] = useState(false);
 
  const [userData, setUserData] = useState('');

  const [user, setUser] = useState('');

  const [userFound, setUserFound] = useState(false);


  // user

  const [userInfo, setUserInfo] = useState({
    login: '',
    avatar_url: '',
    bio: '',
    name: '',
    followers: '',
    following: '',
    html_url: ''
  });

  const [userRepository, setUserRepository] = useState('');

  const [userRepositoryFound,setUserRepositoryFound] = useState(false);


const [userRepositoryInfo,setUserRepositoryInfo] = useState({
    avatar_url: '',
    bio: '',
    name: '',
    followers: '',
    following: '',
    html_url: '',
    language: '',
    description: '',
    created_at: ''
});

const dispatch:any = useDispatch();
const reduxStore = useSelector((state:any) => state.gitAppStore);
  
  useEffect(() => {

    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const codeParam = urlParams.get("code");

    console.log("code from front end",codeParam);
    if(!userData && localStorage.getItem("userData")) {
      setUserData(String(localStorage.getItem("userData")));
      console.log("yes",userData);
    }
   if(codeParam && localStorage.getItem("accessToken") === null) {
    async function getAccessToken() {
      
      await fetch('https://amalibackend.herokuapp.com/getAccessToken?code='+codeParam)
      .then(response => response.json())
      .then((data) => {
        if(data.access_token) {
          console.log("access token",data);
          localStorage.setItem("accessToken", data.access_token);
          getUserData();
          setRerender(!rerender);
          
        }
      })
      .catch(e => console.log(e.message));
     }
     getAccessToken();
   }
  }, [])

  async function getUserData() {
    await fetch('https://amalibackend.herokuapp.com/getUserData', {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken")
      }
     }).then(response => response.json())
     .then(data => {
      console.log(data);
      localStorage.setItem("userData",data.login);
     
      setUserData(String(localStorage.getItem("userData")));
     });
  }

  
  
  const urlLogin = `https://github.com/login/oauth/authorize?client_id=53baf17a04f30df3c2cf`;


  return (
    <div className='container'>
      

      {localStorage.getItem("accessToken") ? 
      
      <div>
        <div>
        
        <button className='AuthButton' onClick={() => {
          localStorage.removeItem('accessToken'); 
          setRerender(!rerender)}
        }>Logout</button>


        {
        userData ? 
      <div>
        <h1 className='userData'>Welcome to GITSEARCH  {localStorage.getItem("userData")}</h1>

          {/** 
           * search for github users
           */}
          {
      <form className='formUser' action='' method='get'>
      <input onChange={e => setUser(e.target.value)} value={user} className='searchInput' placeholder='Enter github username' />
      <button className='AuthButton' onClick={async (e) => {
       // search
       e.preventDefault();

       firstTimeRender++;

       await fetch('https://api.github.com/users/'+user)
        .then(d=>d.json())
        .then(d => {
          if(d.message) {
            if(d.message === 'Not Found') {
              throw new Error("Not Found");
            }
          }
          console.log("setting user to true",d);
          setUserFound(true);

          setUserInfo(d);

        })
        .catch(e=> {
          console.log("setting user to false",e.message);
          setUserFound(false);
        })
      }}>Search User</button>
     </form>
    }

    {userFound?
    
   <div>
    <h1 className='userData'>User found</h1>
    <div className='UserContainer'>
      <div className='UserAvatar'>
        <img src={userInfo.avatar_url} alt="ava" />
      </div>
      <div className='UserBasicInfo'>
        <h2>Name: {userInfo.name}</h2>
        <h2>Bio: {userInfo.bio}</h2>
        <h2>Followers: {userInfo.followers}</h2>
        <h2>Following: {userInfo.following}</h2>
      </div>
      <div className='UserLink'>
        <a href={userInfo.html_url} target="_blank">Visit My Github Profile</a>
      </div>
    </div>
    {
    <form className='formUser' action='' method='get'>
      <input onChange={e => setUserRepository(e.target.value)} value={userRepository} className='searchInput' placeholder='Enter repository name' />
      <button className='AuthButton' onClick={async (e) => {
       // search
       e.preventDefault();

       firstTimeRender2++;
        console.log("user repository, ",'https://api.github.com/users/'+user+'/repos')
       await fetch('https://api.github.com/users/'+user+'/repos?per_page=99')
        .then(d=>d.json())
        .then(d => {
          let f = 0;
          console.log(d);
          for(let i=0;i<d.length;i++) {
             if(userRepository === d[i].name) {
               setUserRepositoryFound(true);
    
              setUserRepositoryInfo(d[i]);
              f++;
              break;
            }
          }
          if(f===0) {
            throw new Error("Not Found");
          }
          

        })
        .catch(e=> {
          console.log("setting user repository to false",e.message);
          setUserRepositoryFound(false);
        })
      }}>Search {userInfo.login} repositories</button>
     </form>
}
{
  userRepositoryFound?
  <div>
  <h1 className='userData'>Repository found</h1> 
  <div className='UserContainer'>
      <div className='UserBasicInfo'>
        <h2>Repository description: {userRepositoryInfo.description}</h2>
        <h2>Repository language: {userRepositoryInfo.language}</h2>
        <h2>Repository creation date: {userRepositoryInfo.created_at}</h2>
        
      </div>
      <div className='UserLink'>
        <a href={userRepositoryInfo.html_url} target="_blank">Visit Repository on Github</a>
      <button className='AuthButton' onClick={e=> {
        let info = {
          login: userInfo.login,
          description: userRepositoryInfo.description,
          html_url: userRepositoryInfo.html_url,
        }


        
        dispatch(manageAccess(info));


      }}>Add To History</button>
      </div>
    </div>
</div>:
  <div>
  <h1 className='userData'>Enter valid github repository name</h1> 
</div>
}
  </div>
  :
  <div>
    <h1 className='userData'>Enter valid github name</h1> 
  </div>
  }

    
        </div>
        :
        <div>
          <h1 className='userData'>Loading ...</h1>
        </div>
      }
      </div>
      <div>
      <div>
      <h1 className='userData'>Saved Searches</h1>
      </div>
      <div className='HistoryContainer'>
        {
          reduxStore.map((data,index)=> {
            if(!data) {
              return;
            }
            return <div key={index} className='UserContainer'>
              <h1 className='userData'>Repository Owner: {data.login}</h1>
              <a href={data.html_url} target="_blank">Go to repository</a>
              <h1 className='userData'>Description: {data.description}</h1>
            </div>
          })
        }
      </div>
      
      </div>
      </div>
      :
      <div>
        <h1 className='userData'>LOGIN TO USE GITSEARCH</h1>
        <a
        href={urlLogin}>Log in with Github</a>
      </div>  
    }

    
    </div>
  );
}

export default App;
