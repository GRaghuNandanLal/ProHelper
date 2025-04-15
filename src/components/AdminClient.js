import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import according to your Firebase configuration
import Swal from 'sweetalert2';

const AdminClient = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  // Fetch clients from Firestore
  useEffect(() => {
    const fetchClients = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'Client'));
      const querySnapshot = await getDocs(q);
      const clientData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClients(clientData);
    };
    fetchClients();
  }, []);

  // Delete client function
  const deleteClient = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      Swal.fire({
        icon: 'success',
        title: 'Successfully deleted',
        confirmButtonText: 'OK'
      }).then(() => window.location.reload());
    } catch (error) {
      console.error('Error deleting client:', error);
      Swal.fire('Error', 'Failed to delete client', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <i
        className="bi bi-arrow-left-circle-fill"
        style={{ fontSize: '2rem', cursor: 'pointer', top: '10px', right: '10px' }}
        onClick={() => navigate('/admin-home')}
      ></i>
      
      <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#3700B3' }}>Clients</h2>

      <table className="table mt-3">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Name</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Mail Id</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Address</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Contact</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{client.name}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{client.email}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{client.address}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{client.contact}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>
                <i
                  className="bi bi-trash-fill"
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => deleteClient(client.id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminClient;
