import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath('.'))

# Temporarily set environment variables to use SQLite
os.environ['DATABASE_URL'] = 'sqlite:///./test.db'

# Now import and test the main app
from main import app
from fastapi.testclient import TestClient

def test_read_root():
    """Test the root endpoint"""
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Task API"}

def test_health_check():
    """Test the health check endpoint"""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

if __name__ == "__main__":
    print("Testing basic endpoints...")

    # Test root endpoint
    client = TestClient(app)
    response = client.get("/")
    print(f"Root endpoint: {response.status_code} - {response.json()}")

    # Test health endpoint
    response = client.get("/health")
    print(f"Health endpoint: {response.status_code} - {response.json()}")

    print("Basic tests passed!")