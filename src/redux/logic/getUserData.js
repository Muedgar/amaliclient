const getUserData = async (accessToken) => {
    await fetch('http://localhost:3005/getUserData', {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + accessToken
      }
     }).then(response => response.json())
     .then(data => {
      console.log(data);
      // localStorage.setItem("userData",data.login);
     
    //   setUserData(String(localStorage.getItem("userData")));
    return data.login;
     });
  }

  export default getUserData;