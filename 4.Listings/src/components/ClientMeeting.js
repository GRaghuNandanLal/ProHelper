import { useLocation } from 'react-router-dom';

const ClientMeeting = () => {
  const location = useLocation();
  const meeting = location.state?.meeting || [];

  return (
    <div className="modal show">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Meeting Details</h5>
          </div>
          <div className="modal-body">
            {meeting.length === 0 ? (
              <p className="text-bold" style={{ color: '#30009c' }}>
                No meeting scheduled
              </p>
            ) : (
              meeting.map((item, index) => (
                <div className="card" key={index}>
                  <div className="card-body">{item}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientMeeting;
