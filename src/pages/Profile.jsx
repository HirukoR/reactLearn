import { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  IconButton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaUser, FaCamera, FaKey } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const theme = useTheme();
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const fileInputRef = useRef();
  
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(currentUser.id, { name: profile.name });
      setMessage({ type: 'success', text: 'Профиль успешно обновлен!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (profile.newPassword !== profile.confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают!' });
      return;
    }
    try {
      await updatePassword(currentUser.id, profile.currentPassword, profile.newPassword);
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setMessage({ type: 'success', text: 'Пароль успешно обновлен!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await updateProfile(currentUser.id, { avatar: reader.result });
          setMessage({ type: 'success', text: 'Аватар успешно обновлен!' });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setMessage({ type: 'error', text: 'Ошибка при обновлении аватара' });
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 4,
          }}
        >
          Профиль
        </Typography>

        {message.text && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 3 }}
            onClose={() => setMessage({ type: '', text: '' })}
          >
            {message.text}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 4,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)'
              : 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={currentUser?.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                }}
              >
                {!currentUser?.avatar && <FaUser />}
              </Avatar>
              <IconButton
                onClick={handleAvatarClick}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                <FaCamera />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </Box>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h5" gutterBottom>
                {currentUser?.name}
              </Typography>
              <Typography color="text.secondary">
                {currentUser?.email}
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleUpdateProfile}>
            <Typography variant="h6" gutterBottom>
              Основная информация
            </Typography>
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={profile.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={currentUser?.email}
              disabled
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Обновить профиль
            </Button>
          </form>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)'
              : 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <form onSubmit={handleUpdatePassword}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaKey /> Изменить пароль
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Текущий пароль"
              name="currentPassword"
              value={profile.currentPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Новый пароль"
              name="newPassword"
              value={profile.newPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Подтвердите новый пароль"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Обновить пароль
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Profile;
