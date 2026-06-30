import { useState } from "react";
import API from "../api/api";


function Register(){
    const[name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleRegister =async () => {
        try{
            await API.post("/register",{
                name,
                email,
                password,
            });

            alert("REGISTER SUCCESSFUL");
            window.location.href="/login";

        }catch(err){
            console.log(err.response?.data);
            console.log(err.message);
            alert("Register failed");
        }
        
    };
    return(
        <div>
            <h1>Register</h1>
            <input
            placeholder="name"
            onChange={(e)=> setName(e.target.value)}></input>
            <input
            placeholder="email"
            onChange={(e)=> setEmail(e.target.value)}></input>
            <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>REGISTER</button>
            
        </div>
    );
}

export default Register;