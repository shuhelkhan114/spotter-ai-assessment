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

def generate_log_blocks(distance_miles, eta_hours, stops, start_hour=6):
    blocks_per_day = 96
    blocks = []
    blocks_needed = int(eta_hours * 4)
    current_block = int(start_hour * 4)
    day = 0
    days = []
    while blocks_needed > 0:
        day_blocks = [0] * blocks_per_day
        if current_block < blocks_per_day:
            day_blocks[current_block] = 3
            current_block += 1
        driving_blocks = 0
        while driving_blocks < blocks_per_day - current_block and blocks_needed > 0:
            drive_this_leg = min(32, blocks_needed, blocks_per_day - current_block)
            for _ in range(drive_this_leg):
                day_blocks[current_block] = 2
                current_block += 1
                driving_blocks += 1
                blocks_needed -= 1
                if current_block >= blocks_per_day:
                    break
            if blocks_needed > 0 and current_block < blocks_per_day:
                for _ in range(2):
                    if current_block < blocks_per_day:
                        day_blocks[current_block] = 0
                        current_block += 1
                        driving_blocks += 1
        if current_block < blocks_per_day:
            day_blocks[current_block] = 3
            current_block += 1
        for i in range(current_block, blocks_per_day):
            day_blocks[i] = 1 if day % 2 == 0 else 0
        totals = {
            "off": day_blocks.count(0) / 4,
            "sleeper": day_blocks.count(1) / 4,
            "driving": day_blocks.count(2) / 4,
            "on": day_blocks.count(3) / 4,
        }
        days.append({
            "date": (datetime.date.today() + datetime.timedelta(days=day)).isoformat(),
            "blocks": day_blocks,
            "totals": totals,
        })
        day += 1
        current_block = 0
    return days

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
        data = request.data
        try:
            pickup = data.get('pickup_location')
            dropoff = data.get('dropoff_location')
            if not pickup or not dropoff:
                return Response({'error': 'pickup_location and dropoff_location required'}, status=400)
            pickup_coords = geocode(pickup)
            dropoff_coords = geocode(dropoff)
            polyline, distance_miles, eta_hours = get_route(pickup_coords, dropoff_coords)
            stops = calculate_stops(distance_miles, polyline)
            days = generate_log_blocks(distance_miles, eta_hours, stops)
            return Response({"days": days})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
