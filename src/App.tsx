import { useCallback, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Avatar,
} from '@mui/material';
import {
  WbSunny,
  LocationOn,
  Search,
  Public,
  CloudQueue,
} from '@mui/icons-material';
  import { useTopCities } from '../api/services/useTopCities';
  import type { City } from '../api/requests/cities';
  import { useForecasts } from '../api/services/useForecasts';

function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { data: cities, isLoading, error, isError } = useTopCities();
  const { mutate: getForecast, isPending, data: forecastData } = useForecasts({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const handleGetForecast = useCallback((cityKey: string) => {
    getForecast({ cityKey, days: '5day' });
  }, [getForecast]);

  if (isError) {
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Error al cargar las ciudades: {error?.message || 'Error desconocido'}
          </Alert>
        </Container>
      );
    }

  if (isPending) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      py: 4,
      px: 2
    }}>
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Header de la aplicación */}
        <Box sx={{ textAlign: 'center', mb: 6, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <WbSunny sx={{ fontSize: '3rem', color: '#FFA726', mr: 2 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              WeatherApp
            </Typography>
            <CloudQueue sx={{ fontSize: '3rem', color: '#42A5F5', ml: 2 }} />
          </Box>
          
          <Typography variant="h5" color="text.secondary" sx={{ mb: 3, fontWeight: 300 }}>
            Consulta el pronóstico del tiempo en cualquier país del mundo
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Public />}
              label="Cobertura mundial" 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<LocationOn />}
              label="Datos precisos" 
              color="secondary" 
              variant="outlined" 
            />
          </Box>
        </Box>

        {/* Selector principal de países */}
        <Card 
          elevation={8} 
          sx={{ 
            width: '100%',
            maxWidth: 800, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4
          }}
        >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Search sx={{ fontSize: '2.5rem', mb: 1 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Selecciona una Ciudad
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Busca entre las mejores ciudades del mundo para ver el pronóstico del tiempo
            </Typography>
          </Box>

          <Autocomplete
            options={cities || []}
            getOptionLabel={(option: City) => 
              `${option.LocalizedName}, ${option.Country.LocalizedName}`
            }
            value={selectedCity}
            onChange={(_, newValue) => {
              setSelectedCity(newValue);
              if (newValue) {
                handleGetForecast(newValue.Key);
              }
            }}
            loading={isLoading}
            noOptionsText="No se encontraron ciudades"
            loadingText="Cargando ciudades..."
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Escribe el nombre de una ciudad..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '1.2rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.1rem',
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Search sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option: City) => (
              <Box component="li" {...props} sx={{ p: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                  #{option.Rank}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {option.LocalizedName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.Country.LocalizedName}, {option.AdministrativeArea.LocalizedName}
                  </Typography>
                </Box>
              </Box>
            )}
            sx={{ mb: 2 }}
          />

          {/* Información de la ciudad seleccionada */}
          {selectedCity && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mt: 3, 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'text.primary'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    mx: 'auto', 
                    mb: 2, 
                    width: 64, 
                    height: 64, 
                    bgcolor: 'primary.main',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  #{selectedCity.Rank}
                </Avatar>
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {selectedCity.LocalizedName}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedCity.Country.LocalizedName}, {selectedCity.AdministrativeArea.LocalizedName}
                </Typography>
                
                <Chip 
                  label={`Top #${selectedCity.Rank}`} 
                  color="primary" 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label="¡Listo para el pronóstico!" 
                  color="success" 
                  size="small" 
                />
              </Box>
            </Paper>
          )}
        </CardContent>
      </Card>

        {/* Sección del pronóstico del tiempo */}
        {forecastData && (
          <Card 
            elevation={8} 
            sx={{ 
              width: '100%',
              maxWidth: 800, 
              background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
              color: 'white',
              mb: 4
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <WbSunny sx={{ fontSize: '2.5rem', mb: 1 }} />
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Pronóstico del Tiempo
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {selectedCity?.LocalizedName}, {selectedCity?.Country.LocalizedName}
                </Typography>
              </Box>

              {/* Headline del pronóstico */}
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: 'text.primary',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Resumen General
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  {forecastData.Headline.Text}
                </Typography>
              </Paper>

              {/* Pronósticos diarios */}
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' } }}>
                {forecastData.DailyForecasts.map((forecast, index) => (
                  <Paper 
                    key={index}
                    elevation={3} 
                    sx={{ 
                      p: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: 'text.primary'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                      {new Date(forecast.Date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Día
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF5722' }}>
                          {forecast.Temperature.Maximum.Value}°
                        </Typography>
                        <Typography variant="body2">
                          {forecast.Day.IconPhrase}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Noche
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                          {forecast.Temperature.Minimum.Value}°
                        </Typography>
                        <Typography variant="body2">
                          {forecast.Night.IconPhrase}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`Max: ${forecast.Temperature.Maximum.Value}°${forecast.Temperature.Maximum.Unit}`}
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                      <Chip 
                        label={`Min: ${forecast.Temperature.Minimum.Value}°${forecast.Temperature.Minimum.Unit}`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

              {/* Footer informativo */}
        <Box sx={{ textAlign: 'center', mt: 4, width: '100%' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Datos proporcionados por AccuWeather
          </Typography>
                  <Typography variant="caption" color="text.secondary">
          ✨ Selecciona una ciudad para comenzar a explorar el clima
        </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
