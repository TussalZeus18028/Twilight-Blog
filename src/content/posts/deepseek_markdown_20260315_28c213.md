---
title: 为什么我选择 Twilight 作为博客模板
published: 2025-03-15
description: 一个高度可定制、功能丰富的 Astro 博客主题。
cover: ./twilight-cover.jpg
tags: [Astro, 博客, 定制]
category: [Guides, 心得]
comment: true
---

## 始于颜值，陷于功能

初次见到 Twilight，我就被它的简洁设计和丰富定制选项所吸引。它不仅能轻松调整主题色，还支持轮播壁纸和波浪动画。

### 全局配置示例

在 `twilight.config.yaml` 中，我将主题色改为温暖的橙色：

```yaml
site:
  themeColor:
    hue: 30
  wallpaper:
    banner:
      mode: carousel
      waves:
        enable: true