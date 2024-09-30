import { useState } from "react";
import axios from "axios";
import Cookies from 'universal-cookie';

const loginURL = "http://localhost:3000/login";
const changeURL = "http://localhost:3000/changeName";

const cookies = new Cookies();

export default function App() {
  const [name,setName] = useState("");
  const [newName,setNewName]= useState("");
  const [password,setPassword] = useState("");
  const [authenticated,setAuthenticated] = useState(false);

  const login = async(e:Event)=>{
    e.preventDefault();
    const response = await axios.post(loginURL,{"name":name,"password":password});
    if (response.status === 200){
      cookies.set(name,response.data.token);
      setAuthenticated(true);
    }else{
      console.log("Invalid credentials");
    };
  };

  const logout = async(e:Event)=>{
    e.preventDefault();
    cookies.remove(name);
    setAuthenticated(false);
  };

  const changeName = async(e:Event)=>{
    e.preventDefault();
    const headers = {
      headers: {
        Authorization: 'Bearer ' + cookies.get(name),
      }
     }
    
    await axios.post(changeURL,{"user":{"name":newName,}},headers);
    cookies.set(newName,cookies.get(name))
    cookies.remove(name);
    setName(newName);
  };

  return (
    <div>
      <h1>Login Form</h1>
      {!authenticated &&

      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={login}
      >
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
        Password
        <input value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
}
      {authenticated &&
            <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={changeName}
          >
            New Name
            <input value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit">Change Name</button>
            <button type="button" onClick={logout}>Logout</button>

          </form>
      }
    </div>

)
};

