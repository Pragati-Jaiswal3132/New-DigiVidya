import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeftLong } from 'react-icons/fa6';

function Assignments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState(100);
  const [loading, setLoading] = useState(false);

  const loadAssignments = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/${courseId}/assignments`, { withCredentials: true });
      setAssignments(res.data);
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || 'Failed to load assignments');
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [courseId]);

  const createAssignment = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/course/${courseId}/assignments`,
        { title, description, dueDate, maxPoints },
        { withCredentials: true }
      );
      toast.success('Assignment created');
      setTitle('');
      setDescription('');
      setDueDate('');
      setMaxPoints(100);
      setAssignments([res.data, ...assignments]);
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className='flex items-center gap-3'>
            <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer' onClick={() => navigate(`/addcourses/${courseId}`)} />
            <h1 className="text-xl font-semibold">Assignments</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Points"
            className="border p-2 rounded"
            value={maxPoints}
            onChange={(e) => setMaxPoints(Number(e.target.value))}
          />
          <textarea
            placeholder="Description"
            className="border p-2 rounded md:col-span-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button className="bg-black text-white px-4 py-2 rounded" disabled={loading} onClick={createAssignment}>
          {loading ? <ClipLoader size={20} color="white" /> : 'Create Assignment'}
        </button>

        <div className="pt-4">
          <h2 className="font-semibold mb-2">Existing</h2>
          <ul className="space-y-2">
            {assignments.map((a) => (
              <li key={a._id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-gray-600">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'} | Max: {a.maxPoints}</div>
                  </div>
                  <button className="text-sm px-3 py-1 border rounded" onClick={() => navigate(`/assignments/${courseId}/${a._id}`)}>View Submissions</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Assignments;
