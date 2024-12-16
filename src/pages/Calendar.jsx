import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Grid,
  Box,
  Typography
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [events, setEvents] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    // Загрузка событий из localStorage при монтировании компонента
    const savedEvents = localStorage.getItem(`events_${currentUser?.id}`);
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, [currentUser]);

  // Сохранение событий в localStorage при их изменении
  useEffect(() => {
    if (currentUser?.id && Object.keys(events).length > 0) {
      localStorage.setItem(`events_${currentUser.id}`, JSON.stringify(events));
    }
  }, [events, currentUser]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSaveEvent = () => {
    if (selectedDate && eventTitle) {
      setEvents(prev => ({
        ...prev,
        [selectedDate]: [
          ...(prev[selectedDate] || []),
          {
            title: eventTitle,
            description: eventDescription,
            created: new Date().toISOString()
          }
        ]
      }));
      setEventTitle('');
      setEventDescription('');
      setOpenEventDialog(false);
    }
  };

  const getEventsForDate = (date) => {
    return events[date] || [];
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Выберите дату
              </Typography>
              <TextField
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                События на {new Date(selectedDate).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {event.title}
                    </Typography>
                    {event.description && (
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography color="text.secondary">
                  Нет событий на эту дату
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={() => setOpenEventDialog(true)}
                sx={{ mt: 2 }}
                fullWidth
              >
                Добавить событие
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
          <DialogTitle>
            Добавить событие на {new Date(selectedDate).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Название события"
              fullWidth
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Описание"
              fullWidth
              multiline
              rows={4}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEventDialog(false)}>Отмена</Button>
            <Button onClick={handleSaveEvent} variant="contained">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Calendar;
