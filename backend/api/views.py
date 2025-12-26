from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *
from rest_framework import response
# Create your views here.

def home(requests):
    return HttpResponse("This is Homepage")


class ProjectViewset(viewsets.Viewset):
    permission_classes = [permissions.AllowAny]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializers #pakai s apa engga

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response(serializer.data)
        else:
            return response(serializer.errors, status=400)


    def retrieve(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project)
        return response(serializer.data)

    def update(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return response(serializer.data)
        else:
            return response(serializer.errors, status=400)
        

    # def partial_update(self, request, pk=None):
    #     pass

    def destroy(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        project.delete()
        return response(status=204)
