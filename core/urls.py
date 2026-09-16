"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.InicioView.as_view(), name='inicio'),
    path('portafolio/', views.PortafolioView.as_view(), name='portafolio'),
    path('inmueble/<int:id>/', views.InmuebleView.as_view(), name='inmueble'),
    path('iniciar-sesion/', views.InicioSesionView.as_view(), name='iniciar_sesion'),
    path('panel/', views.PanelView.as_view(), name='panel'),
    path('publicacion/', views.PublicacionView.as_view(), name='publicacion'),
]
