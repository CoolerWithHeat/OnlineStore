import React from "react";
import { ErrorWindow, GetHost, Get_Static_Url, ProviderButton } from "./components";
import {GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, getAuth, getRedirectResult, signInWithRedirect, onAuthStateChanged} from "firebase/auth";
import firebaseConfig from "./firebase";
import { initializeApp, registerVersion } from "firebase/app";
import jwtDecode from 'jwt-decode'
import { json } from "react-router-dom";

function AccountLoginRegisterform(){
    const LoginButton = React.useRef() 
    const SignUpButton = React.useRef()
    var [LoginWindow, Update_openedWindow] = React.useState(false)


    async function getStyle(){
        let obj = await import('./css_files/loginForm.css');
    }

    getStyle()

    var [RegisterCredentials, UpdateRegisterCredentials] = React.useState({email: '', password1: '', password2: ''})
    var [LoginCredentials, UpdateLoginCredentials] = React.useState({email: '', password: ''})
    var [ErrorState, UpdateErrorState] = React.useState(false)
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    React.useEffect(() => {

        getRedirectResult(auth)
            .then((ProviderResponse) => {
                if (ProviderResponse){
                    const ProviderSource = ProviderResponse.providerId;
                    const providerName = ProviderSource.split('.')[0];
                    const BackendRequest = fetch(GetHost() + '/SignUp/', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        },
                        body: JSON.stringify({[providerName]: ProviderResponse}),
                    })
                    .then((Main) => {
                        
                        if (Main.status === 200) {
                            Main.json().then(UserCreds=>{
                                localStorage.setItem('WebKey', UserCreds.token)
                                return window.location.pathname = '../Main'
                            })
                        }
                        

                    })

                }
            }
                )
                
            .catch((error) => {
                console.error(error)
            });

      }, []);

    const StartOauth2Authentication = (AuthType) => {
        
        if (AuthType === 'google') {
            const googleProvider = new GoogleAuthProvider();
            signInWithRedirect(auth, googleProvider);
        } else if (AuthType === 'facebook') {
            const facebookProvider = new FacebookAuthProvider();
            signInWithRedirect(auth, facebookProvider);
        }
          
        
    }

    const UpdateCredentials = (InputBase) => {
        const indexData = InputBase.target.name;
        const value = InputBase.target.value;

        UpdateRegisterCredentials((InitialState)=>{
            return {...RegisterCredentials, [indexData]: value}
        })

    }


    const UpdateCredentialsForLogin = (InputBase) => {

        const indexData = InputBase.target.name;
        const value = InputBase.target.value;

        UpdateLoginCredentials((InitialState)=>{
            return {...LoginCredentials, [indexData]: value}
        })

    }

    function CheckIfDataValid(){

        if (!RegisterCredentials.password1 || !RegisterCredentials.password2){
            UpdateErrorState((InitialState)=>{
                return 'make sure to provide data to each field';
            })

            return false
        }
        
        if (!(RegisterCredentials.password1 == RegisterCredentials.password2)){
            
            UpdateErrorState((InitialState)=>{
                return 'passwords does not match!';
            })

            return false

        }

        

        if (RegisterCredentials.password1.length < 8){
            
            UpdateErrorState((InitialState)=>{
                return 'password has to be at least 8 characters';
            })

            return false

        }

        if (!(RegisterCredentials.email.endsWith("@gmail.com"))){
            
            UpdateErrorState((InitialState)=>{
                return 'make sure to provide valid Gmail address';
            })

            return false

        }

        return true

    }

    function SubmitToBackend(){

        if (CheckIfDataValid()){

            UpdateErrorState(()=>false)

            async function ManageRequest(){
                
                const BackendRequest = await fetch(GetHost()+`/SignUp/`, {

                    method:'POST',
                    
                        headers: {
                            
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',

                        },

                    body: JSON.stringify({custom: RegisterCredentials}),

                })
                const response = await BackendRequest.json()

                if (BackendRequest.status==200){
                    localStorage.setItem('WebKey', response.token)
                    window.location.href = '../Main/'

                }
                else if (BackendRequest.status==500){
                    UpdateErrorState(()=>response.error)
                }
                    

       
            }
            
            ManageRequest()
        }

    }

    function SubmitToBackendForLogin(){

        if (!(LoginCredentials.email.endsWith("@gmail.com"))){
            UpdateErrorState((InitialState)=>{
                return 'make sure to provide valid Gmail address';
            })

        }
        else if (LoginCredentials.password.length < 8){
            UpdateErrorState((InitialState)=>{
                return 'password has to be at least 8 characters';
            })

        }else{

            UpdateErrorState((InitialState)=>{
                return false;
            })

            async function ManageRequest(){

                const BackendRequest = await fetch(GetHost()+`/SignIn/`, {

                    method:'POST',
                    
                    headers: {
                        
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',

                    },

                    body: JSON.stringify({credentials: LoginCredentials}),

                })

                const response = await BackendRequest.json();

                if(BackendRequest.status == 200){
                    localStorage.setItem('WebKey', response.token)
                    window.location.href = '../Main/'
                }

                else if (BackendRequest.status == 500){
                    UpdateErrorState((InitialState)=>{
                        return response.error;
                    })
                }

            }

            ManageRequest()
        }
    }

    React.useEffect(Main=>{
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                
                if (LoginWindow){
                    LoginButton.current.click()
                }
                else    {
                    SignUpButton.current.click()

                }
            }

          };
        document.addEventListener('keydown', handleKeyPress);
    }, [LoginWindow])

    function ChangeOpenedWindow(){
        Update_openedWindow(Main=>!LoginWindow)
    }

        return (
            <div className="main">  	
            
                <input type="checkbox" id="chk" aria-hidden="true"/>

                    <div className="signup">
                        {ErrorState ? <ErrorWindow text={ErrorState}/> : null}
                            
                            <label onClick={ChangeOpenedWindow} htmlFor="chk" aria-hidden="true">Sign up</label>
                            <input className="form-control" onChange={UpdateCredentials} type="email" name="email" placeholder="Email adress" required={true}/>
                            <input className="form-control" onChange={UpdateCredentials} type="password" name="password1" placeholder="Password" required={true}/>
                            <input className="form-control" onChange={UpdateCredentials} type="password" name="password2" placeholder="confirm your password" required={true}/>
                            <button onClick={SubmitToBackend} ref={SignUpButton} >Sign up</button>
                            
                            <div id="ButtonWindow">
                    
                                <button className="btn btn-light" onClick={()=>StartOauth2Authentication("google")} id="AuthButton"><img id="ProviderButtonImage" src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png"/></button>
                                <button className="btn btn-light" onClick={()=>StartOauth2Authentication("facebook")} id="AuthButton"><img id="ProviderButtonImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"/></button>
                                
                            </div>

                    </div>

                    <div className="login">
                            <label onClick={ChangeOpenedWindow} htmlFor="chk" aria-hidden="true">Login</label>
                            <input className="form-control" onChange={UpdateCredentialsForLogin} type="email" name="email" placeholder="Email" required=""/>
                            <input className="form-control" onChange={UpdateCredentialsForLogin} type="password" name="password" placeholder="Password" required=""/>
                            <button ref={LoginButton} id="LoginButton" onClick={SubmitToBackendForLogin}>Login</button>
                            <div id="ButtonWindow">
                    
                                <button className="btn btn-light" onClick={()=>StartOauth2Authentication("google")} id="AuthButton-login"><img id="ProviderButtonImage" src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png"/></button>
                                <button className="btn btn-light" onClick={()=>StartOauth2Authentication("facebook")} id="AuthButton-login"><img id="ProviderButtonImage" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"/></button>
 
                            </div>
                    </div>
            </div>
        )
    }

export default AccountLoginRegisterform;