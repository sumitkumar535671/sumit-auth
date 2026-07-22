# !/bin/bash

# set the directory where certificates will be stored
CERT_DIR="cert"

# create the directory if it doesn't exist
mkdir -p "$CERT_DIR"

# generate a private key (RSA 2048 bits)
openssl genpkey -algorithm RSA -out "$CERT_DIR/private-key.pem" -pkeyopt rsa_keygen_bits:2048

# generate the public key from the private key
openssl rsa -in "$CERT_DIR/private-key.pem" -pubout -out "$CERT_DIR/public-key.pub"

# print success message
echo "Keys generated successfully. Private key: $CERT_DIR/private-key.pem, Public key: $CERT_DIR/public-key.pub"