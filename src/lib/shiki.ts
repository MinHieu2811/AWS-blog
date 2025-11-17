import type { JSX } from 'react'
import type { BundledLanguage, BundledTheme } from 'shiki/bundle/web'

import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, isValidElement } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { codeToHast } from 'shiki/bundle/web'

export async function highlight(
  code: string,
  lang: BundledLanguage,
  themes: Record<string, BundledTheme> = {
    light: 'github-light',
    dark: 'github-dark'
  }
) {
  try {
    const lightHast = await codeToHast(code, {
      lang,
      theme: themes.light
    })

    const darkHast = await codeToHast(code, {
      lang,
      theme: themes.dark
    })

    const lightJsx = toJsxRuntime(lightHast, {
      Fragment,
      jsx,
      jsxs
    }) as JSX.Element

    const darkJsx = toJsxRuntime(darkHast, {
      Fragment,
      jsx,
      jsxs
    }) as JSX.Element

    if (isValidElement(lightJsx) && isValidElement(darkJsx)) {
      const lightProps = {...(lightJsx.props || {}), key: 'light'} as { className?: string; children?: React.ReactNode }
      const darkProps = {...(darkJsx.props || {}), key: 'dark'} as { className?: string; children?: React.ReactNode }

      // Ensure the className includes 'shiki' for proper styling
      const lightClassName = [lightProps.className, 'block-code-light'].filter(Boolean).join(' ');
      const darkClassName = [darkProps.className, 'block-code-dark'].filter(Boolean).join(' ');

      return jsx('div', {
        className: 'shiki-container',
        children: [
          jsx('div', {
            className: lightClassName,
            children: lightProps.children,
            ...lightProps,
          }),
          jsx('div', {
            className: darkClassName,
            children: darkProps.children,
            ...darkProps,
          }),
        ],
      });
    }

    return null
  } catch (error) {
    console.error(error)

    return null
  }
}
