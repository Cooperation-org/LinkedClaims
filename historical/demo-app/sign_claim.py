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

def resolve_local_contexts(vc):
    context = []
    for src in vc['@context']:
        # didkit has w3 contexts preloaded
        if (type(src) == dict or re.search('w3.org', src)):
            context.append(src)
        else:
            # lets see if we have it locally
            with open(src, 'r') as cf:
               lc = json.load(cf)
            context.append(lc)
    vc['@context'] = context 

def signit(vc, name='local_did'):
    return asyncio.run(sign_with_did(vc, 'local_did'))

resolve_local_contexts(vc)
signed = signit(vc)

print(signed)              

