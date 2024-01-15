import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./command.css"

function Product() {
  const [paid, setPaid] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { id } = useParams();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')

  

  

  useEffect(() => {
    checkAuthenticationStatus();
  });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const PayCommand = async () => {

    
    try {
      const response = await axios.post("http://localhost:8082/payments", {
        idCommand: id,
        montant: 50.99,
        numeroCarte: 1234567890123456,
      });

      console.log("Response from server:", response.data);
      setPaid(true);
    } catch (error) {
      console.error("Error sending data:", error);
     
    }
  };



  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8089/login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

       // setAuthenticated(true);
       
        console.log("logged in successfully!") 
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8089/signup", {
        username,
        password,
      });

      if (response.data.token) {
        
        setAuthenticated(true);
      

        console.log("signed up successfully")
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  

  const checkAuthenticationStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if(token){
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
    }
  };

 

  return (
    <div className="flex flex-col justify-center items-start w-full">
      <div className="flex justify-center items-center w-full my-12">
        <h1 className="text-3xl font-bold">Application Mcommerce</h1>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center gap-6 w-full my-2">
          {!paid ? (
            <>
              <p className="border border-black rounded-md p-2 text-base font-normal text-black text-center max-w-[350px]">
                Ici l'utilisateur sélectionne en temps normal un moyen de
                paiement et entre les informations de sa carte bancaire. Nous
                allons éviter d'ajouter les formulaires nécessaires afin de
                garder l'application la plus basique et simple possible pour la
                suite. Si vous vous sentez à l'aise, vous pouvez créer un
                formulaire pour accepter le numéro de la CB, que vous traiterez
                dans le contrôleur grâce à un PostMapping.
              </p>
              {authenticated && <button
                className="text-xl font-medium text-center p-4 rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
                onClick={PayCommand}
              >
                Payer Ma Commande
              </button>}
            </>
          ) : (
            <p className="text-2xl font-black text-green-600 text-center max-w-[350px]">
              Paiement Accepté
            </p>
          )}
        </div>
      </div>
      {!authenticated && (
      <div id="authModal" className="modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">You need to authenticate first !</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" className="form-control" id="username"  value={username}
          onChange={handleUsernameChange}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" value={password}
          onChange={handlePasswordChange} />
                </div>
                <button type="button" className="btn btn-primary" style={{marginLeft:"2rem",backgroundColor:"green"}} onClick={()=>{login(username,password);}}>
                  Sign In
                </button>
                <button type="button" className="btn btn-success" style={{marginLeft:"2rem",backgroundColor:"blue"}} onClick={()=>{signup(username,password);}}>
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>)}

    </div>
  );
}

export default Product;
