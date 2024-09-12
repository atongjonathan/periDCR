from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from ..models import PeriUser
from ..forms import SignUpForm
from .serializers import PeriUserSerializer


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
    return Response(routes)


@api_view(['GET'])
def users_list(request):
    users = PeriUser.objects.all()
    serializer = PeriUserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def users(request, pk):
    user = PeriUser.objects.get(id=pk)
    serializer = PeriUserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def create_user(request):
    form = SignUpForm(request.data)
    if form.is_valid():
        form.save()  # Save the form to create the user
        return Response({'message': 'Registration successful'}, status=201)
    else:
        # Return form validation errors, including Django's built-in password validation errors
        return Response({'errors': form.errors}, status=400)


@api_view(['POST'])
def update_user(request, pk):
    user = PeriUser.objects.get(id=pk)
    serializer = PeriUserSerializer(instance=user, data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_user(request, pk):
    user = PeriUser.objects.get(id=pk)
    return Response('User Deleted')
