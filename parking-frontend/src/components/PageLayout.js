import { Box, Container, Typography, Fade } from '@mui/material';

const PageLayout = ({ 
  title, 
  subtitle, 
  children, 
  maxWidth = "xl",
  showAppBar = true 
}) => {
  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "background.default",
      display: "flex",
      flexDirection: "column",
    }}>
      <Container 
        maxWidth={maxWidth} 
        sx={{ 
          flex: 1, 
          py: { xs: 3, sm: 4 }, 
          px: { xs: 2, sm: 3 },
          pt: showAppBar ? { xs: 10, sm: 11 } : { xs: 3, sm: 4 }, // Account for fixed AppBar
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Fade in={true} timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '1400px' }}>
            {/* Page Header */}
            {(title || subtitle) && (
              <Box sx={{ 
                textAlign: "center", 
                mb: { xs: 3, sm: 4 }
              }}>
                {title && (
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    gutterBottom 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '1.75rem', sm: '2.125rem' }
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      maxWidth: 600, 
                      mx: 'auto',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Page Content */}
            <Box sx={{ width: '100%' }}>
              {children}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PageLayout;