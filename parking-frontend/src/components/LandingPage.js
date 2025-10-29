import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Fade,
  Slide,
} from '@mui/material';
import {
  DirectionsCar,
  QrCode,
  Analytics,
  Security,
  Speed,
  CloudSync,
  ArrowForward,
  Login as LoginIcon,
  PersonAdd,
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, description, delay = 0 }) => {

  return (
    <Slide direction="up" in={true} timeout={800} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 3,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0, 229, 255, 0.4)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          },
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #00E5FF, #1DE9B6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 40, color: 'white' } })}
          </Box>
          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ color: 'white', mb: 2, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, flexGrow: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Slide>
  );
};



export default function LandingPage({ onNavigate }) {

  const features = [
    {
      icon: <QrCode sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'QR Code Integration',
      description: 'Generate and scan QR codes for seamless vehicle identification and parking management.',
    },
    {
      icon: <DirectionsCar sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Parking',
      description: 'Real-time slot availability tracking with automated booking and release system.',
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights and reports on parking usage, revenue, and trends.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Access',
      description: 'JWT-based authentication with role-based access control and data encryption.',
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Updates',
      description: 'Instant notifications and live updates on parking status and availability.',
    },
    {
      icon: <CloudSync sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Cloud Sync',
      description: 'Synchronized data across all devices with automatic backup and recovery.',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url(/images/parking-bg.png) center center / cover no-repeat, linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)`,
          zIndex: -2,
        }}
      />

      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 30, 60, 0.6)',
          zIndex: -1,
        }}
      />

      {/* Content Container */}
      <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>


        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'rgba(0, 20, 40, 0.9)',
            color: 'white',
            position: 'relative',
            zIndex: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <DirectionsCar sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>
                QR Smart Parking
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={() => onNavigate('login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => onNavigate('register')}
            >
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{
          pt: { xs: 4, sm: 6, md: 8 },
          pb: { xs: 6, sm: 8, md: 12 },
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Fade in={true} timeout={1000}>
            <Box textAlign="center" mb={{ xs: 4, sm: 6, md: 8 }}>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: '#F8FAFC',
                  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.8), 0 0 25px rgba(59, 130, 246, 0.2)',
                  letterSpacing: '1px',
                }}
              >
                QR based Smart Parking
              </Typography>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                  fontWeight: 600,
                  mb: 4,
                  color: '#E2E8F0',
                  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.8), 0 0 20px rgba(148, 163, 184, 0.15)',
                  letterSpacing: '0.5px',
                }}
              >
                System
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  mb: 6,
                  lineHeight: 1.7,
                  color: 'rgba(248, 250, 252, 0.9)',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  background: 'rgba(30, 58, 138, 0.2)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px 32px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                Revolutionary QR code-based parking solution with real-time analytics,
                smart slot management, and seamless user experience for modern parking facilities.
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => onNavigate('register')}
                  sx={{
                    px: 5,
                    py: 2.5,
                    fontSize: '1.2rem',
                    background: `linear-gradient(135deg, #3B82F6 0%, #1E40AF 50%, #1D4ED8 100%)`,
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: `linear-gradient(135deg, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%)`,
                      boxShadow: '0 6px 24px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => onNavigate('login')}
                  sx={{
                    px: 5,
                    py: 2.5,
                    fontSize: '1.2rem',
                    borderColor: 'rgba(248, 250, 252, 0.4)',
                    color: 'rgba(248, 250, 252, 0.9)',
                    backgroundColor: 'rgba(30, 58, 138, 0.2)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '12px',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderWidth: '1px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      borderColor: 'rgba(248, 250, 252, 0.6)',
                      backgroundColor: 'rgba(30, 58, 138, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Login Now
                </Button>
              </Box>
            </Box>
          </Fade>

          {/* Stats Section */}
          <Box sx={{ mb: 12, position: 'relative', zIndex: 2 }}>
            <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} justifyContent="center">
              <Grid item xs={6} sm={3} md={3}>
                <Fade in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
                  <Box
                    textAlign="center"
                    sx={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '16px',
                      padding: '24px 16px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(59, 130, 246, 0.2)',
                        background: 'rgba(59, 130, 246, 0.15)',
                      }
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      sx={{
                        color: '#3B82F6',
                        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
                        mb: 1
                      }}
                    >
                      99.9%
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(248, 250, 252, 0.8)', fontWeight: 500 }}>
                      🚀 Uptime
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={6} md={3}>
                <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
                  <Box
                    textAlign="center"
                    sx={{
                      background: 'rgba(0, 229, 255, 0.15)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '20px',
                      padding: '25px 15px',
                      border: '2px solid rgba(0, 229, 255, 0.3)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(0, 229, 255, 0.4)',
                        background: 'rgba(0, 229, 255, 0.25)',
                      }
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight={900}
                      sx={{
                        background: 'linear-gradient(135deg, #00E5FF, #1DE9B6, #4FACFE)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                        mb: 1
                      }}
                    >
                      10k+
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                      Vehicles Managed
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={6} md={3}>
                <Fade in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
                  <Box
                    textAlign="center"
                    sx={{
                      background: 'rgba(29, 233, 182, 0.15)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '20px',
                      padding: '25px 15px',
                      border: '2px solid rgba(29, 233, 182, 0.3)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(29, 233, 182, 0.4)',
                        background: 'rgba(29, 233, 182, 0.25)',
                      }
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight={900}
                      sx={{
                        background: 'linear-gradient(135deg, #1DE9B6, #A8E6CF, #88D8A3)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(29, 233, 182, 0.5)',
                        mb: 1
                      }}
                    >
                      500+
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                      Parking Lots
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={6} md={3}>
                <Fade in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
                  <Box
                    textAlign="center"
                    sx={{
                      background: 'rgba(247, 147, 30, 0.15)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '20px',
                      padding: '25px 15px',
                      border: '2px solid rgba(247, 147, 30, 0.3)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(247, 147, 30, 0.4)',
                        background: 'rgba(247, 147, 30, 0.25)',
                      }
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight={900}
                      sx={{
                        background: 'linear-gradient(135deg, #F7931E, #FFD93D, #FFA726)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(247, 147, 30, 0.5)',
                        mb: 1
                      }}
                    >
                      24/7
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                      Support
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Box>

          {/* Features Section */}
          <Box sx={{ mb: 12, position: 'relative', zIndex: 2 }}>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
              <Box textAlign="center" mb={8}>
                <Typography variant="h2" gutterBottom fontWeight={700} sx={{ color: 'white' }}>
                  Powerful Features
                </Typography>
                <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Everything you need to manage your parking facility efficiently and effectively
                </Typography>
              </Box>
            </Fade>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 100}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Fade in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                p: 6,
              }}
            >
              <Typography variant="h3" gutterBottom fontWeight={700} sx={{ color: 'white' }}>
                Ready to Transform Your Parking?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, maxWidth: 500, mx: 'auto', color: 'rgba(255, 255, 255, 0.8)' }}>
                Join thousands of parking facilities already using SmartPark to streamline their operations.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => onNavigate('register')}
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => onNavigate('contact')}
                  sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
                >
                  Contact Sales
                </Button>
              </Box>
            </Card>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}