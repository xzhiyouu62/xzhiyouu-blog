---
title: picoCTF 2024 custom encryption
published: 2025-06-19
category: CTF
licenseName: "Unlicensed"
author: xzhiyouu
sourceLink: "https://hackmd.io/@xzhiyouu/S1xXGObNxl"
draft: false
---
![image](https://hackmd.io/_uploads/SkkIfdZNgl.png)
給了兩個檔案，分別是 `enc_flag` 和 `custom_encryption.py`

`enc_flag`
```
a = 94
b = 29
cipher is: [260307, 491691, 491691, 2487378, 2516301, 0, 1966764, 1879995, 1995687, 1214766, 0, 2400609, 607383, 144615, 1966764, 0, 636306, 2487378, 28923, 1793226, 694152, 780921, 173538, 173538, 491691, 173538, 751998, 1475073, 925536, 1417227, 751998, 202461, 347076, 491691]
```
`custom_encryption.py`
```python=
from random import randint
import sys


def generator(g, x, p):
    return pow(g, x) % p


def encrypt(plaintext, key):
    cipher = []
    for char in plaintext:
        cipher.append(((ord(char) * key*311)))
    return cipher


def is_prime(p):
    v = 0
    for i in range(2, p + 1):
        if p % i == 0:
            v = v + 1
    if v > 1:
        return False
    else:
        return True


def dynamic_xor_encrypt(plaintext, text_key):
    cipher_text = ""
    key_length = len(text_key)
    for i, char in enumerate(plaintext[::-1]):
        key_char = text_key[i % key_length]
        encrypted_char = chr(ord(char) ^ ord(key_char))
        cipher_text += encrypted_char
    return cipher_text


def test(plain_text, text_key):
    p = 97
    g = 31
    if not is_prime(p) and not is_prime(g):
        print("Enter prime numbers")
        return
    a = randint(p-10, p)
    b = randint(g-10, g)
    print(f"a = {a}")
    print(f"b = {b}")
    u = generator(g, a, p)
    v = generator(g, b, p)
    key = generator(v, a, p)
    b_key = generator(u, b, p)
    shared_key = None
    if key == b_key:
        shared_key = key
    else:
        print("Invalid key")
        return
    semi_cipher = dynamic_xor_encrypt(plain_text, text_key)
    cipher = encrypt(semi_cipher, shared_key)
    print(f'cipher is: {cipher}')


if __name__ == "__main__":
    message = sys.argv[1]
    test(message, "trudeau")
```
從最後一行程式可以知道，`plain_text` 是 message、`text_key` 是 trudeau
#### 加密
1. [Diffie–Hellman](https://ithelp.ithome.com.tw/articles/10294073)
   *  用 p、g、a、b 算 shared_key
2. XOR + 字串反轉
   * 反轉明文 + 每個字元與 "trudeau" 做 XOR 加密
3. 轉密文
   * `ord(char) * shared_key * 311`
#### 解密
先找 `key`
```python
>>> p = 97
>>> g = 31
>>> a = 94
>>> b = 29
>>> u = pow(g,a,p)
>>> v= pow(g,b,p)
>>> key = pow(v,a,p)
>>> print(key)
93
```
還原 `semi_cipher`
```python
cipher = encrypt(semi_cipher, shared_key)
```
```python
def encrypt(plaintext, key):
    cipher = []
    for char in plaintext:
        cipher.append(((ord(char) * key*311)))
    return cipher
```
所以呢
```python
semi[i] = cipher[i] // (shared_key * 311)
```
得到 `semi_cipher` 後，拿去 xor 回推
```python
semi_cipher = dynamic_xor_encrypt(plain_text, text_key)
```
```python
def dynamic_xor_encrypt(plaintext, text_key):
    cipher_text = ""
    key_length = len(text_key)
    for i, char in enumerate(plaintext[::-1]):
        key_char = text_key[i % key_length]
        encrypted_char = chr(ord(char) ^ ord(key_char))
        cipher_text += encrypted_char
    return cipher_text
```
用 key `trudeau` 對 semi 的每個字元 xor ，然後再反轉

### 完整python解密程式
```python=
cipher = [
    260307, 491691, 491691, 2487378, 2516301, 0, 1966764, 1879995,
    1995687, 1214766, 0, 2400609, 607383, 144615, 1966764, 0,
    636306, 2487378, 28923, 1793226, 694152, 780921, 173538,
    173538, 491691, 173538, 751998, 1475073, 925536, 1417227,
    751998, 202461, 347076, 491691
]

shared_key = 93

semi = [] 
for i in cipher:
    ascii_val = i // (shared_key * 311)
    semi.append(ascii_val)

key = b"trudeau"
key_len = len(key)

xor_decoded = [] 
for i in range(len(semi)):
    xor_byte = semi[i] ^ key[i % key_len]
    xor_decoded.append(xor_byte)

flag_bytes = xor_decoded[::-1]

flag = ''.join(chr(i) for i in flag_bytes)
print(flag)
```

`picoCTF{cu?????????dc}`
