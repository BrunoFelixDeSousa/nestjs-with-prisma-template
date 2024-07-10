# Gerando Chaves RSA de 2048 bits com OpenSSL

Este guia descreve como gerar um par de chaves RSA de 2048 bits utilizando OpenSSL.

## Passo 1: Instalar OpenSSL (se não estiver instalado):

```bash
sudo apt-get install openssl   # Para distribuições baseadas em Debian/Ubuntu
sudo yum install openssl       # Para distribuições baseadas em Red Hat/CentOS

```

## Passo 2: Gerar a chave privada de 2048 bits

Execute o seguinte comando no terminal para gerar uma chave privada RSA de 2048 bits:

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

## Passo 3: Gerar a chave pública a partir da chave privada

Use o comando abaixo para gerar a chave pública a partir da chave privada gerada no passo anterior:

```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## Resultado

Após executar os comandos acima, você terá dois arquivos:

- `private_key.pem`: Contém a chave privada RSA de 2048 bits.
- `public_key.pem`: Contém a chave pública correspondente.

Certifique-se de armazenar a chave privada (`private_key.pem`) em um local seguro, pois ela é necessária para a descriptografia e deve ser mantida confidencial.

A chave pública (`public_key.pem`) pode ser compartilhada com qualquer pessoa que precise criptografar dados para você.


## Converter a chave privada (private_key.pem) para Base64

```bash
base64 private_key.pem -w 0 > private_key_base64.pem
```

## Converter a chave pública (public_key.pem) para Base64

```bash
base64 public_key.pem -w 0 > public_key_base64.pem
```