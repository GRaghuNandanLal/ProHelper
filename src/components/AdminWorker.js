import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import according to your Firebase configuration
import Swal from 'sweetalert2';

const AdminWorker = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);

  // Fetch workers from Firestore
  useEffect(() => {
    const fetchWorkers = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'Worker'));
      const querySnapshot = await getDocs(q);
      const workerData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWorkers(workerData);
    };
    fetchWorkers();
  }, []);

  // Delete worker function
  const deleteWorker = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      Swal.fire({
        icon: 'success',
        title: 'Successfully deleted',
        confirmButtonText: 'OK'
      }).then(() => window.location.reload());
    } catch (error) {
      console.error('Error deleting worker:', error);
      Swal.fire('Error', 'Failed to delete worker', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <i
        className="bi bi-arrow-left-circle-fill"
        style={{ fontSize: '2rem', cursor: 'pointer', top: '10px', right: '10px' }}
        onClick={() => navigate('/admin-home')}
      ></i>
      
      <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#3700B3' }}>Workers</h2>

      <table className="table mt-3">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Name</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Mail Id</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Address</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Contact</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Service</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id}>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{worker.name}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{worker.email}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{worker.address}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{worker.contact}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>
                {worker.services && worker.services.map((service, index) => (
                  <div key={index}>{service}</div>
                ))}
              </td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>
                <i
                  className="bi bi-trash-fill"
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => deleteWorker(worker.id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWorker;
