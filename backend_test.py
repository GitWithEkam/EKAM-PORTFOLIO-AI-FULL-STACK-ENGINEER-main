#!/usr/bin/env python3
"""
Backend API tests for Ekamnoor Singh Portfolio - Round 3 Retest
Tests the chat endpoint after system prompt change (greeting style update)
"""
import requests
import json
import sys

BASE_URL = "https://ai-engineer-hub-60.preview.emergentagent.com/api"

def test_chat_projects_question():
    """Test 1: POST /api/chat - Ask about Ekamnoor's top projects"""
    print("\n" + "="*80)
    print("TEST 1: POST /api/chat - What are Ekamnoor's top projects?")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/chat"
        payload = {
            "sessionId": "r3-1",
            "message": "What are Ekamnoor's top projects?"
        }
        
        print(f"Request: POST {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=30)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        reply = data.get('reply', '')
        
        # Check for fallback error messages
        fallback_phrases = [
            "I had a small hiccup",
            "trouble reaching my brain",
            "Shukrana for your patience"
        ]
        
        is_fallback = any(phrase in reply for phrase in fallback_phrases)
        
        if is_fallback:
            print(f"❌ FAILED: Reply contains fallback error text")
            print(f"Reply: {reply}")
            return False
        
        # Check if reply mentions the projects
        projects = ["PitchRoute", "AI Virtual University Assistant", "Smart Attendance"]
        mentioned_projects = [p for p in projects if p.lower() in reply.lower() or p.replace(" ", "").lower() in reply.lower()]
        
        print(f"\n✅ PASSED: Got relevant reply (not fallback)")
        print(f"Reply text: {reply}")
        print(f"Projects mentioned: {mentioned_projects}")
        
        if len(mentioned_projects) >= 2:
            print(f"✅ Reply mentions at least 2 projects: {mentioned_projects}")
        else:
            print(f"⚠️  WARNING: Reply mentions only {len(mentioned_projects)} project(s): {mentioned_projects}")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED with exception: {str(e)}")
        return False


def test_chat_followup_cost_efficiency():
    """Test 2: POST /api/chat - Multi-turn follow-up about cost efficiency"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/chat - Follow-up: Which improved cost efficiency?")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/chat"
        payload = {
            "sessionId": "r3-1",
            "message": "Which one improved cost efficiency and by how much?"
        }
        
        print(f"Request: POST {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=30)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        reply = data.get('reply', '')
        
        # Check for fallback error messages
        fallback_phrases = [
            "I had a small hiccup",
            "trouble reaching my brain",
            "Shukrana for your patience"
        ]
        
        is_fallback = any(phrase in reply for phrase in fallback_phrases)
        
        if is_fallback:
            print(f"❌ FAILED: Reply contains fallback error text")
            print(f"Reply: {reply}")
            return False
        
        # Check if reply mentions PitchRoute and 40%
        mentions_pitchroute = "pitchroute" in reply.lower()
        mentions_40_percent = "40" in reply
        
        print(f"\n✅ PASSED: Got relevant reply (not fallback)")
        print(f"Reply text: {reply}")
        print(f"Mentions PitchRoute: {mentions_pitchroute}")
        print(f"Mentions 40%: {mentions_40_percent}")
        
        if mentions_pitchroute and mentions_40_percent:
            print(f"✅ Session continuity confirmed: Reply references PitchRoute and 40%")
        else:
            print(f"⚠️  WARNING: Reply may not fully reference PitchRoute/40%")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED with exception: {str(e)}")
        return False


def test_chat_empty_message():
    """Test 3: POST /api/chat - Empty message validation"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/chat - Empty message validation")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/chat"
        payload = {
            "sessionId": "r3-1",
            "message": ""
        }
        
        print(f"Request: POST {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=30)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status 400, got {response.status_code}")
            return False
        
        data = response.json()
        error = data.get('error', '')
        
        if 'empty' in error.lower():
            print(f"✅ PASSED: Empty message correctly returns 400 with error: {error}")
            return True
        else:
            print(f"⚠️  WARNING: Got 400 but error message unexpected: {error}")
            return True
        
    except Exception as e:
        print(f"❌ FAILED with exception: {str(e)}")
        return False


def test_admin_correct_key():
    """Test 4: GET /api/admin - Correct admin key"""
    print("\n" + "="*80)
    print("TEST 4: GET /api/admin - Correct admin key")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/admin?key=EkamSingh@2026"
        
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=30)
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            print(f"Response Body: {response.text}")
            return False
        
        data = response.json()
        
        # Check for required keys
        required_keys = ['visits', 'contacts', 'leads', 'chats']
        missing_keys = [k for k in required_keys if k not in data]
        
        if missing_keys:
            print(f"❌ FAILED: Missing keys in response: {missing_keys}")
            print(f"Response Body: {json.dumps(data, indent=2)}")
            return False
        
        print(f"✅ PASSED: Admin endpoint returns 200 with all required keys")
        print(f"Response summary:")
        print(f"  - visits: {data.get('visits')}")
        print(f"  - contacts: {len(data.get('contacts', []))} items")
        print(f"  - leads: {len(data.get('leads', []))} items")
        print(f"  - chats: {len(data.get('chats', []))} items")
        
        return True
        
    except Exception as e:
        print(f"❌ FAILED with exception: {str(e)}")
        return False


def test_admin_wrong_key():
    """Test 5: GET /api/admin - Wrong admin key"""
    print("\n" + "="*80)
    print("TEST 5: GET /api/admin - Wrong admin key")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/admin?key=wrongpass"
        
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=30)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status 401, got {response.status_code}")
            return False
        
        data = response.json()
        error = data.get('error', '')
        
        if 'unauthorized' in error.lower():
            print(f"✅ PASSED: Wrong key correctly returns 401 with error: {error}")
            return True
        else:
            print(f"⚠️  WARNING: Got 401 but error message unexpected: {error}")
            return True
        
    except Exception as e:
        print(f"❌ FAILED with exception: {str(e)}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("BACKEND API TESTS - ROUND 3 RETEST")
    print("Testing Ekamnoor Singh Portfolio Backend")
    print(f"Base URL: {BASE_URL}")
    print("="*80)
    
    results = []
    
    # Run all tests
    results.append(("Chat - Projects Question", test_chat_projects_question()))
    results.append(("Chat - Follow-up Cost Efficiency", test_chat_followup_cost_efficiency()))
    results.append(("Chat - Empty Message Validation", test_chat_empty_message()))
    results.append(("Admin - Correct Key", test_admin_correct_key()))
    results.append(("Admin - Wrong Key", test_admin_wrong_key()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
