import { useEffect } from "react"
import { serverUrl } from "../App"
import axios from "axios"
import { useDispatch} from "react-redux"
import { setUserData } from "../redux/userSlice"
const GetCurrentUser = ()=>{
    let dispatch = useDispatch()
   
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                let result = await axios.get(serverUrl + "/api/user/currentuser" , {withCredentials:true})
                dispatch(setUserData(result.data))

            } catch (error) {
                // 400 indicates missing/invalid token; do not spam console
                if (error?.response?.status !== 400) {
                    console.log(error)
                }
                dispatch(setUserData(null))
            }
        }
        fetchUser()
    },[])
}

export default GetCurrentUser