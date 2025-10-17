import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeftLong } from 'react-icons/fa6';

function StudentAssignment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState(null);
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

  const loadGrades = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/${courseId}/grades`, { withCredentials: true });
      setGrades(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadAssignments();
    loadGrades();
  }, [courseId]);

  const submit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const form = new FormData();
      if (file) form.append('content', file);
      if (textAnswer) form.append('textAnswer', textAnswer);
      const res = await axios.post(
        `${serverUrl}/api/assignments/${selected}/submissions`,
        form,
        { withCredentials: true }
      );
      toast.success('Submitted');
      setTextAnswer('');
      setFile(null);
      loadGrades();
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer' onClick={() => navigate(`/viewlecture/${courseId}`)} />
          <h1 className="text-xl font-semibold">Assignments</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Available Assignments</h2>
            <ul className="space-y-2">
              {assignments.map((a) => (
                <li key={a._id} className={`border rounded p-3 cursor-pointer ${selected===a._id? 'bg-gray-50':''}`} onClick={() => setSelected(a._id)}>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-gray-600">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'} | Max: {a.maxPoints}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Submit</h2>
            <textarea className="border p-2 rounded w-full mb-2" rows={4} placeholder="Text answer (optional)" value={textAnswer} onChange={(e)=>setTextAnswer(e.target.value)} />
            <input type="file" className="border p-2 rounded w-full" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
            <button className="mt-2 bg-black text-white px-4 py-2 rounded" disabled={loading} onClick={submit}>
              {loading ? <ClipLoader size={16} color="white" /> : 'Submit'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h2 className="font-semibold mb-2">My Grades</h2>
          {grades ? (
            <div className="text-sm">
              <div>Total Earned: {grades.totalEarned}</div>
              <div>Total Possible: {grades.totalPossible}</div>
              <div>Overall: {grades.percent}%</div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No grades yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentAssignment;
