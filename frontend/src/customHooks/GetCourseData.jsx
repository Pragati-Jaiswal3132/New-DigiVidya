import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCourseData } from '../redux/courseSlice.js';
import { useEffect } from 'react';
import React from 'react'

const GetCourseData = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user?.userData);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const endpoint = userData?.role === "educator"
          ? "/api/course/getcreatorcourses"
          : "/api/course/getpublishedcourses";

        const result = await axios.get(serverUrl + endpoint, { withCredentials: true });
        console.log(result.data);
        dispatch(setCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourses();
  }, [userData, dispatch])

}

export default GetCourseData


