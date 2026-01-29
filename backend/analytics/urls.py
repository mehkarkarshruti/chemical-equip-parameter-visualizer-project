from django.urls import path
from .views import UploadCSV, SummaryView, HistoryView, generate_pdf

urlpatterns = [
    path('upload/', UploadCSV.as_view(), name='upload_csv'),
    path('summary/', SummaryView.as_view(), name='summary'),
    path('history/', HistoryView.as_view(), name='history'),
    path('report/', generate_pdf, name='generate_pdf'),
]