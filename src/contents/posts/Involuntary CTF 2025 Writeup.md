---
title: Involuntary CTF 2025 Writeup
published: 2025-06-30
category: CTF
licenseName: "Unlicensed"
author: xzhiyouu
sourceLink: "https://hackmd.io/@xzhiyouu/r1PoSf6Nxl"
draft: false
---
> rank: 64/785

~~剛段考完~~想說來耍費一下打個CTF
解了五題之後就跑去弄生科期末報告了

![image](https://hackmd.io/_uploads/HyMQLfT4eg.png)

![image](https://hackmd.io/_uploads/S1hGGG1Bel.png)


## misc
### First steps [50]
![image](https://hackmd.io/_uploads/H1AdLza4eg.png)

Flag: `!FLAG!{H4ckers_f1rst_st3ps}!FLAG!`

---

## web exploitation
### Lottery [250]
![image](https://hackmd.io/_uploads/H1Pp8G6Egl.png)

進去之後是個猜數字的網頁
但猜對的機率是10^19分之1
翻原始碼發現這段 javascript
```javascript=
<script>
        function isNumeric(value) {
            return /^-?\d+$/.test(value);
        }

        async function lottery() {
            string = document.getElementById("userString").value;
            output = document.getElementById("display");
            if (!isNumeric(string)) {
                output.innerHTML = "Must enter a number";
            }
            else {
                randomNum=Math.random().toString();
                console.log(randomNum);
                randomNum = randomNum.substr(2,randomNum.length);

                resultjson=""
                try {
                    const response = await fetch("/rollthedice/flag", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({number:randomNum,guess:string}),
                    });


                    if (response.ok) {
                        const result = await response.json();
                        resultjson = await result.flag
                        

                    } else {
                        console.error('Error:', response.status, response.statusText);
                    }
                } catch (error) {
                    console.error('Error:', error.message);
                }

                output.innerHTML=resultjson;
            }
        }
    </script>
```

其實他後端沒有驗證 `randomNum` 是亂數生出來的，也就是說，只要自己指定 `number` 和 `guess` 一樣的話，就可以拿到 flag
#### Exploit Payload
```javascript=
(async () => {
    const number = "13371337";
    const res = await fetch("/rollthedice/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, guess: number })
    });

    const { flag } = await res.json();
    console.log(flag);
})();

```
![image](https://hackmd.io/_uploads/rkKc_f64ge.png)

Flag: `!FLAG!{N0t_so_r4nd0m!!}!FLAG!`

---

## reversing
### Basic python [100]
![image](https://hackmd.io/_uploads/r1BCOzpNxg.png)
* `basicPython.py`
```python=
def getFLag():
    file=open("flag.txt","rt")
    fileContents=file.read().strip()
    return fileContents

def main():
    a=getFLag()
    b=[]
    for i in range(len(a)):
        if(i%2==0):
            b.append(ord(a[i])+i)
        else:
            b.append(ord(a[i])-i)

    for i in range(len(b)//2):
        temp=b[-i]
        b[-i]=b[i]
        b[i]=temp

    print(b)

main()
```
* `solve.py`
```python=
def decrypt():
    e = [33, 73, 32, 103, 39, 106, -2, 159, 0, 151, 80, 140, 66, 128, 87, 78,
         79, 119, 27, 117, 8237, 95, 91, 133, 80, 135, 80, 130, 39, 116,
         105, 105, 110, 56, 71, 129, 28, 75, 62, 78, 69]
    
    i = 0
    while i < len(e) // 2:
        if i != 0:
            tmp = e[i]
            e[i] = e[-i]
            e[-i] = tmp
        i += 1

    out = []
    i = 0
    while i < len(e):
        if i % 2 == 0:
            n = e[i] - i
        else:
            n = e[i] + i
        if 0 <= n <= 0x10FFFF:
            out.append(chr(n))
        else:
            out.append('?')
        i += 1

    return ''.join(out)

print(decrypt())
```
Flag: `!FLAG!{N0w_th4t_wasn’t_2_h4rd_now!}!FLAG!`

### this flaG Doesn't Bite [250]
![image](https://hackmd.io/_uploads/BySOqMpExl.png)

他問說輸出是 `2d5a0b1c0e2f3d3e` 時，輸入了什麼訊息
先檢查檔案，給了一個ELF檔案
```bash
xzhiyouu@DESKTOP-9SMADFC:~/involuntaryCTF$ file a.out
a.out: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=c6a48156a92ad43bae82d99aa054f24cac1eb4db, for GNU/Linux 3.2.0, not stripped
```
用 `r2` 分析一下
跳到 `0x11a0` 然後 `pd` 反編譯
大概會長這樣
![image](https://hackmd.io/_uploads/r1Uy3f64xg.png)

Flag: `!FLAG!{D3bugFTW}!FLAG!`

---

## cryptography
### Enter the crypt [100]
![image](https://hackmd.io/_uploads/HkUN2GpEeg.png)

用頻率分析解

Flag: `!FLAG!{Fr3quency_4n4lysis}!FLAG!`
