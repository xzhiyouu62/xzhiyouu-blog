---
title: US Cyber Open Competitive CTF writeup
published: 2025-06-12
category: CTF
licenseName: "Unlicensed"
author: xzhiyouu
sourceLink: "https://hackmd.io/@xzhiyouu/r1K3T4_mxl"
draft: false
---
### Cookie (Web)
<img src="https://hackmd.io/_uploads/S1jwAVOmlx.png"  width="450" />

首先進去網頁會有一個可愛的老鼠<br>

<img src="https://hackmd.io/_uploads/Hkuz1ruQee.png"  width="600" />

其實一開始我以為這題只是改cookie而已<br>
~~結果好像沒那麼直觀~~<br>
發現一個叫cookie的cookie (?<br>
```
QWZ0ZXIgaW5zcGVjdGluZyB0aGUgY29udGVudHMsIGhlJ2xsIGhvcCBvbiB0aGUgUk9CT1QgdmFjY3V1bSBwaWNraW5nIHVwIHRoZSBjcnVtYnMgaGUgbWFkZS4KQ3J1bWIgMTogZFY5Q1FHc3paRjloVA==
```
base64 解碼出來會是這樣<br>
```
After inspecting the contents, he'll hop on the ROBOT vaccuum picking up the crumbs he made.
Crumb 1: dV9CQGszZF9hT
```
得到第一段 flag: `dV9CQGszZF9hT`<br>
base64 解碼後: `u_B@k3d_aL`<br>
接著因為他提到 `ROBOT` ，所以看了一下 `/robots.txt`<br>
```
User-agent: *
Disallow: /admin

# The robot vaccuum arrives at a locked door, which naturally he'll want to get inside
# Crumb 2: jB0SDNSX2MwMG
```
拿到第二段 flag: `jB0SDNSX2MwMG`<br>
但發現沒辦法單獨 base64 解碼，需要和第一段結合在一起，得到 `u_B@k3d_aN0tH3R_c00`<br>
接著進到 `/admin`<br>
出現一個登入頁面<br>

<img src="https://hackmd.io/_uploads/S1cplBO7ex.png"  width="600" />

看了一下原始碼發現他直接把當第三段 flag 和登入後的路徑寫出來了<br>

```javascript=
<script>
        const ADMIN_USER = 'admin';
        const CRUMB_3 = 'sxM19mT3JfZEF';
        function login() {
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (user === ADMIN_USER && pass === CRUMB_3) {
                window.location.href = '/kitchen';
            } else {
                document.getElementById('error').style.display = 'block';
            }
        }
</script>
```
目前三段 flag 拼湊出的答案 `u_B@k3d_aN0tH3R_c00k13_fOr_dA`<br>
接著進入 `/kitchen`<br>

<img src="https://hackmd.io/_uploads/H17SWSdXel.png"  width="600" />


* README.txt
```
Breaking into the door will make him thirsty, he'll want to find a glass of MILK.

Crumb 3? Try the password on the door.
```
* /floor/aNoteFallenFromTheFridge.txt
```
Steps to making my Fully Layered And Golden (FLAG) Cookie Recipe:

Ingredients:
- 4 Crumbs 
- Butter
- Flour
- Sugar

Tools:
- Cookie Editor
- Large Mixing Bowl
- Sheet Pan
- Oven

Instructions:
1) Preheat oven to 320 degrees.
2) Assemble all 4 crumbs in order from 1 to 4. 
3) Place assembled crumbs into the oven for 20 minutes to bake into a cookie.
4) Decode the assembled cookie using Base64 until nice and golden.
4) Use Cookie Editor to edit the original cookie with our new assembled cookie.
5) Refresh the home page.
6) Enjoy your FLAG cookie~!
```
* /refrigerator/Milk.js
```javascript=
// If he asks for a glass of milk, he's going to want a cookie to go with it.

function pourMilk() {
    console.log("Pouring a fresh glass of milk... 🥛");
}

//TODO: Follow cookie instructions written on NOTE in /kitchen
function bakeCookie() {
    var crumb4 = "fTW9VNWUhISE=";

    return false;
}

pourMilk();
```
發現第四段 flag，把四段 flag 結合在一起後得到<br>
`u_B@k3d_aN0tH3R_c00k13_fOr_dA_MoU5e!!!`

**但這不是最後的答案！！！**<br>

根據 `aNoteFallenFromTheFridge.txt`<br>
他說要把拼湊出的這串拿去替換 home page 的 cookie ，才能拿到最終的 flag<br>

<img src="https://hackmd.io/_uploads/HJH4fH_7ll.png"  width="600" />

<img src="https://hackmd.io/_uploads/H1K4MSdXle.png"  width="600" />

### Prime Suspects

<img src="https://hackmd.io/_uploads/rkA8GruXle.png"  width="450" />


把 n 分解成 p 和 q 就可以了<br>
```python=
>>> from Crypto.Util.number import *
>>> n = 102064367305175623005003367803963735992210717721719563218760598878897771063019
>>> p = 305875545128432734240552595430305723491
>>> q = 333679396508538352589365351078683227609
>>> e = 65537
>>> c = 66538583650087752653364112099322882026083260207958188191147900019851853145222
>>> phi_n = (p-1)*(q-1)
>>> d = inverse(e, phi_n)
>>> pow(c, d, n)
475771530942622400836342960890124188807255520125
>>> long_to_bytes(475771530942622400836342960890124188807255520125)
b'SVUSCG{sm4ll_pr1m3s}'
```
~~又無聊打開CTFtime找有沒有好玩的~~

~~看到這個的時候他們比賽時間只剩不到一小時了~~

~~想說隨便打個幾題簡單的看看~~
