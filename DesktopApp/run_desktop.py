#!/usr/bin/env python3
"""
Chemical Equipment Visualizer - Desktop Application
Run: python run_desktop.py
"""
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from desktop_app import ChemicalEquipmentApp
from PyQt5.QtWidgets import QApplication

if __name__ == "__main__":
    print("Starting Chemical Equipment Visualizer Desktop App...")
    print("Make sure Django backend is running at http://127.0.0.1:8000")
    
    app = QApplication(sys.argv)
    window = ChemicalEquipmentApp()
    window.show()
    
    sys.exit(app.exec_())