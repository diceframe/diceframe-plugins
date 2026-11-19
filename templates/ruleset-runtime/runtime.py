"""Minimal JSON-lines RuntimeProbe example.

Replace the operation handlers with the actual ruleset implementation. The
host starts this process without a shell and sends one JSON request per line.
Every response must preserve the request_id and contain a JSON result.
"""

from __future__ import annotations

import json
import sys


def handle(request: dict) -> dict:
    operation = str(request.get("operation") or "")
    if operation == "describe_experience":
        return {"runtime_id": "community:my-ruleset-runtime", "runtime_version": 1}
    if operation == "validate_character":
        return []
    if operation in {"builder_choices", "derive_character", "finalize_character", "normalize_character_submission"}:
        payload = request.get("payload") or {}
        return payload.get("draft") or payload.get("character") or {}
    raise ValueError(f"unsupported operation: {operation}")


for raw in sys.stdin:
    request = None
    try:
        request = json.loads(raw)
        result = handle(request)
        response = {"request_id": request.get("request_id"), "ok": True, "result": result}
    except Exception as exc:  # noqa: BLE001 - example boundary must return JSON
        response = {"request_id": request.get("request_id") if isinstance(locals().get("request"), dict) else None, "ok": False, "error": str(exc)}
    sys.stdout.write(json.dumps(response, ensure_ascii=False, separators=(",", ":")) + "\n")
    sys.stdout.flush()
