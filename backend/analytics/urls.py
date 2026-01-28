from django.urls import path
from .views import UploadCSV, SummaryView, HistoryView

urlpatterns = [
    path('upload/', UploadCSV.as_view(), name='upload'),
    path('summary/', SummaryView.as_view(), name='summary'),
    path('history/', HistoryView.as_view(), name='history'),
]