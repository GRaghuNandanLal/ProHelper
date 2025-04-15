import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const WorkerHome = () => {
  const navigate = useNavigate();
  const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
  const { name } = storedUserData || {};

  return (
    <div className="main-content fullContainer">
      <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
        <div className="container-fluid">
          <h2
            className="text-center mb-5"
            style={{ fontWeight: "bold", color: "#5E11A2" }}
          >
            Hello, {name}
          </h2>
          <div className="header-body">
            <div className="row">
              {/* Card 1 - Request */}
              <div className="col-md-4 mb-4">
                <div className="card card-stats mb-4">
                  <img
                    src="https://img.freepik.com/free-vector/accept-request-concept-illustration_114360-2964.jpg"
                    alt="Request"
                    height="300px"
                  />
                  <div className="card-body">
                    <span
                      className="h2 font-weight-bold mb-0"
                      style={{ fontWeight: "bold", color: "#5E11A2" }}
                    >
                      Request
                    </span>
                    <div className="mt-3 mb-0 text-muted text-sm text-end">
                      <Button
                        style={{
                          backgroundColor: "#6616B1",
                          borderColor: "#6616B1",
                          color: "white",
                        }}
                        onClick={() => navigate("/worker-request")}
                      >
                        View Requests
                      </Button>
                      ``
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 - Check Meeting */}
              <div className="col-md-4 mb-4">
                <div className="card card-stats mb-4">
                  <img
                    src="https://media.istockphoto.com/id/1491193003/vector/business-meeting.jpg?s=612x612&w=0&k=20&c=fcb67xBiplttv25_Z190Qu6C-wbkNkUv_cwufFdg7xc="
                    alt="Check Meeting"
                    height="300px"
                  />
                  <div className="card-body">
                    <span
                      className="h2 font-weight-bold mb-0"
                      style={{ fontWeight: "bold", color: "#5E11A2" }}
                    >
                      Upcoming Meeting
                    </span>
                    <div className="mt-3 mb-0 text-muted text-sm text-end">
                      <Button
                        style={{
                          backgroundColor: "#6616B1",
                          borderColor: "#6616B1",
                          color: "white",
                        }}
                        onClick={() => navigate("/worker-meeting")}
                      >
                        View Meetings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Current Request */}
              <div className="col-md-4">
                <div className="card card-stats mb-4">
                  <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/woman-filing-refund-request-illustration-download-in-svg-png-gif-file-formats--work-business-female-employee-daily-lifestyle-pack-people-illustrations-2817551.png"
                    alt="Current Request"
                    height="300px"
                  />
                  <div className="card-body">
                    <span
                      className="h2 font-weight-bold mb-0"
                      style={{ fontWeight: "bold", color: "#5E11A2" }}
                    >
                      Current Request
                    </span>
                    <div className="mt-3 mb-0 text-muted text-sm text-end">
                      <Button
                        style={{
                          backgroundColor: "#6616B1",
                          borderColor: "#6616B1",
                          color: "white",
                        }}
                        onClick={() => navigate("/worker-accept")}
                      >
                        View Current Requests
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Completed Request */}
              <div className="col-md-4">
                <div className="card card-stats mb-4">
                  <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/woman-filing-refund-request-illustration-download-in-svg-png-gif-file-formats--work-business-female-employee-daily-lifestyle-pack-people-illustrations-2817551.png"
                    alt="Completed Request"
                    height="300px"
                  />
                  <div className="card-body">
                    <span
                      className="h2 font-weight-bold mb-0"
                      style={{ fontWeight: "bold", color: "#5E11A2" }}
                    >
                      Completed Request
                    </span>
                    <div className="mt-3 mb-0 text-muted text-sm text-end">
                      <Button
                        style={{
                          backgroundColor: "#6616B1",
                          borderColor: "#6616B1",
                          color: "white",
                        }}
                        onClick={() => navigate("/worker-completed")}
                      >
                        View Completed Requests
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 - Reviews */}
              <div className="col-md-4">
                <div className="card card-stats mb-4">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/005/051/409/non_2x/customer-review-illustration-concept-flat-illustration-isolated-on-white-background-vector.jpg"
                    alt="Reviews"
                    height="300px"
                  />
                  <div className="card-body">
                    <span
                      className="h2 font-weight-bold mb-0"
                      style={{ fontWeight: "bold", color: "#5E11A2" }}
                    >
                      Reviews
                    </span>
                    <div className="mt-3 mb-0 text-muted text-sm text-end">
                      <Button
                        style={{
                          backgroundColor: "#6616B1",
                          borderColor: "#6616B1",
                          color: "white",
                        }}
                        onClick={() => navigate("/worker-reviews")}
                      >
                        View Reviews
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
