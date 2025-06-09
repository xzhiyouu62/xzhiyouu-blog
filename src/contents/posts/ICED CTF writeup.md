---
title: ICED CTF writeup
published: 2025-06-10
description: My First Post
category: CTF
licenseName: "Unlicensed"
author: xzhiyouu
sourceLink: "https://hackmd.io/@xzhiyouu/HyfcDjZH1e"
draft: false
---

# ICED CTF writeup
~~無聊來打打竹科實中資安社新出的題目~~
~~而且剛好是crypto欸~~
![crypto](https://hackmd.io/_uploads/S1PMOsbryl.png)
題目給了一個py檔和一個加密過的文字檔
* chal.py
```python=
FLAGTEXT = ???????????
FLAG = list(FLAGTEXT)
CIPHERTEXT = ""
chart0 = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
chart1 = ["H","Q","W","F","R","L","M","G","X","E","Y","C","I","T","S","K","P","V","D","B","N","O","U","J","Z","A"]
chart2 = ["M","Y","P","O","L","S","G","D","C","T","H","E","Z","Q","I","N","B","K","R","U","V","F","J","A","X","W"]


for i in range(len(FLAG)):
  FLAG[i] = chart1[(chart0.index(FLAG[i]) + i%26)%26]
  FLAG[i] = chart2[(chart0.index(FLAG[i]) + (i//26)%26)%26]

CIPHERTEXT = "".join(FLAG)
print(CIPHERTEXT)
```

* chal.txt
```
DYVKVWRDJJOMMHVKTILBCIHIUSUQQBQFRFKJMMMJDFRICQBARYZGTDGVWYPLPERDMPZDRPQHRPLWYCJBNHZJPPEPKSFXXRFXBTSEHQJJAFPUPUPEVAVTPLITVNCBJHQVIHXRTEKXUAQZHNTKEWLTWKWQRQMEXXXZNIULFJICNSTTOCDCWEBYYZWWZQURIDNMSMCKFKQPVNGNXSPUWAYQBECHULEQWIRIZCHYYCCLBABYXOEQRAAPDPYWVZCMCKGAWVAINEKXUIQKVOVLRELBDTKTONINWEYZWQVEEFSSIMPYZNB
```
這是一個雙重替換加密系統，第一層他用`(i//26)%26`當位移量，第二層是`i%26`
所以解密流程就是`密文 -> chart2反查 -> 減去(i//26)%26位移 -> chart1反查 -> 減去i%26位移 -> 明文`
* solve.py
```python=
def decrypt(ciphertext):
    chart0 = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    chart1 = ["H","Q","W","F","R","L","M","G","X","E","Y","C","I","T","S","K","P","V","D","B","N","O","U","J","Z","A"]
    chart2 = ["M","Y","P","O","L","S","G","D","C","T","H","E","Z","Q","I","N","B","K","R","U","V","F","J","A","X","W"]
    
    cipher = list(ciphertext)
    
    for i in range(len(cipher)):
        pos = chart2.index(cipher[i])
        pos = (pos - (i//26)%26) % 26
        temp = chart0[pos]
        
        pos = chart1.index(temp)
        pos = (pos - i%26) % 26
        cipher[i] = chart0[pos]
    
    return "".join(cipher)

ciphertext = "DYVKVWRDJJOMMHVKTILBCIHIUSUQQBQFRFKJMMMJDFRICQBARYZGTDGVWYPLPERDMPZDRPQHRPLWYCJBNHZJPPEPKSFXXRFXBTSEHQJJAFPUPUPEVAVTPLITVNCBJHQVIHXRTEKXUAQZHNTKEWLTWKWQRQMEXXXZNIULFJICNSTTOCDCWEBYYZWWZQURIDNMSMCKFKQPVNGNXSPUWAYQBECHULEQWIRIZCHYYCCLBABYXOEQRAAPDPYWVZCMCKGAWVAINEKXUIQKVOVLRELBDTKTONINWEYZWQVEEFSSIMPYZNB"
print(decrypt(ciphertext))
```
解完之後會長這樣
```
ASUBSTITUTIONCIPHERISATYPEOFENCRYPTIONMETHODINWHICHEACHLETTERORSYMBOLINTHEPLAINTEXTISREPLACEDBYACORRESPONDINGLETTERSYMBOLORNUMBERINTHECIPHERTEXTTHISENCRYPTIONMETHODISCALLEDSUBSTITUTIONBECAUSEEACHCHARACTERINTHEPLAINTEXTISSUBSTITUTEDFORANOTHERONEACCORDINGTOAFIXEDSYSTEMTHEFLAGISSHIFTINGSUBSTITUTIONIFSOFUN
```
之後再搜尋關鍵字 `FLAG` 就可以找到答案 `ICED{SHIFTINGSUBSTITUTIONIFSOFUN}`
