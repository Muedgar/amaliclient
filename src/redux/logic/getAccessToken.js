


const getAccessToken = async (codeParam) => { 
      
    await fetch('http://localhost:3005/getAccessToken?code='+codeParam)
    .then(response => response.json())
    .then((data) => {
      if(data.access_token) {
        console.log("access token",data);
        // localStorage.setItem("accessToken", data.access_token);
        // getUserData();
        // setRerender(!rerender);
        return data.access_token;
      }
    })
    .catch(e => console.log(e.message));
   }

export default getAccessToken;
