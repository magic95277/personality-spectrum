# 人格光谱｜16型人格倾向测试

这是一个手机端优先的16型人格倾向测试，包含48道原创题目、四维量化结果、16种类型解析、本机进度保存和结果分享。

## 重要说明

- 题目、类型名称和报告文案均为独立原创，并非MBTI®官方题库。
- 测评结果只用于自我观察和娱乐体验，不能替代专业心理评估。
- 答案默认只保存在用户自己的浏览器中，不上传姓名、手机号或答题数据。
- 这个GitHub Pages版本不包含账号、数据库和支付功能。

## 使用GitHub Pages发布

请把仓库命名为：

```text
personality-spectrum
```

上传全部源码后：

1. 打开仓库的 `Settings`。
2. 在左侧点击 `Pages`。
3. 在 `Build and deployment` 下，把 `Source` 改成 `GitHub Actions`。
4. 打开仓库顶部的 `Actions`，等待“发布人格光谱网站”显示绿色对勾。
5. 返回 `Settings → Pages`，点击系统显示的网站地址。

默认网址格式：

```text
https://你的用户名.github.io/personality-spectrum/
```

以后每次修改并提交到 `main` 分支，GitHub都会自动重新生成和发布网站。

## 本地开发

需要Node.js 22和pnpm：

```bash
pnpm install
pnpm run dev
```

生成GitHub Pages静态版本：

```bash
GITHUB_PAGES=true GITHUB_REPOSITORY=你的用户名/personality-spectrum pnpm run build:pages
```

## 内容位置

- `app/page.tsx`：题目、计分规则和16种类型报告。
- `app/globals.css`：页面配色、排版和手机适配。
- `app/layout.tsx`：网页标题和说明。
- `.github/workflows/deploy-pages.yml`：GitHub自动发布流程。

正式商业上线前，还需要独立服务器、数据库、安全的支付回调、隐私政策、用户协议及相应备案和经营资质。
