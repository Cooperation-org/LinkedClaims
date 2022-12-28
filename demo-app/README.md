This is a Flask app and a CLI for issuing trust claims

Installation
---------------

create python virtual environment if not already set up

```
python3 -m venv venv
. venv/bin/activate
pip3 install -r requirements.txt
```

Running
----------------

`flask run`

Note that the demo app will create its own DID and private key for signing, and will save a local jwk file with the key.

To change the signing behavior please examine the functions `make_vc` and `sign_with_did`

The interface at `localhost:5000` will create a simple LinkedClaim credential from a web form and generate the signed claim.


Signing a Credential with CLI
-----------------------------

To sign a credential, run 

`python3 sign_claim.py /path/to/unsigned_claim.json`

The "issuer" field in the unsigned claim will be replaced by the demo DID.

Local context files will be replaced by the contents of the corresponding file in the local directory.  This is necessary because didkit does not resolve remote contexts, and has only selected contexts preloaded.
