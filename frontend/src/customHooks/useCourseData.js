import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCourseData } from '../redux/courseSlice';
import { serverUrl } from '../App';

const useCourseData = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user?.userData);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Always load published courses into the global explore list.
        // Creator-specific courses are fetched separately via useCreatorCourseData.
        const result = await axios.get(serverUrl + '/api/course/getpublishedcourses', { withCredentials: true });
        dispatch(setCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, [userData, dispatch]);
};

export default useCourseData;
