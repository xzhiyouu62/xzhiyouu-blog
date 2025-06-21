---
title: 架設本地 AI
published: 2025-06-22
description: 使用 Ollama + DeepSeek-R1:8B + Open WebUI
category: project
licenseName: "Unlicensed"
author: xzhiyouu
sourceLink: "https://hackmd.io/@xzhiyouu/HyILpP44lx"
draft: false
---
## 一、安裝 Ollama

Ollama 是一個方便的本地 LLM 執行框架，支援多種模型，包括 Meta LLaMA、Mistral、DeepSeek 等。

### 步驟如下：

1. 進入 Ollama 官方網站： [https://ollama.com/](https://ollama.com/)
2. 根據你的作業系統下載對應版本並安裝（Windows / macOS / Linux）

## 二、下載 DeepSeek-R1 模型

DeepSeek 是一款開源且功能強大的語言模型系列，如果是筆電建議選擇 8b 或以下的版本，我選擇 DeepSeek-R1:8B 當作參考。

### 執行以下指令來下載並啟動模型：

```powershell
ollama run deepseek-r1:8b
```
啟動後，你可以直接在 PowerShell 裡與模型互動。

## 三、搭配 Open WebUI

使用 Open WebUI 可以擁有像網頁一樣的互動介面。

### 安裝 Docker

1. 前往 [Docker 官網](https://www.docker.com/) 下載並安裝 Docker Desktop。
2. 安裝完後，確認 Docker 可以正常執行：
   ```powershell
   docker --version
   ```

### 執行 Open WebUI 容器

使用下列指令來拉取並執行 Open WebUI：

```powershell
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

這個指令說明：

- `-d`：背景執行容器
- `-p 3000:8080`：將本機的 3000 port 映射到容器的 8080 port
- `-v open-webui:/app/backend/data`：將資料儲存到 docker volume
- `--name open-webui`：給這個容器一個名字

完成後會在 Docker Desktop 看到這樣的介面
代表容器已經正常啟動並且在運作中
![image](https://hackmd.io/_uploads/r1lK0D44gl.png)


### 開啟網頁使用介面

瀏覽器開啟： [http://localhost:3000](http://localhost:3000)
第一次進入時會要求設定登入用的 Admin 帳密

出現這樣的畫面就代表完成啦！
![image](https://hackmd.io/_uploads/HyTGyu44eg.png)
