from pprint import (pprint, pformat)
import json
import pickle
import sys
import re
import subprocess
import asyncio
from copy import deepcopy
from keymgr import sign_with_did
import json
import pickle
from datetime import datetime
from pipes_lib import ( INPUT_DIR, OUTPUT_DIR, linked_claim_context, template, remove_non_ascii )

claim_file = sys.argv[1]

with open(claim_file, 'r') as f:
    vc = json.load(f)

def signit(vc, name='local_did'):
    return asyncio.run(sign_with_did(vc, 'local_did'))

signed = signit(vc)

print(signed)     
              

