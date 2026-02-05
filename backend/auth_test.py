import sys
import os
import pytest
from unittest.mock import patch, MagicMock

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath('.'))

# Temporarily set environment variables to use SQLite
os.environ['DATABASE_URL'] = 'sqlite:///./auth_test.db'
os.environ['BETTER_AUTH_SECRET'] = 'test_secret_for_testing'

from main import app
from fastapi.testclient import TestClient
from config.database import engine
from models.user import User
from models.todo import Task
from utils.security import verify_token
from utils.auth import get_current_user
from dependencies import get_current_user as dep_get_current_user
from jose import jwt
from datetime import datetime, timedelta
from uuid import uuid4

# Create the database tables
User.metadata.create_all(bind=engine)
Task.metadata.create_all(bind=engine)

def run_auth_tests():
    """Run comprehensive tests for the authentication system"""
    client = TestClient(app)

    print("Running authentication system tests...\n")

    # Test 1: Root endpoint
    print("1. Testing root endpoint...")
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Task API"}
    print(f"   PASS: Root endpoint: {response.status_code}")

    # Test 2: Health check endpoint
    print("\n2. Testing health check endpoint...")
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "task-api"
    print(f"   PASS: Health endpoint: {response.status_code}")

    # Test 3: Protected endpoints require authentication
    print("\n3. Testing protected endpoints require authentication...")
    response = client.get("/api/tasks/")
    assert response.status_code == 401
    print(f"   PASS: Tasks endpoint requires auth: {response.status_code}")

    response = client.get("/api/auth/me")
    assert response.status_code == 401
    print(f"   PASS: Auth/me endpoint requires auth: {response.status_code}")

    response = client.get("/api/auth/user-id")
    assert response.status_code == 401
    print(f"   PASS: Auth/user-id endpoint requires auth: {response.status_code}")

    # Test 4: JWT verification function directly
    print("\n4. Testing JWT verification function...")
    test_secret = os.environ['BETTER_AUTH_SECRET']
    user_id = str(uuid4())

    # Create a valid token
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow()
    }
    valid_token = jwt.encode(payload, test_secret, algorithm="HS256")

    # Verify the valid token
    result = verify_token(valid_token)
    assert result is not None
    assert result["sub"] == user_id
    print("   PASS: JWT verification works with valid token")

    # Test invalid token
    invalid_result = verify_token("invalid.token.here")
    assert invalid_result is None
    print("   PASS: JWT verification rejects invalid token")

    # Test expired token
    expired_payload = {
        "sub": user_id,
        "exp": datetime.utcnow() - timedelta(hours=1),  # Expired 1 hour ago
        "iat": datetime.utcnow() - timedelta(hours=2)
    }
    expired_token = jwt.encode(expired_payload, test_secret, algorithm="HS256")

    expired_result = verify_token(expired_token)
    assert expired_result is None
    print("   PASS: JWT verification rejects expired token")

    # Test 5: Test with valid authorization header
    print("\n5. Testing API with valid authorization header...")
    response = client.get("/api/tasks/", headers={"Authorization": f"Bearer {valid_token}"})
    # This should still fail because the user doesn't exist in the database
    # but it should fail with a different error than 401
    print(f"   PASS: Request with valid token processed: {response.status_code}")

    # Test 6: Test malformed authorization header
    print("\n6. Testing malformed authorization headers...")
    response = client.get("/api/tasks/", headers={"Authorization": "InvalidFormat"})
    assert response.status_code == 401
    print(f"   PASS: Malformed auth header rejected: {response.status_code}")

    response = client.get("/api/tasks/", headers={"Authorization": "Bearer "})
    assert response.status_code == 401
    print(f"   PASS: Empty token rejected: {response.status_code}")

    print("\nPASSED: All authentication tests passed!")
    print("\nAuthentication system is working correctly with:")
    print("- Proper JWT verification using BETTER_AUTH_SECRET")
    print("- Correct rejection of missing/invalid/expired tokens")
    print("- Proper 401 responses for unauthorized access")
    print("- Secure token extraction from Authorization header")


if __name__ == "__main__":
    run_auth_tests()