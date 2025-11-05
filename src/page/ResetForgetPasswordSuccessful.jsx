import '../style/notFoundPage.css';
import complyn_mgmt_logo from '../assets/complymgmt_logo.png';
import reset_password from '../assets/reset_password.png';
import { useNavigate } from 'react-router-dom';


function ResetForgetPasswordSuccessful() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="">
          <img src={complyn_mgmt_logo} alt="Avatar" className="avatar_v2" />
        </div>

        <div className="error-message">
          <img src={reset_password} alt="Avatar" className="" />
        </div>
        <div className="help-section">
          <h6>All done! You have successfully reset your password</h6>
          <div style={{color:'blue', fontSize:'14px', marginTop:'10px'}}>
            Go back to{' '}<span className='fw-600'  style={{textDecoration:'underline', cursor:'pointer'}} onClick={handleGoHome}>Login</span>{' '}page to access your account.
          </div>

        </div>
      </div>

      {/* <div className="background-pattern">
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
      </div> */}
    </div>
  );
}

export default ResetForgetPasswordSuccessful;