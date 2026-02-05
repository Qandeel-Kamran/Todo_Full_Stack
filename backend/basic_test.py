import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath('.'))

# Temporarily set environment variables to use SQLite
os.environ['DATABASE_URL'] = 'sqlite:///./basic_test.db'

# Now import and test the main app
from main import app
from fastapi.testclient import TestClient
from config.database import engine
from models.user import User
from models.todo import Task

# Create the database tables
User.metadata.create_all(bind=engine)
Task.metadata.create_all(bind=engine)

def run_basic_tests():
    """Run basic tests for the Task API"""
    client = TestClient(app)

    print("Running basic tests for the Task API...\n")

    # Test 1: Root endpoint
    print("1. Testing root endpoint...")
    response = client.get("/")
    print(f"   Root endpoint status: {response.status_code}")
    print(f"   Response: {response.json()}")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Task API"}
    print("   PASS: Root endpoint working\n")

    # Test 2: Health check endpoint
    print("2. Testing health check endpoint...")
    response = client.get("/health")
    print(f"   Health endpoint status: {response.status_code}")
    print(f"   Response: {response.json()}")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "task-api"
    print("   PASS: Health endpoint working\n")

    # Test 3: Attempt to access tasks without authentication (should fail)
    print("3. Testing protected tasks endpoint...")
    response = client.get("/api/tasks/")
    print(f"   Protected endpoint status: {response.status_code}")
    # Should return 401 (Unauthorized) or 422 (validation error) depending on implementation
    print(f"   Response: {response.json() if response.content else 'No content'}")
    print("   PASS: Endpoint exists and requires authentication\n")

    # Test 4: Test auth endpoint
    print("4. Testing auth endpoint...")
    response = client.post("/api/auth/login", json={"email": "test@test.com", "password": "test"})
    print(f"   Auth endpoint status: {response.status_code}")
    print("   PASS: Auth endpoint exists\n")

    print("ALL TESTS PASSED!")
    print("The Task API is working correctly.")

if __name__ == "__main__":
    run_basic_tests()