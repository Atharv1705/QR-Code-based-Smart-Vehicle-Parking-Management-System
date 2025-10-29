import {
  Box,
  CircularProgress,
  Typography,
  Backdrop,
  Card,
  CardContent,
} from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';

const LoadingSpinner = ({ 
  loading = true, 
  message = 'Loading...', 
  fullScreen = false,
  size = 40 
}) => {
  if (!loading) return null;

  const LoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress size={size} thickness={4} />
        <DirectionsCar
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: size * 0.4,
            color: 'primary.main',
          }}
        />
      </Box>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={loading}
      >
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <LoadingContent />
          </CardContent>
        </Card>
      </Backdrop>
    );
  }

  return <LoadingContent />;
};

export default LoadingSpinner;