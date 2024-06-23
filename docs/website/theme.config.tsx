import { DocsThemeConfig } from 'nextra-theme-docs'
import { Footer } from './components/layout/footer'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'
import { getPagesUnderRoute } from 'nextra/context'

interface Page {
  kind: 'MdxPage'
  name: string
  route: string
  frontMatter: {
    title: string
    description: string
    date: string
    author: string
    category: string
    image?: string
  }
}

interface Folder {
  kind: 'Folder'
  name: string
  children: (Page | Folder)[]
}

type Content = Page | Folder

const isPage = (content: Content): content is Page => content.kind === 'MdxPage'

const theme: DocsThemeConfig = {
  docsRepositoryBase: 'https://github.com/rooch-network/rooch/blob/main/docs/website',
  nextThemes: {
    defaultTheme: 'system',
  },
  logo: (
    <div>
      <Image
        src="/logo/rooch_black_combine.svg"
        alt="Rooch Architecture"
        width={100}
        height={70}
        className="dark:hidden"
      />
      <Image
        src="/logo/rooch_white_combine.svg"
        alt="Rooch Architecture"
        width={100}
        height={70}
        className="hidden dark:block"
      />
    </div>
  ),
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      if (asPath.includes('/docs/')) {
        return {
          titleTemplate: '%s – Rooch Network Documentation',
        }
      }
      return {
        titleTemplate: '%s – Rooch Network',
      }
    } else {
      return {
        titleTemplate: '%s',
      }
    }
  },
  head: function useHead() {
    const { title, frontMatter } = useConfig()
    const router = useRouter()
    const { asPath } = router
    const currentLang = router.locale
    let pageTitle = title || 'Rooch Network'
    let pageDescription = frontMatter.description || ''
    let ogImage = 'https://rooch.network/logo/rooch-banner.png'

    // 获取 blog 的元数据
    if (asPath.startsWith('/blog/')) {
      const contents = getPagesUnderRoute('/blog') as Content[]
      const currentPage = contents.find(
        (content): content is Page => isPage(content) && content.route === asPath,
      )
      if (currentPage) {
        pageTitle = `${currentPage.frontMatter.title} – Rooch Network`
        pageDescription = currentPage.frontMatter.description || pageDescription
        ogImage = currentPage.frontMatter.image
          ? `https://rooch-git-website-240622-rooch.vercel.app${currentPage.frontMatter.image}`
          : ogImage
      }
    } else {
      pageDescription =
        currentLang === 'en-US'
          ? 'Unlocking infinite utility for the Bitcoin Economy'
          : '开启比特币经济的无限可能'
    }

    return (
      <>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />

        {/* Open Graph 元标签 */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://rooch-git-website-240622-rooch.vercel.app${asPath}`}
        />

        {/* Twitter 元标签 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@RoochNetwork" />
        <meta name="twitter:creator" content="@RoochNetwork" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Rooch Network" />

        {/* 多语言链接 */}
        <link
          rel="alternate"
          href={`https://rooch-git-website-240622-rooch.vercel.app${asPath}`}
          hrefLang="x-default"
        />
        <link
          rel="alternate"
          href={`https://rooch-git-website-240622-rooch.vercel.app${asPath}`}
          hrefLang="en-us"
        />
        <link
          rel="alternate"
          href={`https://rooch-git-website-240622-rooch.vercel.app${asPath}`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`https://rooch-git-website-240622-rooch.vercel.app/zh-CN${asPath}`}
          hrefLang="zh-cn"
        />
        <link
          rel="alternate"
          href={`https://rooch-git-website-240622-rooch.vercel.app/zh-CN${asPath}`}
          hrefLang="zh"
        />

        {/* 网站图标 */}
        <link rel="icon" href="/logo/rooch_black_logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/logo/rooch_black_logo.png" type="image/png" />
        <link
          rel="icon"
          href="/logo/rooch_white_logo.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/logo/rooch_white_logo.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
    )
  },
  project: {
    link: 'https://github.com/rooch-network',
  },
  chat: {
    link: 'https://discord.gg/rooch',
  },
  i18n: [
    { locale: 'en-US', text: 'English' },
    { locale: 'zh-CN', text: '简体中文' },
  ],
  footer: {
    component: Footer,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
}

export default theme
