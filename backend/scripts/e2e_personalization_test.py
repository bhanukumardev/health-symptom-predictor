import sys
import time
import uuid
import requests


def pick_base_url():
    for port in (8001, 8000):
        url = f"http://localhost:{port}"
        try:
            r = requests.get(url + "/health", timeout=5)
            if r.status_code == 200:
                return url
        except Exception:
            pass
    raise RuntimeError("Backend not reachable on 8001 or 8000")


def register(session: requests.Session, base: str, email: str, password: str, full_name: str):
    payload = {
        "email": email,
        "password": password,
        "full_name": full_name,
        "age": 28,
        "gender": "female",
    }
    r = session.post(base + "/api/auth/register", json=payload, timeout=10)
    if r.status_code in (200, 201):
        return True
    # If already registered, accept and continue
    try:
        data = r.json()
    except Exception:
        data = {}
    if r.status_code == 400 and "already" in str(data.get("detail", "")).lower():
        return True
    # Otherwise, treat as failure
    raise RuntimeError(f"Register failed: {r.status_code} {data}")


def login(session: requests.Session, base: str, email: str, password: str) -> str:
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    body = {
        "username": email,
        "password": password,
    }
    r = session.post(base + "/api/auth/login", data=body, headers=headers, timeout=10)
    r.raise_for_status()
    token = r.json().get("access_token")
    if not token:
        raise RuntimeError("No token returned from login")
    return token


def includes_name_en(msg: str, first_name: str) -> bool:
    if not msg:
        return False
    head = msg[:80]
    return (f"Hi {first_name}" in head) or (first_name in msg)


def includes_name_hi(msg: str, first_name: str) -> bool:
    if not msg:
        return False
    head = msg[:80]
    return ("नमस्ते" in head) and (first_name in msg)


def main():
    base = pick_base_url()
    print("Using backend:", base)
    session = requests.Session()

    unique = uuid.uuid4().hex[:8]
    email = f"e2e_{unique}@test.com"
    password = "TestPass123!"
    full_name = "Priya Sharma"
    first_name = "Priya"

    register(session, base, email, password, full_name)
    token = login(session, base, email, password)
    headers = {"Authorization": f"Bearer {token}"}

    en = session.post(base + "/api/notifications/personalized", params={"language": "en"}, headers=headers, timeout=20)
    hi = session.post(base + "/api/notifications/personalized", params={"language": "hi"}, headers=headers, timeout=20)

    en.raise_for_status()
    hi.raise_for_status()

    en_msg = (en.json() or {}).get("message", "")
    hi_msg = (hi.json() or {}).get("message", "")

    print("EN:", en_msg[:140])
    print("HI:", hi_msg[:140])

    ok_en = includes_name_en(en_msg, first_name)
    ok_hi = includes_name_hi(hi_msg, first_name)

    print("Includes name in EN?", ok_en)
    print("Includes name in HI?", ok_hi)

    if ok_en and ok_hi:
        print("PERSONALIZATION: PASS")
        return 0
    else:
        print("PERSONALIZATION: FAIL")
        return 2


if __name__ == "__main__":
    sys.exit(main())
