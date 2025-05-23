import React from 'react';


const Login = (props) => {
  return (
    <div className='login-container '>
        <h1 className='welcome-message'>Welcome to Decentralized Voting Application</h1>
        <button className='login-button' onClick={props.connectWallet}>Connect Wallet</button>
    </div>
  )
}

export default Login;
