---
title: CachyOS 桌面环境搭建笔记
date: 2026-04-24
tags: linux, desktop, cachyos
---

## 为什么选 CachyOS

CachyOS 是基于 Arch 的发行版，内核经过优化（x86-64-v3/v4），预装了一些实用工具。对于想要 Arch 灵活度又不想从零开始配的人来说是个不错的选择。

## 桌面环境选择

我目前用的是 KDE Plasma，原因很简单：

- 自定义程度高
- Wayland 支持持续改善
- 内置的 KWin 脚本/特效生态

## 必备软件清单

```bash
# 基础工具
sudo pacman -S git base-devel curl wget

# 终端
sudo pacman -S kitty fish starship

# 开发
sudo pacman -S nodejs python go rust

# 日常
sudo pacman -S firefox vlc gimp
```

## KDE 配置小贴士

几个我个人觉得实用的配置：

1. **快捷键**：`Meta + Enter` 打开终端，`Meta + D` 显示桌面
2. **虚拟桌面**：用 6 个虚拟桌面替代最小化窗口的习惯
3. **KWin 脚本**：开启 rounded corners 特效让窗口圆角更好看

## 遇到的坑

> **NVIDIA + Wayland**：如果你用 NVIDIA 显卡，记得在内核参数里加 `nvidia_drm.modeset=1`，否则 Wayland 会话可能起不来。

后续会单独写一篇 Wayland + NVIDIA 的详细配置指南。
