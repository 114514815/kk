# OG 图片说明

## 当前状态
- `assets/og.svg` 已生成（1200x630，社交平台 OG 推荐尺寸）
- 部分平台（Facebook、LinkedIn）支持 SVG
- **X/Twitter、Discord 缓存只接受 PNG/JPG**

## 推荐生成 PNG（部署前做一次）

```bash
# 任选其一
# 1) ImageMagick
convert -density 96 -background none assets/og.svg -resize 1200x630 assets/og.png

# 2) rsvg-convert（更精准）
rsvg-convert -w 1200 -h 630 assets/og.svg -o assets/og.png

# 3) 在线工具
# https://cloudconvert.com/svg-to-png
```

## 部署后再次推送
1. 生成 `assets/og.png`（约 50-150KB）
2. `git add assets/og.png && git commit -m "add og image"`
3. 用 [Twitter Card Validator](https://cards-dev.twitter.com/validator) 验证
4. 用 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 验证

## 不生成 PNG 也能用
- LinkedIn / Slack / 部分 Discord 客户端可识别 SVG og:image
- 主页打开还是正常显示，OG 主要是分享到第三方时用