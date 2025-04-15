import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import according to your Firebase configuration
import Swal from 'sweetalert2';

const AdminBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  // Fetch and sort bookings from Firestore
  useEffect(() => {
    const fetchBookings = async () => {
      const bookingSnapshot = await getDocs(collection(db, 'booking'));
      let bookingData = bookingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Sort: In-Progress first, Completed next, then others
      bookingData.sort((a, b) => {
        if (a.status === 'In-Progress' && b.status !== 'In-Progress') return -1;
        if (a.status === 'Completed' && b.status !== 'In-Progress' && b.status !== 'Completed') return -1;
        if (a.status !== 'In-Progress' && b.status === 'In-Progress') return 1;
        if (a.status !== 'Completed' && b.status === 'Completed') return 1;
        return 0;
      });

      setBookings(bookingData);
    };
    fetchBookings();
  }, []);

  // Cancel booking function with confirmation popup
  const cancelBooking = async (id) => {
    Swal.fire({
      title: 'Want to stop the service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateDoc(doc(db, 'booking', id), { status: 'Stopped by Admin' });
          Swal.fire({
            icon: 'success',
            title: 'Service stopped successfully',
            confirmButtonText: 'OK'
          }).then(() => window.location.reload());
        } catch (error) {
          console.error('Error stopping booking:', error);
          Swal.fire('Error', 'Failed to stop booking', 'error');
        }
      }
    });
  };

  return (
    <div className="container mt-4">
      <i
        className="bi bi-arrow-left-circle-fill"
        style={{ fontSize: '2rem', cursor: 'pointer', top: '10px', right: '10px' }}
        onClick={() => navigate('/admin-home')}
      ></i>
      
      <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#3700B3' }}>Bookings</h2>

      <table className="table mt-3">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Client Name</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Service</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Worker Name</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Description</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Last Meeting</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Status</th>
            <th style={{ backgroundColor: '#3700B3', color: 'white' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{booking.cname}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{booking.service}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{booking.wname}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{booking.description}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>
                {booking.meeting && booking.meeting.length > 0
                  ? booking.meeting[booking.meeting.length - 1]
                  : 'N/A'}
              </td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>{booking.status}</td>
              <td style={{ backgroundColor: '#f2e7fe', color: 'black' }}>
                {['In-Progress', 'Pending'].includes(booking.status) && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooking;
