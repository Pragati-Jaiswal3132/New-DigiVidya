import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const GetCreatorCourseData = () => {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  return (
    useEffect(() => {
      const getCreatorData = async () => {
        try {
          // Only fetch for authenticated educators
          if (!userData || userData.role !== "educator") return
          const result = await axios.get(
            serverUrl + "/api/course/getcreatorcourses",
            { withCredentials: true }
          )
          await dispatch(setCreatorCourseData(result.data))
          console.log(result.data)
        } catch (error) {
          // Avoid noisy errors for unauthenticated users
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message)
          }
          console.log(error)
        }
      }
      getCreatorData()
    }, [userData])
  )
}

export default GetCreatorCourseData
