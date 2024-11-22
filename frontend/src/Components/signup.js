import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, OutlinedInput, TextField, InputAdornment, Card, CardContent, Link, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) 
    {
      alert("Passwords don't match");
      return;
    }

    const payload = { name, email, password };

    try{
      const response = await axios.post('http://localhost:5000/api/user/register', payload);
      if (response.status === 201) 
      {
        alert('Sign-up successful');
        navigate('/signin');
      } 
      else 
      {
        alert(`${response.status}, ${response.error}`);
      }
    } 
    catch (error) 
    {
      alert(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
      <CardContent>
        <form onSubmit={handleSignUp}>
          <TextField
            label="Full Name"
            name="name"
            type="text"
            fullWidth
            required
            variant="outlined"
            margin="normal"
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              label="Confirm Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ my: 2 }}
          >
            Sign Up
          </Button>

          <Link href="/signin" variant="body2" display="block" textAlign="center">
            Already have an account? Sign In
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
