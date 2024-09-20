import jose from 'node-jose'

async function createPrivateKey() {
    // Create a keystore (can hold multiple keys)
    const keystore = jose.JWK.createKeyStore();

    // Generate a new private key (for example, RSA key with 2048-bit length)
    const key = await keystore.generate('RSA', 2048, {
        alg: 'RS256',
        use: 'sig' // sig (signing) or enc (encryption)
    });

    // Output the private key in JWK format
    console.log('Private Key (JWK):', JSON.stringify(key.toJSON(true))); // true includes the private part
}

createPrivateKey();