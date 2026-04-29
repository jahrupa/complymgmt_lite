
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { LinearProgress } from '@mui/material';

export default function Snackbars({ issnackbarsOpen, setIsSnackbarsOpen, uploadStatus, customeMessage }) {
  const { vertical, horizontal, open, message, severityType } = issnackbarsOpen;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarsOpen({ ...issnackbarsOpen, open: false });
  };

  return (
    <>
      {uploadStatus === "pending" ?
        <Snackbar
          open={open} // ✅ FIXED: this should be a boolean
          // autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleClose}
            severity={severityType}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message || customeMessage || ''}
            {issnackbarsOpen.showProgress && (
              <LinearProgress style={{ marginTop: 8 }} />
            )}
          </Alert>
        </Snackbar>
        :

        <Snackbar
          open={open} // ✅ FIXED: this should be a boolean
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleClose}
            severity={severityType}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message}

          </Alert>
        </Snackbar>
      }

    </>
  );
}
