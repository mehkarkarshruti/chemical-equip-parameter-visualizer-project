from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import CSVUploadSerializer
from .models import EquipmentSummary
import pandas as pd

class UploadCSV(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = CSVUploadSerializer

    def post(self, request):
        serializer = CSVUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data['file']
        df = pd.read_csv(file)

        summary = {
            "total_equipment": len(df),
            "avg_flowrate": df["Flowrate"].mean(),
            "avg_pressure": df["Pressure"].mean(),
            "avg_temperature": df["Temperature"].mean(),
            "type_distribution": df["Type"].value_counts().to_dict()
        }

        # Save to DB
        EquipmentSummary.objects.create(**summary)

        # Keep only last 5
        qs = EquipmentSummary.objects.order_by('-uploaded_at')
        if qs.count() > 5:
            for old in qs[5:]:
                old.delete()

        return Response(summary)


class SummaryView(APIView):
    def get(self, request):
        latest = EquipmentSummary.objects.order_by('-uploaded_at').first()
        if latest:
            data = {
                "total_equipment": latest.total_equipment,
                "avg_flowrate": latest.avg_flowrate,
                "avg_pressure": latest.avg_pressure,
                "avg_temperature": latest.avg_temperature,
                "type_distribution": latest.type_distribution,
                "uploaded_at": latest.uploaded_at
            }
            return Response(data)
        else:
            return Response({"detail": "No summary available. Please upload a CSV first."})


class HistoryView(APIView):
    def get(self, request):
        summaries = EquipmentSummary.objects.order_by('-uploaded_at')[:5]
        data = [
            {
                "total_equipment": s.total_equipment,
                "avg_flowrate": s.avg_flowrate,
                "avg_pressure": s.avg_pressure,
                "avg_temperature": s.avg_temperature,
                "type_distribution": s.type_distribution,
                "uploaded_at": s.uploaded_at
            }
            for s in summaries
        ]
        return Response(data)