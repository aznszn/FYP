from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def helloWorld(request):
    return JsonResponse({'message': 'Hello, World!'})

@csrf_exempt
def melodyGenerate(request):
    if request.method == 'POST':
        # Access the array from the form data
        instruments = request.POST.get('instruments')
        print('Received array from frontend:', instruments)

        # Access the audio file from the form data
        audio_file = request.FILES.get('audioFile')
        if audio_file:
            # Do something with the audio file, e.g., save it to disk
            with open('uploaded_audio.wav', 'wb') as destination:
                for chunk in audio_file.chunks():
                    destination.write(chunk)

            print('Audio file received and saved')

        return JsonResponse({'message': 'Data received successfully'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)