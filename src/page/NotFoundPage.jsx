import '../style/notFoundPage.css';

function NotFoundPage() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-illustration">
          <div className="error-number">404</div>
          <div className="error-animation">
            <div className="floating-element element-1">💫</div>
            <div className="floating-element element-2">⭐</div>
            <div className="floating-element element-3">✨</div>
          </div>
        </div>
        
        <div className="error-message">
          <h1>Oops! Page Not Found</h1>
          <p>
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry though, it happens to the best of us!
          </p>
        </div>

        <div className="error-actions">
          <button onClick={handleGoHome} className="page-not-found-btn-primary">
            <span className="btn-icon">🏠</span>
            Go Home
          </button>
          <button onClick={handleGoBack} className="page-not-found-btn-secondary ">
            <span className="btn-icon">←</span>
            Go Back
          </button>
        </div>

        <div className="help-section">
          <h3>What can you do?</h3>
          <ul>
            <li>Check if the URL is spelled correctly</li>
            <li>Go back to the previous page</li>
            <li>Visit our homepage</li>
            <li>Contact support if you think this is an error</li>
          </ul>
        </div>
      </div>

      <div className="background-pattern">
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
      </div>
    </div>
  );
}

export default NotFoundPage;