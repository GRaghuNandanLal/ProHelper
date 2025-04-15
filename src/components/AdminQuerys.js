import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';

const AdminQuerys = () => {
  const [queries, setQueries] = useState([]);
  const navigate = useNavigate();

  // Fetch unanswered queries from Firestore
  useEffect(() => {
    const fetchQueries = async () => {
      const querySnapshot = await getDocs(collection(db, 'query'));
      const unansweredQueries = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((query) => query.A.length === 0); // Only unanswered queries
      setQueries(unansweredQueries);
    };
    fetchQueries();
  }, []);

  // Handle answer submission
  const handleAnswer = async (queryId) => {
    Swal.fire({
      title: 'Enter Answer',
      input: 'textarea',
      inputAttributes: { maxlength: 200 },
      showCancelButton: true,
      confirmButtonText: 'Submit',
    }).then(async (result) => {
      if (result.isConfirmed && result.value.trim()) {
        const answer = result.value;
        const queryRef = doc(db, 'query', queryId);
        await updateDoc(queryRef, { A: answer });
        Swal.fire('Answer submitted successfully').then(() => {
          window.location.reload(); // Refresh the page
        });
      } else if (!result.value.trim()) {
        Swal.fire('Please enter an answer');
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-start">
        <i
          className="bi bi-arrow-left-circle-fill"
          style={{ fontSize: '2rem', cursor: 'pointer', top: '10px', left: '10px' }}
          onClick={() => navigate('/admin-home')} // Navigate to Admin home on click
        ></i>
      </div>
      <h2 className="text-center mt-4" style={{ fontWeight: 'bold', color: '#3700B3' }}>Unanswered Queries</h2>
      
      <table className="table table-bordered mt-4">
        <thead style={{ backgroundColor: '#3700B3', color: '#fff' }}>
          <tr>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Question</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query) => (
            <tr key={query.id}>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{query.Q}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAnswer(query.id)} // Open answer input on click
                >
                  Answer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminQuerys;
