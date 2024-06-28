import Home from "../../components/home"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default:`Employee management system`,
    template:` %s `
  },
  description: `Manage employee leave applications , track performances and keep track of time being spent on various company projects for free`,
}

export default function Page () {
    return (
      <Home/>
    )
}

