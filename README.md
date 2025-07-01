# Truck Driver Trip Planning App

A comprehensive web application for truck drivers to plan trips, calculate routes, and generate daily log sheets with duty status tracking. Built with Django REST Framework backend and React frontend.

## Features

- **Trip Planning**: Input current location, pickup, and dropoff points
- **Route Calculation**: Automatic route calculation with stops and estimated travel times
- **Daily Log Generation**: Interactive daily log sheets showing driver duty statuses
- **Duty Status Tracking**: Track off duty, sleeper berth, driving, and on duty hours
- **Location Search**: Autocomplete location search using Mapbox geocoding
- **Interactive Map**: Visual route display with markers and popups
- **Drag-to-Select**: Interactive duty status selection in daily logs
- **Hour Calculations**: Automatic calculation of total hours per duty status per day

## Tech Stack

### Backend
- **Django 4.2+**: Web framework
- **Django REST Framework**: API development
- **Mapbox API**: Geocoding and directions
- **Python 3.8+**: Programming language

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling framework
- **Mapbox GL JS**: Interactive maps

## Project Structure

```
spotter-ai-assessment/
├── backend/                 # Django backend
│   ├── settings.py         # Django settings
│   ├── urls.py             # Main URL configuration
│   └── wsgi.py             # WSGI configuration
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── DailyLogGrid.jsx
│   │   │   ├── HeaderForm.jsx
│   │   │   ├── LocationSearchInput.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── RemarksInput.jsx
│   │   │   ├── ShippingInfo.jsx
│   │   │   ├── SummaryPanel.jsx
│   │   │   └── TripInputPage.jsx
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── trips/                  # Django app
│   ├── urls.py             # Trip-related URLs
│   └── views.py            # API views
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Mapbox API token

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd spotter-ai-assessment
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your Mapbox API token:
# MAPBOX_TOKEN=your_mapbox_token_here

# Run database migrations
python manage.py migrate

# Start Django development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend

# Install Node.js dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Mapbox API token:
# VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Start Vite development server
npm run dev
```

## Environment Variables

Create `.env` files in both the root directory (for Django) and `frontend/` directory (for React):

### Backend (.env in root)
```
MAPBOX_TOKEN=your_mapbox_token_here
DEBUG=True
SECRET_KEY=your_django_secret_key
```

### Frontend (.env in frontend/)
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

## Getting a Mapbox API Token

1. Go to [Mapbox](https://www.mapbox.com/)
2. Create an account or sign in
3. Navigate to your account dashboard
4. Create a new token or use the default public token
5. Ensure the token has access to:
   - Geocoding API
   - Directions API
   - Mapbox GL JS

## Usage

### Starting the Application

1. **Start the backend server** (from root directory):
   ```bash
   python manage.py runserver
   ```
   The Django server will run on `http://localhost:8000`

2. **Start the frontend server** (from frontend directory):
   ```bash
   npm run dev
   ```
   The React app will run on `http://localhost:5173`

### Using the App

1. **Enter Trip Details**:
   - Current Location: Use the location search to find your starting point
   - Pickup Location: Enter where you need to pick up cargo
   - Dropoff Location: Enter the final destination
   - Current Cycle Hours: Enter your current duty hours

2. **View Route**: The app will display an interactive map with your route

3. **Daily Logs**: View and interact with the daily log sheets showing duty statuses

4. **Duty Status Management**: Use drag-to-select functionality to adjust duty statuses

## API Endpoints

### Backend API (Django REST Framework)

- `POST /api/calculate-route/`: Calculate route between locations
- `POST /api/generate-logs/`: Generate daily log sheets

### Request Format

```json
{
  "current_location": "Chicago, IL",
  "pickup_location": "Milwaukee, WI", 
  "dropoff_location": "Indianapolis, IN",
  "current_cycle_hours": 8
}
```

## Sample Test Data

### Sample Trip 1: Short Regional Route
- **Current Location**: Chicago, IL
- **Pickup**: Milwaukee, WI
- **Dropoff**: Indianapolis, IN
- **Current Cycle Hours**: 8

### Sample Trip 2: Medium Distance Route
- **Current Location**: Los Angeles, CA
- **Pickup**: San Diego, CA
- **Dropoff**: Phoenix, AZ
- **Current Cycle Hours**: 4

### Sample Trip 3: Long Distance Route
- **Current Location**: New York, NY
- **Pickup**: Boston, MA
- **Dropoff**: Miami, FL
- **Current Cycle Hours**: 2

## Development

### Backend Development

```bash
# Run tests
python manage.py test

# Create new Django app
python manage.py startapp app_name

# Make migrations
python manage.py makemigrations
python manage.py migrate
```

### Frontend Development

```bash
# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] Real-time GPS tracking
- [ ] Multiple vehicle support
- [ ] Fuel cost calculations
- [ ] Weather integration
- [ ] Electronic logging device (ELD) integration
- [ ] Mobile app version
- [ ] Driver performance analytics
- [ ] Route optimization algorithms 