import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {apiFetch} from "../api/api";
import useAuth from "../hooks/useAuth";


export default function Login(){


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const {login}=useAuth();

const navigate=useNavigate();



async function submit(e){

e.preventDefault();


try{

const data =
await apiFetch("/login",
{

method:"POST",

body:JSON.stringify({
email,
password
})

});


login(data);

navigate("/dashboard");


}
catch(error){

alert(error.message);

}


}



return (

<form onSubmit={submit}>


<h2>Login</h2>


<input
placeholder="Email"
value={email}
onChange={
e=>setEmail(e.target.value)
}
/>



<input
type="password"
placeholder="Password"
value={password}
onChange={
e=>setPassword(e.target.value)
}
/>


<button>
Login
</button>


</form>

);


}

