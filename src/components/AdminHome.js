import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import clientA from '../assets/clientA.png';
import workerA from '../assets/workerA.jpg';
import booking from '../assets/booking.jpg';
import qadata from '../assets/QA.png';

const AdminHome = () => {
  const navigate = useNavigate();

  const cardData = [
    { title: 'Clients', image: clientA, path: '/admin-client' },
    { title: 'Workers', image: workerA, path: '/admin-worker' },
    { title: 'Bookings', image: booking, path: '/admin-booking' },
    {title:'Answer Queries',image:qadata,path:'/admin-query'}
  ];

  return (
    <div className="row" style={{ paddingTop:'50px'}}>
      {cardData.map((card, index) => (
        <div className="col-md-6 mb-4" key={index}>
          <div className="card card-stats mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <span className="h2 font-weight-bold mb-0" style={{ fontWeight: 'bold', color: '#6200EE' }}>
                    {card.title}
                  </span>
                </div>
                <div className="col-auto">
                  <div className="icon icon-shape text-primary shadow">
                    <img src={card.image} alt={card.title} width="60" />
                  </div>
                </div>
              </div>
              <p className="mt-3 mb-0 text-muted text-sm">
                <Button variant="warning" onClick={() => navigate(card.path)}>
                  View {card.title}
                </Button>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminHome;
