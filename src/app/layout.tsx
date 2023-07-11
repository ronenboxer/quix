import AppLayout from '@/components/appLayout'
import '../styles/main.scss'
import { Providers } from "@/store/providers"

export const metadata = {
  title: 'quix',
  description: 'A wix clone app with EditorX implementation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <AppLayout>
            {children}
          </AppLayout>
        </body>
      </Providers>
    </html>
  )
}
