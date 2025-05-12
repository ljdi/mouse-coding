import { DashboardLayout } from '@/components/layout/dashboard'
import { SearchBar } from '@/components/search-bar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout search={<SearchBar />}>{children}</DashboardLayout>
}
