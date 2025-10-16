from rest_framework import viewsets, permissions, generics
from .models import Product
from .serializers import ProductSerializer, UserRegistrationSerializer

# Product CRUD ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('name')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# User Registration API View
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
