"""
Vistas para el sitio de Luis Fernando Suarez Brucsoni - Inmobiliaria.
"""
from django.views.generic import TemplateView


class InicioView(TemplateView):
    template_name = 'index.html'
    extra_context = {'active_nav': 'inicio'}


class PortafolioView(TemplateView):
    template_name = 'Portafolio.html'
    extra_context = {'active_nav': 'portafolio'}


class InmuebleView(TemplateView):
    template_name = 'Inmueble.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['active_nav'] = None
        context['inmueble_id'] = self.kwargs.get('id')
        return context


class InicioSesionView(TemplateView):
    template_name = 'InicioDeSesion.html'
    extra_context = {'active_nav': None}


class PanelView(TemplateView):
    template_name = 'Panel.html'
    extra_context = {'active_nav': None}


class PublicacionView(TemplateView):
    template_name = 'Publicacion.html'
    extra_context = {'active_nav': None}
