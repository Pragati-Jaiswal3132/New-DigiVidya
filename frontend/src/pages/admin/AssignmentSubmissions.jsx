import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeftLong } from 'react-icons/fa6';

function AssignmentSubmissions() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [grading, setGrading] = useState({});
  const [loading, setLoading] = useState(false);

  const loadSubmissions = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/assignments/${assignmentId}/submissions`, { withCredentials: true });
      setSubmissions(res.data);
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || 'Failed to load submissions');
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [assignmentId]);

  const grade = async (submissionId) => {
    const { grade, feedback } = grading[submissionId] || {};
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/submissions/${submissionId}/grade`,
        { grade, feedback },
        { withCredentials: true }
      );
      toast.success('Graded');
      setSubmissions((prev) => prev.map((s) => (s._id === submissionId ? res.data : s)));
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || 'Failed to grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer' onClick={() => navigate(`/assignments/${courseId}`)} />
          <h1 className="text-xl font-semibold">Submissions</h1>
        </div>

        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s._id} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.student?.name}</div>
                  <div className="text-sm text-gray-600">Submitted: {new Date(s.createdAt).toLocaleString()}</div>
                  {s.contentUrl && (
                    <a className="text-sm text-blue-600 underline" href={s.contentUrl} target="_blank" rel="noreferrer">View Attachment</a>
                  )}
                  {s.textAnswer && <p className="text-sm mt-1">{s.textAnswer}</p>}
                </div>
                <div className="text-sm">
                  <div>Grade: {s.grade ?? '—'}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                <input
                  type="number"
                  placeholder="Grade"
                  className="border p-2 rounded"
                  onChange={(e) => setGrading((g) => ({ ...g, [s._id]: { ...g[s._id], grade: Number(e.target.value) } }))}
                />
                <input
                  type="text"
                  placeholder="Feedback"
                  className="border p-2 rounded md:col-span-2"
                  onChange={(e) => setGrading((g) => ({ ...g, [s._id]: { ...g[s._id], feedback: e.target.value } }))}
                />
              </div>
              <button className="mt-2 px-3 py-1 bg-black text-white rounded" disabled={loading} onClick={() => grade(s._id)}>
                {loading ? <ClipLoader size={16} color="white" /> : 'Submit Grade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignmentSubmissions;
