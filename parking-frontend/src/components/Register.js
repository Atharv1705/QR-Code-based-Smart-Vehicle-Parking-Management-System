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

  FormControlLabel,
  Checkbox,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
  DirectionsCar,
  ArrowBack,
  Google,
  GitHub,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 20;
    if (/[a-z]/.test(pwd)) strength += 20;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[@$!%*?&]/.test(pwd)) strength += 20;
    return strength;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength < 50) return "error";
    if (strength < 75) return "warning";
    return "success";
  };

  const getLabel = () => {
    if (strength < 40) return "Very Weak";
    if (strength < 60) return "Weak";
    if (strength < 80) return "Good";
    if (strength < 100) return "Strong";
    return "Excellent";
  };

  if (!password) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={strength}
        color={getColor()}
        sx={{ height: 6, borderRadius: 3 }}
      />
      <Typography variant="caption" color={`${getColor()}.main`} sx={{ mt: 0.5, display: "block" }}>
        Password strength: {getLabel()}
      </Typography>
    </Box>
  );
};

export default function Register({ onRegister, onNavigate }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }
    
    // Username validation
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please provide a valid email address");
      return false;
    }
    
    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/(?=.*\d)/.test(formData.password)) {
      setError("Password must contain at least one digit");
      return false;
    }
    if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      setError("Password must contain at least one special character (@$!%*?&)");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await API.post("/register", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: "user",
      });
      if (res.data.success) {
        setSuccess("Account created successfully! Please sign in.");
        setTimeout(() => onNavigate("login"), 2000);
      } else {
        setError("Registration failed. Username might already exist.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          // Show specific validation errors
          setError(error.response.data.errors.join(". "));
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && 
    formData.password === formData.confirmPassword;

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
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
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
                Create Your Account
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.7)', fontSize: '1rem' }}>
                Join thousands of users managing their parking efficiently
              </Typography>
            </Box>

            {/* Registration Form */}
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
                    value={formData.username}
                    onChange={handleChange("username")}
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
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(249, 250, 251, 0.8)',
                        '& fieldset': { borderColor: 'rgba(209, 213, 219, 0.8)' },
                        '&:hover fieldset': { borderColor: '#3B82F6' },
                        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: 2 },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        '&.Mui-focused': { color: '#3B82F6' },
                      },
                    }}
                  />

                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange("email")}
                    autoComplete="email"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#6B7280' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(249, 250, 251, 0.8)',
                        '& fieldset': { borderColor: 'rgba(209, 213, 219, 0.8)' },
                        '&:hover fieldset': { borderColor: '#3B82F6' },
                        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: 2 },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6B7280',
                        '&.Mui-focused': { color: '#3B82F6' },
                      },
                    }}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange("password")}
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                    helperText="Password requirements: 8+ characters, uppercase, lowercase, digit, special character (@$!%*?&)"
                  />
                  <PasswordStrengthIndicator password={formData.password} />
                  
                  {/* Password Requirements Checklist */}
                  {formData.password && (
                    <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                        Password Requirements:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: formData.password.length >= 8 ? 'success.main' : 'text.secondary' }}>
                          {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                        </Typography>
                        <Typography variant="caption" sx={{ color: /[a-z]/.test(formData.password) ? 'success.main' : 'text.secondary' }}>
                          {/[a-z]/.test(formData.password) ? '✓' : '○'} One lowercase letter
                        </Typography>
                        <Typography variant="caption" sx={{ color: /[A-Z]/.test(formData.password) ? 'success.main' : 'text.secondary' }}>
                          {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                        </Typography>
                        <Typography variant="caption" sx={{ color: /[0-9]/.test(formData.password) ? 'success.main' : 'text.secondary' }}>
                          {/[0-9]/.test(formData.password) ? '✓' : '○'} One digit
                        </Typography>
                        <Typography variant="caption" sx={{ color: /[@$!%*?&]/.test(formData.password) ? 'success.main' : 'text.secondary' }}>
                          {/[@$!%*?&]/.test(formData.password) ? '✓' : '○'} One special character (@$!%*?&)
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {formData.confirmPassword && (
                              <Box sx={{ mr: 1 }}>
                                {passwordsMatch ? (
                                  <CheckCircle color="success" />
                                ) : (
                                  <Cancel color="error" />
                                )}
                              </Box>
                            )}
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{ mb: 3 }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the{" "}
                        <Link href="#" sx={{ textDecoration: "none" }}>
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" sx={{ textDecoration: "none" }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                    sx={{ mb: 3 }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      {success}
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
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <Divider sx={{ mb: 3, '& .MuiDivider-wrapper': { px: 2 } }}>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
                      Or sign up with
                    </Typography>
                  </Divider>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Google />}
                      onClick={() => {/* Handle Google signup */}}
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
                      onClick={() => {/* Handle GitHub signup */}}
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
                      Already have an account?{" "}
                      <Link
                        component="button"
                        type="button"
                        onClick={() => onNavigate("login")}
                        sx={{ fontWeight: 600, textDecoration: "none" }}
                      >
                        Sign in
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
  );
}