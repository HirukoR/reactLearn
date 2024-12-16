import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  Grid,
  Link,
  IconButton
} from '@mui/material';
import { GitHub as GitHubIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [github, setGithub] = useState(currentUser?.github || '');
  const [education, setEducation] = useState(currentUser?.education || '');
  const [about, setAbout] = useState(currentUser?.about || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAvatar(currentUser.avatar || '');
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setGithub(currentUser.github || '');
      setEducation(currentUser.education || '');
      setAbout(currentUser.about || '');
    }
  }, [currentUser]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      avatar,
      name,
      email,
      github,
      education,
      about
    };
    updateUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={() => setIsEditing(!isEditing)}>
            <EditIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <input
              accept="image/*"
              type="file"
              id="avatar-upload"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
              disabled={!isEditing}
            />
            <label htmlFor="avatar-upload">
              <Avatar
                src={avatar}
                sx={{
                  width: 200,
                  height: 200,
                  margin: '0 auto',
                  cursor: isEditing ? 'pointer' : 'default'
                }}
              />
            </label>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="GitHub"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              disabled={!isEditing}
              margin="normal"
              InputProps={{
                startAdornment: <GitHubIcon sx={{ mr: 1 }} />
              }}
            />
            <TextField
              fullWidth
              label="Образование"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="О себе"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              disabled={!isEditing}
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ ml: 2 }}
            >
              Сохранить изменения
            </Button>
          </Box>
        )}

        {!isEditing && github && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Проекты на GitHub
            </Typography>
            <Link
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <GitHubIcon sx={{ mr: 1 }} />
              {github}
            </Link>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
