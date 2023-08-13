import { ReactNode, createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios';
import { error } from 'console';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
    user: any;
    authTokens: any;
    errorLogIn: { [key: string]: string } | null;
    errorSignUp: { [key: string]: string[] } | null;
    loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    signupUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    logoutUser: () => void;
  }
  
  const AuthContext = createContext<AuthContextData>({
    user: null,
    authTokens: null,
    errorLogIn: null,
    errorSignUp: null,
    loginUser: async (e: React.FormEvent<HTMLFormElement>) => {},
    signupUser: async (e: React.FormEvent<HTMLFormElement>) => {},
    logoutUser: () => {},
  });

export default AuthContext;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    let [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        if (storedTokens) {
          const decodedUser = jwtDecode(storedTokens);
          if (decodedUser) {
            return decodedUser;
          }
        }
        return null; // Or any other default value
      });
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') as string) : null));
    let [loading, setLoading] = useState(true)
    let [errorLogIn, setErrorLogIn] = useState<{ [key: string]: string } | null>(null);
    let [errorSignUp, setErrorSignUp] = useState<{ [key: string]: string[] } | null>(null);

    const navigate = useNavigate()

    let loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const formData = new FormData(e.currentTarget);
          const username = formData.get('login') as string;
          const password = formData.get('password') as string;
      
          const response = await axios.post('http://127.0.0.1:8000/api/token/', {
            username,
            password,
          });
      
          let data = response.data;
      
          if (response.status === 200) {
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            navigate('/');
            setErrorSignUp(null)
            setErrorLogIn(null)
          } else {
            
            console.log('Something went wrong while logging in the user!');
          }
        } catch (err) {
          
          if (axios.isAxiosError(err)) {
            // console.log(err)
            if(err.code === "ERR_NETWORK"){
    
              setErrorLogIn({error:'Something went wrong while signing up the user!' })
              console.log(errorLogIn)
            }
            else{
              // console.log(err)
              setErrorLogIn(err.response?.data)
              // console.log(errorSignUp)
            }
            
          }
          console.log('An error occurred while signing up the user!');
        }
      };
      let logoutUser = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) {
          e.preventDefault();
        }
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
    }
    let signupUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const formData = new FormData(e.currentTarget);
          const username = formData.get('login') as string;
          const password = formData.get('password') as string;
          const confirm = formData.get('confirm') as string;
          const email = formData.get('email') as string;
      
          const response = await axios.post('/register/', {
            username,
            password,
            confirm,
            email,
          });
      
          let data = response.data;
          // console.log(data)
          if (response.status === 200) {
            // Perform login after successful signup
            // console.log(data)
            const loginResponse = await axios.post('http://127.0.0.1:8000/api/token/', {
              username,
              password,
            });
      
            const loginData = loginResponse.data;
            // console.log(loginResponse)
            if (loginResponse.status === 200) {
              localStorage.setItem('authTokens', JSON.stringify(loginData));
              setAuthTokens(loginData);
              setUser(jwtDecode(loginData.access));
              navigate('/');
              setErrorSignUp(null)
              setErrorLogIn(null)
            } else {
              console.log('Something went wrong while logging in the user!');
            }
          } else {
            // console.log(data)
            console.log(response.status)
            
            console.log('Something went wrong while signing up the user!');
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if(err.response?.status === 500){
              setErrorSignUp({error:['Something went wrong while signing up the user!']})
            }
            else{
              // console.log(err)
              setErrorSignUp(err.response?.data)
              // console.log(errorSignUp)
            }
            
          }
          console.log('An error occurred while signing up the user!');
        }
      };
    const updateToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({refresh:authTokens?.refresh})
        })
       
        const data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        errorLogIn: errorLogIn,
        authTokens:authTokens,
        errorSignUp: errorSignUp,
        loginUser:loginUser,
        logoutUser:logoutUser,
        signupUser:signupUser,
    }

    useEffect(()=>{
        const REFRESH_INTERVAL = 1000 * 60 * 30 // 30 minutes
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}