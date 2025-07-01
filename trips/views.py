from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import requests
import datetime
from django.conf import settings

MAPBOX_TOKEN = settings.MAPBOX_TOKEN

def geocode(address):
    url = f'https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json'
    params = {'access_token': MAPBOX_TOKEN, 'limit': 1}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    features = resp.json().get('features')
    if not features:
        raise ValueError(f'Could not geocode address: {address}')
    coords = features[0]['center']
    return coords

def get_route(start, end):
    url = f'https://api.mapbox.com/directions/v5/mapbox/driving/{start[0]},{start[1]};{end[0]},{end[1]}'
    params = {
        'access_token': MAPBOX_TOKEN,
        'geometries': 'geojson',
        'overview': 'full',
        'steps': 'false'
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    routes = resp.json().get('routes')
    if not routes:
        raise ValueError('No route found')
    route = routes[0]
    polyline = route['geometry']['coordinates']
    distance_miles = route['distance'] / 1609.34
    eta_hours = route['duration'] / 3600
    return polyline, distance_miles, eta_hours

def calculate_stops(distance_miles, polyline):
    stops = []
    total_hours = distance_miles / 60
    num_breaks = int(total_hours // 8)
    num_fuels = int(distance_miles // 1000)
    for i in range(1, num_breaks + 1):
        idx = int(i * 8 * 60 / (total_hours * 60) * (len(polyline) - 1))
        stops.append({'type': 'break', 'coords': polyline[idx]})
    for i in range(1, num_fuels + 1):
        idx = int(i * 1000 / distance_miles * (len(polyline) - 1))
        stops.append({'type': 'fuel', 'coords': polyline[idx]})
    return stops

class TripRouteView(APIView):
    def post(self, request):
        data = request.data
        try:
            pickup = data.get('pickup_location')
            dropoff = data.get('dropoff_location')
            if not pickup or not dropoff:
                return Response({'error': 'pickup_location and dropoff_location required'}, status=400)
            pickup_coords = geocode(pickup)
            dropoff_coords = geocode(dropoff)
            polyline, distance_miles, eta_hours = get_route(pickup_coords, dropoff_coords)
            stops = [
                {'type': 'pickup', 'coords': pickup_coords},
                *calculate_stops(distance_miles, polyline),
                {'type': 'dropoff', 'coords': dropoff_coords},
            ]
            return Response({
                'polyline': polyline,
                'stops': stops,
                'distance_miles': round(distance_miles, 2),
                'eta_hours': round(eta_hours, 2)
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class TripLogsView(APIView):
    def post(self, request):
        today = datetime.date.today().isoformat()
        return Response({
            "days": [
                {
                    "date": today,
                    "blocks": [0]*32 + [2]*32 + [1]*32,
                    "totals": {"off": 8, "driving": 8, "sleeper": 8, "on": 0}
                }
            ]
        })
