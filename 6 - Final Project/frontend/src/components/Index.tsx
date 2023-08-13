import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";

interface ProfileData {
    username: string;
    email: string;
  }

const Index: React.FC = () =>{

    const { authTokens, logoutUser } = useContext(AuthContext);
    let [profile, setProfile] = useState<ProfileData | null>(null)
    // console.log(localStorage)
    const navigate = useNavigate();
    useEffect(() => {
        getProfile()
    },[])

    const getProfile = async () => {
        try {
          const response = await axios.get('/index/', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
          });
    
          const data = response.data;
          // console.log(data)
          if (response.status === 200) {
            setProfile(data);
          }
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          } else {
            // Handle other errors here
            console.error('Error fetching profile:', error);
          }
        }
      };
    

    return (
        <div>
            <p>You are logged in to the homepage!</p>
            <p>Name: {profile?.username}</p>
            <p>Email: {profile?.email}</p>
            <button type='button' onClick={() => navigate('/profile')}>Create Profile</button>
        </div>
    )
}
export default Index;