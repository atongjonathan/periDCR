from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from ..models import PeriUser, Patient
from ..forms import SignUpForm
from .serializers import PeriUserSerializer, PatientSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]
    return Response(routes, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = PeriUser.objects.all()
    serializer = PeriUserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users(request, pk):
    user = PeriUser.objects.get(id=pk)
    serializer = PeriUserSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_user(request):
    form = SignUpForm(request.data)
    if form.is_valid():
        form.save()  # Save the form to create the user
        return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        # Return form validation errors, including Django's built-in password validation errors
    return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def update_user(request, pk):
    try:
        user = get_object_or_404(PeriUser, id=pk)
        serializer = PeriUserSerializer(instance=user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_list(request):
    users = Patient.objects.all()
    serializer = PatientSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient(request, name):
    try:
        user = get_object_or_404(Patient, name=name)
        serializer = PatientSerializer(user, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'exception': str(e)}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_patient(request):
    data = request.data
    if data.get("dob") == '':
        data.pop("dob")
    try:
        new_patient = Patient.objects.create(**request.data)
        new_patient.save()
        serializer = PatientSerializer(new_patient, many=False)
        return Response(serializer.data, status=201)
    except Exception as e:
        return Response({'exception': str(e)}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_patient(request, name):
    patient = Patient.objects.get(name=name)
    serializer = PatientSerializer(instance=patient, data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def update_patient(request, name):
    data = request.data
    if data.get("dob") == '':
        data.pop("dob")
    user = get_object_or_404(Patient, name=name)
    serializer = PatientSerializer(instance=user, data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

