import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Fade,
  Card,
  CardContent,

} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  DirectionsCar,
  ArrowBack,
  Google,
  GitHub,
} from "@mui/icons-material";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

export default function Login({ onLogin, onNavigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    setLoading(true);
    try {
      // Try the main login endpoint first, fallback to test endpoint
      let res;
      try {
        res = await API.post("/login", { username, password });
      } catch (mainError) {
        console.log("Main login failed, trying test endpoint:", mainError);
        res = await API.post("/login-test", { username, password });
      }
      
      if (res.data.success) {
        // Store the JWT token
        localStorage.setItem('authToken', res.data.token);
        onLogin(res.data.user);
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response received
        setError("Cannot connect to server. Please check if the backend is running on http://localhost:8080");
      } else {
        // Something else happened
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
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
          backgroundColor: 'rgba(0, 20, 40, 0.8)',
          zIndex: -1,
        }}
      />
      
      {/* Content Container */}
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 'sm' }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: { xs: 2, sm: 3 } }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => onNavigate("landing")}
                  sx={{ 
                    color: 'rgba(248, 250, 252, 0.8)',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: 'rgba(248, 250, 252, 0.1)',
                      color: 'white',
                    }
                  }}
                >
                  Back to Home
                </Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                <DirectionsCar sx={{ fontSize: { xs: 32, sm: 40 }, color: "#3B82F6", mr: 2 }} />
                <Typography variant="h4" fontWeight={700} sx={{ color: 'white', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                  SmartPark
                </Typography>
              </Box>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ color: 'white', fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '1rem' }}>
                Sign in to your account to continue
              </Typography>
            </Box>

            {/* Login Form */}
            <Card sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 4,
              backgroundColor: 'rgba(248, 250, 252, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}>
              <CardContent sx={{ p: 0 }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#6B7280' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(249, 250, 251, 0.8)',
                        '& fieldset': {
                          borderColor: 'rgba(209, 213, 219, 0.8)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3B82F6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3B82F6',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        '&.Mui-focused': {
                          color: '#3B82F6',
                        },
                      },
                    }}
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#6B7280' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#6B7280' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(249, 250, 251, 0.8)',
                        '& fieldset': {
                          borderColor: 'rgba(209, 213, 219, 0.8)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#3B82F6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#3B82F6',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        '&.Mui-focused': {
                          color: '#3B82F6',
                        },
                      },
                    }}
                  />

                  <Box sx={{ textAlign: "right", mb: 3 }}>
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={() => onNavigate("forgot-password")}
                      sx={{ textDecoration: "none" }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3 }}
                      action={
                        (error.includes("Cannot connect to server") || error.includes("Server error")) && (
                          <Button 
                            color="inherit" 
                            size="small" 
                            onClick={async () => {
                              try {
                                const healthRes = await API.get("/health");
                                console.log("Health check result:", healthRes.data);
                                setError(`Server is running! Database: ${healthRes.data.database}, Users: ${healthRes.data.userCount || 0}`);
                              } catch (err) {
                                console.error("Health check failed:", err);
                                if (err.response) {
                                  setError(`Server responded with ${err.response.status}: ${err.response.data?.message || 'Unknown error'}`);
                                } else {
                                  setError("Cannot connect to backend. Please start the Spring Boot application on port 8080.");
                                }
                              }
                            }}
                          >
                            Test Connection
                          </Button>
                        )
                      }
                    >
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      mb: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)',
                        boxShadow: '0 6px 24px rgba(59, 130, 246, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <Divider sx={{ mb: 3, '& .MuiDivider-wrapper': { px: 2 } }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
                      Or continue with
                    </Typography>
                  </Divider>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Google />}
                      onClick={() => {/* Handle Google login */}}
                      sx={{
                        py: 1.5,
                        borderColor: '#E5E7EB',
                        color: '#374151',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: '#3B82F6',
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        },
                      }}
                    >
                      Google
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<GitHub />}
                      onClick={() => {/* Handle GitHub login */}}
                      sx={{
                        py: 1.5,
                        borderColor: '#E5E7EB',
                        color: '#374151',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: '#374151',
                          backgroundColor: 'rgba(55, 65, 81, 0.05)',
                        },
                      }}
                    >
                      GitHub
                    </Button>
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{" "}
                      <Link
                        component="button"
                        type="button"
                        onClick={() => onNavigate("register")}
                        sx={{ fontWeight: 600, textDecoration: "none" }}
                      >
                        Sign up
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>
      </Box>
    </Box>
  );
}
