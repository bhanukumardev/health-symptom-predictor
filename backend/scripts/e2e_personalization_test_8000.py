import sys
import uuid
import requests


def pick_base_url():
    # Prefer 8000 first to avoid stale process on 8001
    for port in (8000, 8001):
        url = f"http://localhost:{port}"
        try:
            r = requests.get(url + "/health", timeout=5)
            if r.status_code == 200:
                return url
        except Exception:
            pass
    raise RuntimeError("Backend not reachable on 8000 or 8001")


def register(s: requests.Session, base: str, email: str, password: str, full_name: str):
    payload = {
        "email": email,
        "password": password,
        "full_name": full_name,
    }
    r = s.post(base + "/api/auth/register", json=payload, timeout=10)
    if r.status_code in (200, 201):
        return True
    try:
        data = r.json()
    except Exception:
        data = {}
    if r.status_code == 400 and "already" in str(data.get("detail", "")).lower():
        return True
    raise RuntimeError(f"Register failed: {r.status_code} {data}")


def login(s: requests.Session, base: str, email: str, password: str) -> str:
    body = {"username": email, "password": password}
    r = s.post(base + "/api/auth/login", data=body, headers={"Content-Type": "application/x-www-form-urlencoded"}, timeout=10)
    r.raise_for_status()
    token = r.json().get("access_token")
    if not token:
        raise RuntimeError("No token returned from login")
    return token


def main():
    base = pick_base_url()
    print("Using backend:", base)
    s = requests.Session()

    email = f"e2e_{uuid.uuid4().hex[:8]}@test.com"
    password = "TestPass123!"
    full_name = "Alice Johnson"

    register(s, base, email, password, full_name)
    token = login(s, base, email, password)
    headers = {"Authorization": f"Bearer {token}"}

    en = s.post(base + "/api/notifications/personalized", params={"language": "en"}, headers=headers, timeout=20)
    hi = s.post(base + "/api/notifications/personalized", params={"language": "hi"}, headers=headers, timeout=20)

    en.raise_for_status(); hi.raise_for_status()

    en_msg = (en.json() or {}).get("message", "")
    hi_msg = (hi.json() or {}).get("message", "")

    print("EN:", en_msg[:160])
    print("HI:", hi_msg[:160])

    ok_en = en_msg.startswith("Hi Alice") or "Alice" in en_msg
    ok_hi = ("नमस्ते" in hi_msg[:80]) and ("Alice" in hi_msg)

    print("Includes name in EN?", ok_en)
    print("Includes name in HI?", ok_hi)

    return 0 if (ok_en and ok_hi) else 2


if __name__ == "__main__":
    sys.exit(main())
