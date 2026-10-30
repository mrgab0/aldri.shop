#!/usr/bin/env python3
"""
Checkly Cloud Eyes Synchronizer & Trigger for aldri.shop
Permite al agente y al fundador ejecutar y verificar Playwright en la nube sin instalar Chromium en Termux.
"""
import sys, os, json, urllib.request, time

def load_env():
    env = {}
    env_file = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_file):
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = load_env()
ACCOUNT_ID = os.getenv("CHECKLY_ACCOUNT_ID") or ENV.get("CHECKLY_ACCOUNT_ID", "f2caf3ea-620a-49e2-86ef-a8cd7955ee45")
API_KEY = os.getenv("CHECKLY_API_KEY") or ENV.get("CHECKLY_API_KEY", "sv_cb924b7193ab4bc68cc069318da1a565")
CHECK_ID = os.getenv("CHECKLY_DEFAULT_CHECK_ID") or ENV.get("CHECKLY_DEFAULT_CHECK_ID", "c224af8b-e557-41e7-b327-c559ac3555f0")
BASE_URL = "https://api.checklyhq.com/v1"

HEADERS = {
    "X-Checkly-Account": ACCOUNT_ID,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "User-Agent": "aldri.shop-agent/1.0"
}

def api_request(path, method="GET", body=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode('utf-8') if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8')
            return json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        print(f"[Error HTTP {e.code}] {err_msg}", file=sys.stderr)
        raise

def get_status():
    print("=== ESTADO DE CHECKS EN CHECKLY CLOUD ===")
    checks = api_request("/checks")
    for c in checks:
        print(f"ID: {c.get('id')} | Nombre: {c.get('name')} | Tipo: {c.get('checkType')} | Activo: {c.get('activated')}")
    return checks

def sync_spec():
    spec_path = os.path.join(os.path.dirname(__file__), '..', '__checks__', 'storefront.spec.ts')
    if not os.path.exists(spec_path):
        print(f"No se encontró {spec_path}", file=sys.stderr)
        sys.exit(1)
        
    with open(spec_path, 'r', encoding='utf-8') as f:
        spec_content = f.read()

    # Convertir 'import { test, expect } from ...' a CommonJS compatible con el runner directo si es necesario
    js_script = spec_content
    if "import { test, expect }" in js_script:
        js_script = js_script.replace("import { test, expect } from '@playwright/test';", "const { test, expect } = require('@playwright/test');")

    print(f"Sincronizando {spec_path} con Checkly Check ({CHECK_ID})...")
    payload = {
        "name": "aldri.shop - Visual Eyes & Theme Check",
        "activated": True,
        "frequency": 60,
        "locations": ["us-east-1"],
        "runtimeId": "2024.02",
        "script": js_script,
        "tags": ["storefront", "visual-eyes", "aldri-shop"]
    }

    res = api_request(f"/checks/browser/{CHECK_ID}", method="PUT", body=payload)
    print("Check actualizado con éxito en Checkly Cloud!")
    return res

def trigger_check():
    print(f"Disparando ejecución en la nube para el Check {CHECK_ID}...")
    trigger_payload = {
        "target": {
            "checkId": [CHECK_ID]
        },
        "refreshCache": True
    }
    res = api_request("/check-sessions/trigger", method="POST", body=trigger_payload)
    sessions = res.get("sessions", [])
    if not sessions:
        print("No se iniciaron sesiones.", file=sys.stderr)
        return None
        
    session = sessions[0]
    session_id = session.get("checkSessionId")
    session_link = session.get("checkSessionLink")
    print(f"Sesión iniciada: {session_id}")
    print(f"Dashboard en vivo: {session_link}")
    print("Esperando ejecución de Playwright en la nube...")

    # Esperar a que la ejecución termine (hasta 105s para suites visuales completas)
    for i in range(35):
        time.sleep(3)
        check_res = api_request(f"/check-sessions/{session_id}")
        status = check_res.get("status")
        print(f"  [{i*3 + 3}s] Estado: {status}")
        if status in ("PASSED", "FAILED", "DEGRADED", "ERROR"):
            print("==================================================")
            print(f"RESULTADO FINAL: {status}")
            print(f"Tiempo total: {check_res.get('timeElapsed')} ms")
            print(f"Enlace al reporte con Capturas & Video: {session_link}")
            print("==================================================")
            return check_res
            
    print("Timeout esperando resultado. Puedes revisar el dashboard directamente:", session_link)
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] == "--status":
        get_status()
    elif sys.argv[1] == "--sync":
        sync_spec()
    elif sys.argv[1] == "--trigger":
        trigger_check()
    elif sys.argv[1] == "--all":
        sync_spec()
        trigger_check()
    else:
        print("Uso: python3 scripts/checkly-sync.py [--status | --sync | --trigger | --all]")
