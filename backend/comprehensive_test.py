import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath('.'))

# Temporarily set environment variables to use SQLite
os.environ['DATABASE_URL'] = 'sqlite:///./comprehensive_test.db'

# Now import and test the main app
from main import app
from fastapi.testclient import TestClient
from config.database import engine
from models.user import User
from models.todo import Task

# Create the database tables
User.metadata.create_all(bind=engine)
Task.metadata.create_all(bind=engine)

def run_comprehensive_tests():
    """Run comprehensive tests for the Task API"""
    client = TestClient(app)

    print("Running comprehensive tests...\n")

    # Test 1: Root endpoint
    print("1. Testing root endpoint...")
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Task API"}
    print(f"   ✓ Root endpoint: {response.status_code} - {response.json()}")

    # Test 2: Health check endpoint
    print("\n2. Testing health check endpoint...")
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "task-api"
    print(f"   ✓ Health endpoint: {response.status_code} - {response.json()}")

    # Test 3: Attempt to access tasks without authentication (should fail)
    print("\n3. Testing protected tasks endpoint (should require auth)...")
    response = client.get("/api/tasks/")
    assert response.status_code == 401  # Unauthorized
    print(f"   ✓ Protected endpoint correctly requires authentication: {response.status_code}")

    # Test 4: Attempt to access auth endpoints
    print("\n4. Testing auth endpoints existence...")
    # Test that auth endpoints exist (even if they fail due to bad credentials)
    response = client.post("/api/auth/login", json={"email": "test@test.com", "password": "test"})
    assert response.status_code in [401, 422]  # Either unauthorized or validation error
    print(f"   ✓ Auth endpoint exists: {response.status_code}")

    print("\n✓ All comprehensive tests passed!")
    print("\nApplication is working correctly with:")
    print("- Root endpoint accessible")
    print("- Health check working")
    print("- Authentication protection in place")
    print("- API structure intact")

if __name__ == "__main__":
    run_comprehensive_tests()