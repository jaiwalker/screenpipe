#!/usr/bin/env python3
# screenpipe — AI that knows everything you've seen, said, or heard
# https://screenpipe.com
"""Retain a canonical development bundle with isolated local settings.
Run the queued build_macos.sh first. This script does not compile or publish.
"""
import hashlib
import json
import os
from pathlib import Path
import plistlib
import shutil
import subprocess

repo = Path(__file__).resolve().parents[2]
release = json.loads((repo / 'cto-release.json').read_text())
identity = os.environ.get('APPLE_SIGNING_IDENTITY', '-')
version = f"{release['companionVersion']}-build{release['build']}"
source = repo / 'apps/screenpipe-app-tauri/src-tauri/target/debug-dev/bundle/macos/screenpipe - Development.app'
root = repo / '.cto-runtime'
root.mkdir(mode=0o700, exist_ok=True)
destination = root / 'releases' / version
# Never overwrite an earlier candidate, including a failed packaging attempt.
destination.mkdir(parents=True, mode=0o700, exist_ok=False)
try:
    subprocess.run(['codesign', '--verify', '--deep', '--strict', str(source)], check=True)
    app = destination / 'CTO Memory Development.app'
    shutil.copytree(source, app, symlinks=True)
    data = root / 'data' / version
    data.mkdir(parents=True, mode=0o700, exist_ok=True)
    plist = app / 'Contents/Info.plist'
    settings = plistlib.loads(plist.read_bytes())
    if settings.get('CFBundleIdentifier') != 'screenpi.pe.dev':
        raise RuntimeError('Refusing to package a non-development app identity')
    settings['LSEnvironment'] = {
        'SCREENPIPE_DATA_DIR': str(data),
        'SCREENPIPE_PORT': '3040',
        'SCREENPIPE_DISABLE_TELEMETRY': 'true',
    }
    settings['CTOCompanionVersion'] = version
    plist.write_bytes(plistlib.dumps(settings))
    subprocess.run(['codesign', '--force', '--deep', '--sign', identity, str(app)], check=True)
    subprocess.run(['codesign', '--verify', '--deep', '--strict', str(app)], check=True)
    executable = app / 'Contents/MacOS' / settings['CFBundleExecutable']
    release.update({
        'sourceCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip(),
        'sourceDirty': bool(subprocess.check_output(['git', 'status', '--porcelain'], cwd=repo, text=True).strip()),
        'executableSHA256': hashlib.file_digest(executable.open('rb'), 'sha256').hexdigest(),
        'app': str(app), 'dataDirectory': str(data), 'port': 3040,
        'signingIdentity': identity, 'notarized': False,
    })
    (destination / 'manifest.json').write_text(json.dumps(release, indent=2) + '\n')
    print(json.dumps(release, indent=2))
except Exception:
    (destination / 'FAILED.txt').write_text('Packaging failed; do not launch this candidate. Review the command log.\n')
    raise
